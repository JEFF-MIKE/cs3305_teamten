/*
Will go over with David Fox
const express = require('express')
const app = express()

app.use(express.urlencoded({ extended: true }));


app.post('store_applications.js', (req, res) => {
  const applicant_id = req.body.applicant_id
  const time_of_submission = new Date();
  const submission_version = 1
  const amount_requested = req.body.amount_requested
  const file_name = req.body.input_file_now
  const cover_note = req.body.cover_note
  const group_name = req.body.group_name
  res.end()
})




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
  var sql = "INSERT INTO applications(applicant_id, time_of_submission, \
            amount_requested, file_name, cover_note, submission_version,\
            group_id) VALUES ('"+ applicant_id +"', '"+ time_of_submission +"',\
            '"+ amount_requested +"', '"+ file_name +"', '"+ cover_note +"',\
            '"+ submission_version +"', '"+ group_name +"')";
            
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});
*/