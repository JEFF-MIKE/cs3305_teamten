exports.resetPassword = (req,res) => {
    // check to see if they are logged in or not:
    if (req.session.user_id !== undefined && req.session.first_name !== undefined) {
        let userName = req.session.first_name + req.session.last_name;
        let message = "";
        res.render('index.ejs',{userName:userName,message:message});
    }
    let status = "";
    if (req.method === "POST"){
        // get email from form;
        let email = req.body.email;
        // verify if it exists in the users email
        let sql = "SELECT email FROM users WHERE email=?;";
        db.query(sql,email,(err,result) => {
            if (err) throw err;
            if (result.length){
                // email verified
                let status = 'success';
                return res.render('passwordReset.ejs',{status:status});
            } else{
                let status = "error";
                // email was not in database, prompt to re-enter email.
                return res.render('passwordReset.ejs',{status:status});
            }
        });
    } else{
        // it's a get.
        res.render('passwordReset.ejs', {status:status});
    }
}