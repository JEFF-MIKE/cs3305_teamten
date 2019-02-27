/****** TEST FUNCTION FOR CHANGING PROFILE DATA (mainly altering their details) *********/

exports = changeProfileDetails = (req,res) => {
    let hobby = "";
    let animal = "";
    // check to see if user is logged in or not
    /*
    if (req.session.user_name === undefined && req.session.first_name === undefined){
        let string =encodeURIComponent('1');
        res.redirect("/"+string);
    }
    */
    if (req.method === "POST"){
        let sql = "SELECT hobby,animal FROM test_profile WHERE id = ?";
        db.query(sql,[1],(err,result) => {
            if (result.length);
            
        }
        );
    } else {
        // It's a GET method
        let sql = "SELECT hobby,animal FROM test_profile WHERE id = ?";
        db.query(sql,[1],(err,result) => {
            if (result.length) {
                let hobby = result[0].hobby;
                let animal = result[0].animal;
                res.render('changeProfile.ejs',{hobby:hobby,animal:animal});
            } else {
                res.send("We are experiencing issues! Please come back later");
            }
        });
    }
}