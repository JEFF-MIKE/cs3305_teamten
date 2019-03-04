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


function grabApplicantDetails(data,callback){
    /* 
    Callback function for grabbing applicants details.
    */
   let sql = "SELECT id,first_name,last_name,user_name FROM users WHERE id in ?;";
   db.query(sql,data,(err,rows) => {
       if (err){
           callback(err,null)
       } else {
           callback(err,rows);
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

function checkCalls(data,callback){
    /* 
    Callback function for checking to see what calls the reviewer is assigned to.
    */
   let sql = "SELECT * FROM reviewers_calls WHERE reviewer_id = ?;";
   db.query(sql,data,(err,rows) =>{
       if (err){
           callback(err,null);
       } else {
           callback(null,rows);
       }
   });
}

function checkIsActive(data,callback){
    /* 
    Selects calls which are active.
    Data is a joined array
    */
   let sql = "SELECT * FROM calls where active_status = 1 AND call_id IN ( " + data + " );";
   db.query(sql,(err,rows) =>{
       if (err){
           callback(err,null);
       } else {
           callback(null,rows);
       }
   });
}

function applicationsForCall(data,callback){
    /* 
    Callback function for grabbing data from applications by
    call_id. data is call_id
    */
   let sql = "SELECT * FROM applications WHERE call_id = ? AND approved IS NULL;";
   db.query(sql,data,(err,rows)=>{
       if (err){
           callback(err,null);
       } else {
           callback(null,rows);
       }
   });
}
function grabSpecificReviews(data,callback){
    /* 
    Callback function for checking to see if a review on an
    application already exists by this user
    data is an object which contains call_id and user_id
    */
   let sql = "SELECT * FROM reviews_v1 WHERE call_id= ? AND reviewer_id = ? ;";
   db.query(sql,[data.call_id,data.reviewer_id],(err,rows) => {
       if (err){
           callback(err,null);
       } else {
           callback(null,rows);
       }
   });
}
exports.viewAssignedCalls = (req,res) => {
    if (req.session.user_name === undefined && req.session.user_id === undefined){
        return res.send("You must be logged in as a reviewer to continue!");
    }
    selectRoles(req.session.user_id,(err,roleObject) => {
        if (err){
            console.log(err);
            res.send(err)
        }
        if (roleObject.reviewer === "NO"){
            return res.send("You must be a reviewer in order to view this page.");
        } else {
            checkCalls(req.session.user_id,(err,assignedCalls) => {
                if (err){
                    console.log(err);
                    return res.send(err);
                } else if (!(assignedCalls.length)){
                    // reviewer has no assigned calls, exit...
                    return res.render("reviewerAssignedCalls.ejs",{userName:req.session.user_name,assignedCalls:[]});
                } else {
                    // list out the calls.
                    return res.render("reviewerAssignedCalls.ejs",{userName:req.session.user_name,assignedCalls:assignedCalls});
                }
            });
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
    if (req.query === {}){
        return res.send("Can't have blank query");
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
                let call_id = req.query.call_id;
                applicationsForCall(call_id,(err,applications) =>{
                    if (err){
                        console.log(err);
                        return res.send(err);
                    } else if (applications.length === 0){
                        return res.render("reviewApplications.ejs",{resultList:[],userName:req.session.user_name});
                    } else {
                        grabSpecificReviews({call_id:call_id,reviewer_id:req.session.user_id},(err,reviews) => {
                            if (err){
                                console.log(err);
                                res.send(err);
                            } else if (reviews.length === 0){
                                res.render("reviewApplications.ejs",{resultList:applications,userName:req.session.user_name});
                            } else{
                                // now filter out here and render final list
                                let resultList = [];
                                let applicationFlag = true;
                                for (let i =0;i<applications.length;i++){
                                    for (let p = 0;p< reviews.length;p++){
                                        if (applications[i].application_id === reviews[p].application_id){
                                            applicationFlag = false;
                                            break;
                                        }
                                    }
                                    if(applicationFlag){
                                        resultList.push(applications[i])
                                    } else {
                                        applicationFlag = true;
                                    }
                                }
                                return res.render("reviewApplications.ejs",{resultList:resultList,userName:req.session.user_name});
                            }
                        });
                    }
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