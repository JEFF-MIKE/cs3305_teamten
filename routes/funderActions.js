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

function selectReviewers(callback){
    /*
    Callback function for getting all the reviewers listed in the database.
    used in getFunderAssignReviewers
    */
    let sql = "SELECT * FROM roles WHERE reviewer = 'YES';";
    db.query(sql,(err,rows) =>{
       if (err){
            console.log("An error occured!");
            callback(err,null);
       } else {
            console.log("Successfully returned data.");
            console.log("This is rows:" + rows);
            callback(null,rows);
       }
   });
}

function checkAssignedReviewersForCall(data,callback){
    /*
    Callback function for checking which reviewers are currently assigned to which calls. 
    Data is call_id
    */
   let sql = "SELECT * FROM reviewers_calls WHERE call_id = ?;";
   db.query(sql,data,(err,result) => {
       if (err){
           callback(err,null);
       } else {
           callback(err,result);
       }
   });
}

function checkFunderCallID(data,callback){
    // function required to check whether the funder can 
    // in fact view these applications or not.
    // data is object containing user_id and 
    let sql = "SELECT * FROM calls WHERE funder_user_id = ? and call_id = ?;";
    db.query(sql,[data.user_id,data.call_id],(err,rows) => {
        if (err){
            callback(err,null);
        } else {
            callback(null,rows);
        }
    });
}

function getResearcherDetails(data,callback){
    /* 
    Callback function for getting the name,last name
    and username of the researcher who submitted the application.
    Data is a tuple of the user_ids
    */
   let sql = "SELECT first_name,last_name,user_name,id FROM `users` where id in " + data +" ;";
   db.query(sql,data,(err,rows) => {
       if (err){
           callback(err,null);
       } else {
           callback(null,rows);
       }
   });
}

function selectCalls(data,callback){
    /*
    Callback function for selecting what calls belong to which funder_user
    Returns an array which contain each call that belongs to the funder
    */ 
   let sql = "SELECT * FROM `calls` WHERE funder_user_id = ? ORDER BY call_id;";
   db.query(sql,data,(err,rows) => {
       if (err){
           callback(err,null);
       } else {
           callback(null,rows);
       }
    });
}
/*
function verifyCall(data,callback){
    Simplified callback function to make sure the funder and the call_id correlate.
   let sql = "SELECT call_id FROM calls WHERE funder_user_id = ? AND call_id = ?;";
   db.query(sql,[data.user_id,data.call_id],(err,rows) => {
       if (err){
           callback(err,null);
       } else {
           callback(null,err);
       }
   }
   );
}
*/

function grabRelatedApplications(data,callback){
    /* 
    Callback function for grabbing all the applications that relate
    to the call_id. Data is call_id.
    */
   let sql = "SELECT * FROM `applications` WHERE call_id = ? AND approved = 0 ORDER BY application_id;";
   db.query(sql,data,(err,rows) => {
       if(err){
           callback(err,null);
       } else {
           callback(null,rows)
       }
   });
}

function verifyApplicationToCall(data,callback){
    /* 
    Callback function to check whether we have access to 
    reviews on this application or not.
    Grabs the calls which funder has posted first then
    Grabs all reviews made for this application.
    */
   let sql = "SELECT call_id from calls where funder_user_id = ?;";
   // declare variables here so they can be used
   db.query(sql,data,(err,rows) => {
       if (rows.length){
        // call_ids grabbed
        let newArray = [];
        for (let q = 0;q<rows.length;q++){
            newArray.push(rows[q].call_id);
        }
        callback(null,"( " + newArray.join() + " )");
       } else{
           callback(err,null);
       }
   });
}
function grabRelevantReviews(data,callback){
   // data is user_id of funder and then application id
   verifyApplicationToCall(data.user_id,(err,callIds) => {
       if (err){
            return res.send("Call was invalid");
       } else {
           console.log("Returned from helper function: " + callIds);
            let reviewsSQL = "SELECT * FROM reviews_v1 WHERE call_id IN " + callIds + " AND application_id = ? and is_draft = 0;";
            db.query(reviewsSQL,[data.application_id],(err,result) => {
                callback(err,result);
        });
        }
    });
}

/* 
    Funders overall will be able to see the following:
    Click on applications.
    Each application will display a list of previews of the reviews.
    A button will be present on each review to display the full review.
    Back on the preview list, two options will be present.
    You can either or reject it. Must say why.

    To do:
    A get of the applications which relate to the funder.
    A get of the reviews which correlate to said application.
    A post function which accepts the funders response.

*/

exports.funderViewCalls = (req,res) => {
    if (req.session.user_name === undefined && req.session.user_id === undefined){
        return res.send("You must be logged in as a funder to continue");
    }
    // it's a GET, check to see if they're a funder first
    selectRoles(req.session.user_id,(err,roleObject) => {
        if (err){
            console.log(err);
            res.send(err);
        } else {
            if (roleObject.funder === "NO") {
                return res.send("You must be a funder to have access to this page...");
            } else {
                // Now we grab the calls that the funder has published and then 
                //  list them out. The funder can click on the view applications option
                // under each call
                selectCalls(req.session.user_id,(err,rows) => {
                    if (err){
                        console.log(err);
                        res.send(err);
                    } else {
                        if (rows.length){
                            return res.render("viewPublishedCalls.ejs",{userName: req.session.user_name,rows: rows});
                        } else {
                            return res.render("viewPublishedCalls.ejs",{userName: req.session.user_name,rows:undefined});
                        }
                    }
                });
            }   
        }
    });
}

exports.funderViewApplications = (req,res) => {
    // allows a funder to view applications after clicking a call.
    if (req.session.user_name === undefined && req.session.user_id === undefined){
        return res.send("You must be logged in to view this.")
    }
    if (req.query === {}) {
        // empty query, throw error!
        return res.send("No call identified!");
    }
    // Check to see if they are a funder
    selectRoles(req.session.user_id,(err,roles) => {
        if (err){
            console.log(err);
            res.send(err);
        } else {
            if (roles.funder === "NO") {
                return res.send("You must be a funder to view this.");
            } else {
                // we check to see if this funder can actually view
                // these applications or not.
                checkFunderCallID({ user_id:req.session.user_id,call_id:req.query.call_id },(err,result) =>{
                    if (err){
                        return res.send("Error! Could not validate if funder can view these applications!");
                    }
                    if (result.length === 0) {
                        // they can't view it, return the error message
                        return res.send("This is not your call. Not displaying applications.");
                    }
                    else {
                    // now we grab data and pass it through to the template
                    // defining now to make the template part much easier.
                    
                    let userDetails = [];
                    let applicationDetails = [];
                    let z = req.query.call_id; 
                    grabRelatedApplications(z,(err,applications) => {
                        if (err){
                            console.log(err);
                            return res.send("An error occured when grabbing applications!");
                        } else {
                            // There should only be one application made by a 
                            // researcher at a time, so just grab user details
                            // for said applications.
                            if (applications.length === 0) {
                                // no applications have been made, return immediately
                                return res.render('funderViewApplications.ejs',{   userName: req.session.user_name,
                                                                            userDetails:userDetails,
                                                                            applicationDetails:applicationDetails

                                });
                            }
                            applicationDetails = applications;
                            let tempArray = []; //array used for querying
                            for (let i = 0; i<applications.length;i++){
                                if (tempArray.includes(applications[i].applicant_id) === false ){
                                    tempArray.push(applications[i].applicant_id);
                                } 
                            }
                            let stringQuery = "( "+ tempArray.join() + " )";
                            console.log(stringQuery);
                            getResearcherDetails(stringQuery,(err,details) =>{
                                if (err){
                                    return res.send("An error occured when grabbing applicant details!");
                                } else {
                                    // now we render the application views
                                    userDetails = details;
                                    return res.render('funderViewApplications.ejs',{    userName:req.session.user_name,
                                                                                        userDetails:userDetails,
                                                                                        applicationDetails:applicationDetails
                                                                                    }
                                    );
                            }
                        });
                    }
                });
                } 
            });
            }
        }
    });
}

exports.funderViewReviews = (req,res) => {
    if (req.session.user_name === undefined && req.session.user_id === undefined){
        return res.send("You must be logged in to view this page.");
    }
    if (req.query === {}) {
        return res.send("No application specified...");
    }
    selectRoles(req.session.user_id,(err,roleObj) => {
        if (roleObj.funder === "NO"){
            return res.send("You must be a funder to view this page");
        } else {
            // verified funder. Check to see if application matches their call
            let appFromLinkId = req.query.application;
            grabRelevantReviews({user_id:req.session.user_id,application_id: appFromLinkId},(err,result) => {
                if (err){
                    console.log(err);
                    return res.send("An error occured while querying the database!");
                } else {
                    // render the reviews for this application
                    if (result.length){
                        return res.render('funderViewReviews.ejs',{userName:req.session.user_name,reviews:result,failure:[]});
                    } else {
                        let sql = "SELECT call_id FROM applications where application_id = ?;";
                        db.query(sql,appFromLinkId,(err,failure) => {
                        return res.render('funderViewReviews.ejs',{userName:req.session.user_name,reviews:[],failure:failure});
                    });
                    }
                }
            });
        }
    });
}

exports.funderSubmitDecision = (req,res) => {
    // POST function for deciding whether to accept or reject an application
    // and why the funder did it.
    
}

exports.getFunderAssignReviewers = (req,res) => {
    if (req.session.user_id === undefined && req.session.user_name === undefined){
        return res.send("You must be logged in to continue");
    }
    if (req.query === {}){
        return res.send("An error occured with the url!");
    }
    selectRoles(req.session.user_id,(err,roleObj) => {
        if (err){
            console.log(err);
            res.send("An error has occured!");
        } else {
            if (roleObj.funder === "NO"){
                return res.send("You must be a funder in order to continue!");
            } else {
                // they are a funder, now check to see if call and id correlate
                let call_id = req.query.call_id;
                checkFunderCallID({call_id:call_id,user_id:req.session.user_id},(err,row) => {
                    if (err){
                        console.log(err);
                        return res.send("An error occured!");
                    } else {
                        if (row.length){
                            // This call belongs to this funder, allowing to assign reviewers.
                            selectReviewers((err,reviewer) => {
                                if (reviewer.length){
                                    // Reviewers exist, now check the reviewers_calls to see if they are assigned or not
                                    checkAssignedReviewersForCall(call_id,(err,assignedReviewers) => {
                                        // check for err, then check for null, otherwise filter
                                        if (err){
                                            console.log(err);
                                            return res.send("An error occured when checking the assigned reviewers");
                                        } else if (assignedReviewers.length === 0){
                                            console.log("This is reviewer: " + reviewer);
                                            for (let k = 0;k<reviewer.length;k++){
                                                console.log(reviewer[k]);
                                            }
                                            // immediately render the file with reviewer passed through
                                            return res.render("funderAssignReviewers.ejs",{userName:req.session.user_name,reviewerData:reviewer,call_id:call_id});
                                        } else {
                                            // filter the data.
                                            // loop through all the reviewers then assignedReviewers
                                            let resultLst = [];
                                            for (let z = 0;z<reviewer.length;z++){
                                                let userFlag = true
                                                for (let a = 0;a<reviewer.length;a++){
                                                    if (reviewer[z].id === assignedReviewers[a].reviewer_id){
                                                        userFlag = false;
                                                        break;
                                                        }
                                                    }
                                                if (userFlag){
                                                    // add to result list here
                                                    resultLst.push(reviewer[z]);
                                                } else {
                                                    userFlag = true;
                                                }
                                            }
                                            console.log("This is resultLst: "+ resultLst);
                                            return res.render("funderAssignReviewers.ejs",{userName:req.session.user_name,reviewerData:resultLst,call_id:call_id});
                                            }
                                    });
                                } else {
                                    // No reviewers in system.
                                    return res.render("funderAssignReviewers.ejs",{userName: req.session.user_name,reviewerData:[],call_id:req.query.call_id});
                                }
                            });
                        } else {
                            return res.send("Cannot assign reviewers to calls you have not made.");
                        }
                    }
                });
            }
        }
    });
}

exports.assignReviewerPost = (req,res) => {
    if (req.session.user_id === undefined && req.session.user_name === undefined){
        return res.send("You must log in to view this page.");
    }
    // verify role
    selectRoles(req.session.user_id,(err,roleObj) => {
        if (roleObj.funder === "NO"){
            return res.send("You must be a funder to view this page!");
        } else {
            // They are a funder.
            // check if their call
            let call_id = req.body.callID;
            console.log("This is call_id: " + call_id);
            checkFunderCallID({user_id:req.session.user_id ,call_id: call_id}, (err,singleRow) => {
                if (singleRow.length){
                    // now insert into reviews_calls database.
                    let reviewer_id = req.body.reviewer_id;
                    let sql = "INSERT INTO reviewers_calls (call_id,reviewer_id) VALUES (?,?);";
                    db.query(sql,[call_id,reviewer_id],(err,result) =>{
                        if (err){
                            console.log(err);
                            return res.send("An error occured while sending in your data.");
                        } else {
                            return res.render("assignReviewerSuccess.ejs",{userName:req.session.user_name, call_id:call_id});
                        }
                    });
                } else {
                    // they don't have access to this call.
                    return res.send("You do not have access to this call.");
                }
            });
        }
    });
}