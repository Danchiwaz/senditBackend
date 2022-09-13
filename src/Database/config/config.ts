import dotenv from 'dotenv';

require("dotenv").config();

const Pool = require("pg").Pool;


const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABSE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASS,
});

export default pool;