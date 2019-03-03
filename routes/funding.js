// home page
exports.funding = (req, res) => {
  // function for getting SQL data of active calls for proposals
  let sql = "SELECT * FROM calls where active_status = 1"
  db.query(sql, (err,rows) => {
      if (err) throw err;
      if (rows.length) {
        return res.render('funding.ejs',{rows:rows,userName: req.session.user_name});
      }
  });
}
