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
 * @param {Array} result1 - First query result (user's)
 * @param {Array} result2 - Second query result (expected)
 * @returns {boolean} - True if results match, false otherwise
 */
export function compareResults(result1, result2) {
  if (!result1 || !result2) return false;
  if (result1.length !== result2.length) return false;
  if (result1.length === 0) return true; // Both empty

  // Get the columns from both results
  const cols1 = Object.keys(result1[0]).sort();
  const cols2 = Object.keys(result2[0]).sort();

  // Find common columns - user query might select a subset of columns
  const commonCols = cols1.filter(col => cols2.includes(col));

  // If user selected columns that don't exist in expected result, that's wrong
  if (cols1.some(col => !cols2.includes(col))) return false;

  // User must have selected at least some columns
  if (commonCols.length === 0) return false;

  // Normalize function to handle numeric precision
  const normalizeValue = (val) => {
    if (typeof val === 'number') {
      return Math.round(val * 100) / 100;
    }
    return val;
  };

  // Create normalized row representations for comparison
  const createRowSignature = (row, cols) => {
    return cols.map(col => normalizeValue(row[col])).join('|');
  };

  // For queries without ORDER BY, we need to compare sets of rows
  // Create signatures for all rows in both results using common columns
  const signatures1 = result1.map(row => createRowSignature(row, commonCols)).sort();
  const signatures2 = result2.map(row => createRowSignature(row, commonCols)).sort();

  // Compare sorted signatures
  if (signatures1.length !== signatures2.length) return false;

  for (let i = 0; i < signatures1.length; i++) {
    if (signatures1[i] !== signatures2[i]) return false;
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
