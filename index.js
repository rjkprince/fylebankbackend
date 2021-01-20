const express = require("express");
const dotenv = require("dotenv");
const pool = require("./db/db");
const { off } = require("./db/db");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

let port = process.env.PORT || 5000;
app.get("/api/branches", async (req, res) => {
  const { q, limit, offset } = req.query;
  let result;
  if (q != undefined && q != "") {
    result = await pool.query(
      "SELECT * FROM branches  WHERE LOWER(city)=LOWER($1) or LOWER(district)=LOWER($1) or LOWER(state)=LOWER($1) or LOWER(address)=LOWER($1) or LOWER(branch)=LOWER($1) or CAST( bank_id AS varchar )=($1)  ORDER BY ifsc LIMIT ($2) OFFSET ($3)",
      [q, limit, offset]
    );
  } else {
    result = await pool.query(
      "SELECT * FROM branches  ORDER BY ifsc LIMIT ($1) OFFSET ($2)",
      [limit, offset]
    );
  }

  res.send({
    total: result.rowCount,
    banks: result.rows,
  });
});
app.get("/api/cities", async (req, res) => {
  const result = await pool.query("select distinct city from branches");
  res.send({
    total: result.rowCount,
    cities: result.rows,
  });
});
app.get("/api/branches/autocomplete", async (req, res) => {
  const { q, limit, offset } = req.query;

  //   const result = await pool.query(
  //     "SELECT * FROM branches  WHERE LOWER(city)=LOWER($1) or LOWER(district)=LOWER($1) or LOWER(state)=LOWER($1) or LOWER(address)=LOWER($1) or LOWER(branch)=LOWER($1) or CAST( bank_id AS varchar )=($1)  ORDER BY ifsc LIMIT ($2) OFFSET ($3)",
  //     [q, limit, offset]
  //   );
  let result;
  if (q != undefined && q != "") {
    result = await pool.query(
      "SELECT * FROM branches WHERE POSITION(LOWER($1) in LOWER(branch))>0 ORDER BY ifsc LIMIT ($2) OFFSET ($3)",
      [q, limit, offset]
    );
  } else {
    result = await pool.query(
      "SELECT * FROM branches ORDER BY ifsc LIMIT ($1) OFFSET ($2)",
      [limit, offset]
    );
  }

  res.send({
    total: result.rowCount,
    banks: result.rows,
  });
});

app.listen(port, () => {
  console.log(port);
});
