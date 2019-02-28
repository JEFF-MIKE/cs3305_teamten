function selectRoles(data,callback){
    /* 
    Callback function for checking to see if the user should be able
    to view a certain website or not. Data is id.
    */
   let sql = "SELECT * FROM `roles` where id = ?;";
   db.query(sql,data,(err,rows) => {
       if (err){
           callback(err,null);
       } else{
           let retObj = {
               admin: rows[0].admin,
               reviewer: rows[0].reviewer,
               researcher: rows[0].researcher,
               funder: rows[0].funder
           };
           callback(null,retObj);
       }
   });
}

exports.viewSubmittedApplications = (req,res) => {
    // check to see if they are logged in first
    if (req.session.user_id === undefined && req.session.user_name === undefined) {
        let string = encodeURIComponent('0');
        return res.redirect("/?errorStatus=" + string);
    }
    // we never submit data through this function, so it must be a GET.
    selectRoles(req.session.user_id,(err,roleObject) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            //check here to see if the user is actually a reviewer or not
            if (roleObject.reviewer === "NO") {
                let string = encodeURIComponent('0');
                return res.redirect("/?errorStatus=" + string);
            } else {
                // perform a GET on the data.
                // passes through the array of results to the ejs render
                let sql = "SELECT * FROM applications WHERE `is_draft` = 0;";
                db.query(sql,(err,result) => {
                    res.render("reviewApplications.ejs",{ resultList: result,userName:req.session.user_name });
                });
            }
        }
    });
}

exports.reviewSubmittedApplication = (req,res) => {
    // when you click on an individual application, the reviewer will be
    // asked to either submit their review or save as draft
    if (req.session.user_id === undefined && req.session.user_name === undefined) {
        let string = encodeURIComponent('0');
        return res.redirect("/?errorStatus=" + string);
    }
    selectRoles(req.session.user_id,(err,roleObject) => {
        if (err){
            console.log(err);
            res.send(err);
        } else {
            if (roleObject.reviewer === "NO"){
                let string = encodeURIComponent('0');
                return res.redirect("?/errorStatus=" + string);
            } else {
                    // just a GET again.
                    let application_id = req.query.application_id;
                    let sql = "SELECT * FROM applications WHERE application_id = ? AND is_draft = ?;";
                    db.query(sql,[req.query.application_id,0],(err,result) => {
                        // Grab the data from the database and then display the
                        // data to the reviewer.
                        if (result.length) {
                            // Assign variables and then render the single
                            // application to the reviewer. 
                            res.render("submitReview.ejs",{resultList:result, userName: req.session.user_name});
                        } else {
                            res.send("An error occured with the database!");
                        }
                    });
                }
            }
        });
}