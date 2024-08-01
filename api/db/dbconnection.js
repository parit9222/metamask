import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database: ', err);
        return;
    }
    console.log('DATABASE CONNECTED SUCCESSFULLY !');
    connection.release();
});

export default pool.promise();