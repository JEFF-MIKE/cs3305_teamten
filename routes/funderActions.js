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
           callback(err,rows);
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
                            res.render("viewPublishedCalls.ejs",{userName: req.session.user_name,rows: rows});
                        } else {
                            res.render("viewPublishedCalls.ejs",{userName: req.session.user_name,rows:undefined});
                        }
                    }
                });
            }   
        }
    });
}

