// home page
exports.funding = (req, res) => {
  if (req.method === "GET"){

    let userID = req.session.user_id;

    if (userID === undefined){
        let string = encodeURIComponent('0');
        res.redirect("/?errorStatus=" + string);
        return;
    } else{

        // function for getting SQL data of active calls for proposals
        let sql = "SELECT * FROM calls where active_status = 1"
        db.query(sql, (err,rows) => {
            let call_id = "";
            let funder_user_id = "";
            let title = "";
            let expiry_date = "";
            let active_status = "";
            let is_draft = "";
            let description = "";

            if (err) throw err;
            if (rows.length) {
              return res.render('funding.ejs',{
                call_id: call_id,
                funder_user_id: funder_user_id,
                title: title,
                expiry_date: expiry_date,
                // active_status: active_status,
                // is_draft: is_draft,
                description: description
              });
            }
        });
    }
  }
}
