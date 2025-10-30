import { newDb } from 'pg-mem';
import { Buffer } from 'buffer';

// Polyfill Buffer for browser environment
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

/**
 * Executes a SQL query against an in-memory PostgreSQL database
 * @param {string} setupSQL - SQL statements to set up the database schema and data
 * @param {string} query - The user's SQL query to execute
 * @returns {Object} - { success: boolean, data: Array|null, error: string|null }
 */
export function executeSQLQuery(setupSQL, query) {
  try {
    // Create a new in-memory database
    const db = newDb();

    // Execute setup SQL to create tables and insert data
    if (setupSQL) {
      db.public.many(setupSQL);
    }

    // Execute the user's query
    const result = db.public.many(query);

    return {
      success: true,
      data: result,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message || 'Unknown error occurred'
    };
  }
}

/**
 * Compares two query results to see if they match
 * @param {Array} result1 - First query result
 * @param {Array} result2 - Second query result
 * @returns {boolean} - True if results match, false otherwise
 */
export function compareResults(result1, result2) {
  if (!result1 || !result2) return false;
  if (result1.length !== result2.length) return false;

  // Convert results to JSON for deep comparison
  // Sort to handle different ordering (unless ORDER BY is specified)
  const normalize = (arr) => {
    return arr.map(row => {
      // Convert to plain object and sort keys
      const obj = {};
      Object.keys(row).sort().forEach(key => {
        // Handle numeric values that might have slight precision differences
        if (typeof row[key] === 'number') {
          obj[key] = Math.round(row[key] * 100) / 100;
        } else {
          obj[key] = row[key];
        }
      });
      return obj;
    });
  };

  const normalized1 = normalize(result1);
  const normalized2 = normalize(result2);

  // Compare each row
  for (let i = 0; i < normalized1.length; i++) {
    const row1 = normalized1[i];
    const row2 = normalized2[i];

    // Compare keys
    const keys1 = Object.keys(row1).sort();
    const keys2 = Object.keys(row2).sort();

    if (keys1.length !== keys2.length) return false;
    if (!keys1.every((key, idx) => key === keys2[idx])) return false;

    // Compare values
    for (const key of keys1) {
      if (row1[key] !== row2[key]) return false;
    }
  }

  return true;
}

/**
 * Formats query results for display
 * @param {Array} data - Query result data
 * @returns {string} - Formatted string representation
 */
export function formatResults(data) {
  if (!data || data.length === 0) {
    return 'No results returned';
  }

  // Get column names from first row
  const columns = Object.keys(data[0]);

  // Create header
  let output = columns.join(' | ') + '\n';
  output += columns.map(() => '---').join(' | ') + '\n';

  // Add rows
  data.forEach(row => {
    output += columns.map(col => {
      const val = row[col];
      if (val === null) return 'NULL';
      if (typeof val === 'object') return JSON.stringify(val);
      return String(val);
    }).join(' | ') + '\n';
  });

  return output;
}
