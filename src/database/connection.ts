import mysql from "promise-mysql";

let pool: mysql.Pool;

let createPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
  }
  return pool;
}

export default createPool();