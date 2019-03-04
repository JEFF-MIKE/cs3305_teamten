exports.editProfile = (req, res) => {
  if (req.method === "GET"){
    let userID = req.session.user_id;

    if (userID === undefined){
        let string = encodeURIComponent('0');
        res.redirect("/?errorStatus=" + string);
        return;
    } else{
      return res.render('editProfile.ejs'}
  }
  elif (req.method === "POST"){

    let userID = req.session.user_id;

    if (userID === undefined){
        let string = encodeURIComponent('0');
        res.redirect("/?errorStatus=" + string);
        return;
    } else{

        // function for getting SQL data of active calls for proposals
        let sql = "INSERT INTO table"
        db.query(sql, (err,rows) => {
            let message = "Successfuly updated profile!";


            if (err) throw err;
            if (rows.length) {
              return res.render('editProfile.ejs',{
                message: message
              });
            }
        });
    }
  }
}
