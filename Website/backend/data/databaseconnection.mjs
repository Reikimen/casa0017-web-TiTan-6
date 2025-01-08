import mysql from 'mysql2/promise';
// import { config } from 'dotenv';
import * as Config from '../data/env.mjs';
// config();

// const db = mysql.createPool({
//     host: Config.DB_HOST || 'localhost',
//     port: Config.DB_PORT || 3306,
//     user: Config.DB_USER || 'root',
//     password: Config.DB_PASSWORD || '',
//     database: Config.DB_NAME || 'my_local_database',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// export default db;

// import mysql from 'mysql2/promise';
export async function createConnection() {
   
try {
 const connection = await mysql.createConnection(
    'mysql://'+Config.DB_USER+':'+ Config.DB_PASSWORD+ '@'+ Config.DB_HOST +':'+ Config.DB_PORT +'/'+ Config.DB_NAME
      
);
 return connection;
} catch (err) {
  console.log(err);
}
}
