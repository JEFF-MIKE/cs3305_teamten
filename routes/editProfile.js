exports.editProfile = (req, res) => {
  if (req.method === "GET"){
    // session details.
    let userID = req.session.user_id;
    let userName = req.session.user_name;

    if (userID === undefined){
        let string = encodeURIComponent('0');
        res.redirect("/?errorStatus=" + string);
        return;
    } else{
      let message = "";
      return res.render('editProfile.ejs',{
        message: message
      });
    }
  }
  else if (req.method === "POST") {

    // get the body
    let post  = req.body;
    // grab form data
    let first_name = post.first_name;
    let last_name = post.last_name;
    let email = post.email;
    let degree = post.degree;
    let field = post.field;
    let institution = post.institution;
    let location = post.location;
    let title = post.title;
    let journal_name = post.journal_name;

    let userID = req.session.user_id;
    let userName = req.session.user_name;

    if (userID === undefined){
        let string = encodeURIComponent('0');
        res.redirect("/?errorStatus=" + string);
        return;
    } else{

        // function for getting SQL data of active calls for proposals
        let sql = "UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?; UPDATE education SET degree = ?, field_of_study = ?, institution = ?, location = ? WHERE user_id = ?; UPDATE publications SET title = ?, journal_name = ? WHERE user_id = ?;"
        db.query(sql, [first_name, last_name, email, userID, degree, field_of_study, institution, location, userID, title, journal_name, userID] (err,rows) => {
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
