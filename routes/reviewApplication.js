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
               funder: rows[0].funder,
               research_office: rows[0].research_office
           };
           callback(null,retObj);
       }
   });
}

function checkReview(data,callback){
    /* 
    Callback function for checking if a review draft exists in the 
    database. Uses the application_id and user_id (reviewer_id) to check
    */
   let sql = "SELECT * FROM `reviews_v1` where application_id = ? AND reviewer_id = ?;";
   db.query(sql,[data.application_id,data.reviewer_id],(err,rows) => {
       if (err){
           callback(err,null);
       } else{
           callback(null,rows);
       }
   });
}

exports.saveReviewDraft = (req,res) => {
    if (req.session.user_name === undefined && req.session.user_id === undefined){
        let string = encodeURIComponent('0');
        return res.redirect("/?errorStatus=" + string);
    }
    selectRoles(req.session.user_id,(err,roleObject) => {
        let application_id = req.body.application_id;
        let applicant_id = req.body.applicant_id;
        let reviewText = req.body.txt;
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            //check here to see if the user is actually a reviewer or not
            if (roleObject.reviewer === "NO") {
                let string = encodeURIComponent('0');
                return res.redirect("/?errorStatus=" + string);
            } else {
                // submit the saved data into the database
                checkReview({application_id:application_id,reviewer_id:req.session.user_id}, (err,retObj) => {
                    if (err){
                        console.log(err);
                        res.send(err);
                    } else {
                        if (retObj.length){
                            // a draft exists, do update query on it.
                            let sql = "UPDATE reviews_v1 SET review_text = ?? WHERE review_id=?";
                            db.query(sql,[req.body.txt,retObj[0].review_id], (err,result) => {
                                if (err) throw err;
                                return res.send("Previously existing draft has been modified");
                            });
                        } else {
                            // a draft does not exist, an insert query must be performed on it.
                            let sql = "INSERT INTO reviews_v1 (applicant_id,application_id,reviewer_id,review_text,is_draft) \
                            VALUES (?,?,?,?,?)"
                            db.query(sql,[applicant_id,application_id,req.session.user_id,req.body.txt,1],(err,result) => {
                                if (err) throw err;
                                return res.send("New draft has been entered into the database");
                            });
                        }
                    }
                });
            }
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
    // will need to do inner join and outer join for the draft and new reviews
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
                    // applications are served on a first come first served basis
                    let sql = "SELECT * FROM applications WHERE application_id = ? AND is_draft = ? ORDER BY application_id;";
                    db.query(sql,[req.query.application_id,1],(err,result) => {
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

exports.finalizeReview = (req,res) =>{
    // confirms review and allows funders to see the application reviews;
    if (req.session.user_name === undefined && req.session.user_id === undefined){
        return res.send("You must be logged in to view this.");
    }
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
                let application_id = req.body.application_id;
                checkReview({application_id:application_id,reviewer_id:req.session.user_id},(err,retObj) => {
                    if (err) throw err;
                    if (retObj.length){
                        // review existed, update and mark as non draft;
                        let sql = "UPDATE reviews_v1 SET is_draft = 0,review_text = ? WHERE review_id = ?";
                        db.query(sql,[req.body.txt,retObj[0].review_id],(err,result) => {
                            res.send("Finalized draft review!");
                        });
                    } else {
                        // review did not exist, create it and mark it as non draft
                        let sql = "INSERT INTO reviews_v1 (applicant_id,application_id,reviewer_id,review_text,is_draft) \
                        VALUES (?,?,?,?,?);";
                        db.query(sql,[req.body.applicant_id,req.body.application_id,req.session.user_id,req.body.txt,0],(err) => {
                            if (err) throw err;
                            res.send("Finalized new review!");
                        });
                    }
                });
            }
    return;
    }});}