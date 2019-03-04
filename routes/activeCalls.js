/*  Grabs all the active calls.
    Newest Calls made are first.
*/


function getAlreadySubmittedApplications(data,callback){
    /* 
    callback function for grabbing applications that the user has submitted
    */
   let sql = "SELECT * FROM applications WHERE applicant_id = ?;";
   db.query(sql,data,(err,rows) => {
       if (err){
           callback(err,null);
       } else{
           callback(null,rows);
       }
   });
}

function getCalls(data,callback){
    // callback function for getting calls.
    let sql = "SELECT * FROM calls WHERE active_status = 1 ORDER BY call_id DESC;";
    db.query(sql,(err,rows) => {
        if (err){
            callback(err,null);
        } else {
            callback(null,rows);
        }
    });
}
exports.viewActiveCalls = (req,res) => {
    //if false assigns username, otherwise left undefined.
    let userName = (req.session.user_name === undefined) ? "" : req.session.user_name;
    // grabs active calls. only actived on GET.
    if (userName === undefined || req.session.user_id === undefined) {
        // Newer calls are put up top.
        let sql = "SELECT * FROM calls WHERE active_status = 1 ORDER BY call_id DESC;";
        db.query(sql,(err,rows) => {
            return res.render("getActiveCalls.ejs",{userName:userName,rows:rows});
        });
    } else {
        // Need to filter out applications this user has already made.
        getAlreadySubmittedApplications(req.session.user_id,(err,appliedCalls) => {
            if (err){
                console.log("An error occured while rendering the data.");
                return res.send(err);
            } else {
                getCalls("crap",(err,callData) => {
                    if (err){
                        console.log(err);
                        return res.send(err);
                    } else if (callData === 0){
                        return res.render("getActiveCalls.ejs",{userName:userName,rows:rows});
                    } else {
                        // filter here
                        let resultLst = [];
                        let callFlag = true;
                        for (let k = 0;k<callData.length;k++){
                            for(let q = 0;q<appliedCalls.length;q++){
                                if (appliedCalls[q].call_id === callData[k].call_id){
                                    callFlag = false;
                                    break
                                }
                            }
                            if (callFlag){
                                resultLst.push(callData[k]);
                            } else {
                                callFlag = true;
                            }
                        }
                        return res.render("getActiveCalls.ejs",{userName:userName,rows:resultLst});
                    }
                });
            }
        });
    }
}