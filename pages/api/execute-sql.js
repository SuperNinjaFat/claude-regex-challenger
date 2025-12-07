import { PGlite } from '@electric-sql/pglite';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { setupSQL, userQuery } = req.body;

  if (!userQuery) {
    return res.status(400).json({ success: false, error: 'Query is required' });
  }

  try {
    // Create a new PGlite instance for each request (in-memory)
    const db = new PGlite();

    // Execute setup SQL if provided
    if (setupSQL) {
      await db.exec(setupSQL);
    }

    // Execute user query
    const result = await db.query(userQuery);

    // Close the database
    await db.close();

    return res.status(200).json({
      success: true,
      data: result.rows || []
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      error: error.message || 'Query execution failed'
    });
  }
}
