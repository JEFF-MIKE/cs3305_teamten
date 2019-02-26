
const express = require('express')
const app = express()

app.use(express.urlencoded({ extended: true }));


var mysql = require('mysql');

var con = mysql.createConnection({
  host: 'mysql.netsoc.co',
  user: 'mj',
  password: 'JCDQcTNBknX',
  database: 'mj_a_klaas_database'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "ALTER TABLE calls ALTER COLUMN active_status 0 WHERE expiry_date < CURRENT_DATE()";

  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record updated");
  });
});
