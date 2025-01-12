import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config();

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'mydatabase',
  };

// Connect to the database
const connectToDatabase = async () => {
    try {
      pool = await mysql.createPool(dbConfig);
      connection = await mysql.createConnection(dbConfig);
      console.log('Connected to the MySQL database.');
    } catch (err) {
      console.error('Error connecting to the database:', err);
      process.exit(1);
    }
  };


testConnection();

export default db;