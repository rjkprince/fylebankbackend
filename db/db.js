const Pool = require("pg").Pool;
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
  database: process.env.POSTGRESQL_ADDON_DB,
  host: process.env.POSTGRESQL_ADDON_HOST,
  user: process.env.POSTGRESQL_ADDON_USER,
  password: process.env.POSTGRESQL_ADDON_PASSWORD,
  port: 5432,
});
module.exports = pool;
