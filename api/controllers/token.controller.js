import dotenv from 'dotenv';
import db from '../db/dbconnection.js'

dotenv.config();



export const insertData = async (req, res) => {
  const jsonData = req.body;

  try {
    const insertQuery = 'INSERT INTO metamask_tokens (tokens, amount) VALUES ?'; 
    const values = jsonData.map(item => [item.tokens, item.amount]); 

    await db.query(insertQuery, [values]);

    res.status(200).json({ message: 'Data successfully uploaded' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Error inserting data' });
  }
};
