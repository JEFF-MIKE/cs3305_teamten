/*
-------------------------- When profile link is clicked, call this. -----------------------
*/
/*
function queryRoles(number){
    // A function which takes an input
    // "id" and returns an object containing roles
    //e.g. researcher:"Y"
    //     reviewer: "N" etc
    //otherwise object returns null
    let roleSelect=`SELECT * FROM roles WHERE id = ${number}`;
    db.query(roleSelect,(err,result) => {
        console.log(result);
        let admin = "";
        let researcher = "";
        let reviewer = "";
        let funder = ""; 
        let returnObject = {};
        console.log("Entering query function");
        if (result.length){
            // now make object
            // shorthand if else: var = condition ? true : false
            //result[0].admin === "YES" ? returnObject.admin = "Y" : returnObject.admin = "N";
            if (result[0].admin === "YES"){
                returnObject.admin = "Y";
            } else {
                returnObject.admin = "N";
            }
            console.log(returnObject.admin);
            result[0].researcher === "YES" ? returnObject.researcher = "Y" : returnObject.researcher = "N";
            result[0].reviewer === "YES" ? returnObject.reviewer = "Y" : returnObject.reviewer = "N";
            result[0].funder === "YES" ? returnObject.funder = "Y" : returnObject.funder = "N";
            console.log(returnObject);
            return returnObject;
        } else{
            return null;
        }
        });
}
*/
exports.profile=(req,res) =>{
    var userID = req.session.userId;

    // user must be logged in to view their own profile.
    if (userID === undefined){
        let string = encodeURIComponent('0');
        res.redirect("/?errorStatus=" + string);
        return;
    } else{
        // they are logged in, display their profile details.
        // first, escape with array, sub with question marks
        console.log("ID is " + typeof(userID));
        var sql="SELECT first_name, last_name, user_name, mob_no FROM users WHERE id=?;SELECT * FROM roles WHERE id=?;"
        db.query(sql,[userID,userID], (err,results) => {
            // declare variables and return inside this function
            let errorFlag = false;
            let fname = "";
            let lname = "";
            let user_name = "";
            let mobile = "";
            let admin = "";
            let researcher = "";
            let reviewer = "";
            let funder = "";
            if (err) throw err;     
            if(results[0].length){
                // grabs data from users table
               console.log(results[0][0].first_name); 
               fname = results[0][0].first_name;
               lname = results[0][0].last_name;
               user_name = results[0][0].user_name;
               mobile = results[0][0].mob_no;
               console.log(mobile + "In scope");
            } else {
                errorFlag = true;
            }
            if (results[1].length){
                // grabs data from roles table
                console.log(results[1][0].researcher);
                results[1][0].researcher === "YES" ? researcher = "Y" : researcher = "N";
                results[1][0].reviewer === "YES" ? reviewer = "Y" : reviewer = "N";
                results[1][0].funder === "YES" ? funder = "Y" : funder = "N";
                results[1][0].admin === "YES" ? admin = "Y" : admin = "N";
            } else {
                errorFlag = true;
            }
        if (errorFlag === false) {
            console.log(mobile + "Out of scope: this is mobile number out of scope");
            res.render("profile.ejs",{ 
                                    fname: fname,
                                    lname: lname,
                                    user_name: user_name,
                                    mobile: mobile,
                                    admin: admin,
                                    researcher: researcher,
                                    reviewer: reviewer,
                                    funder: funder });
        } else {
            let string = encodeURIComponent('2');
            res.redirect("/?errorStatus=" + string);
            }
        });
    }
}

/* 
------------------------- When login link is clicked, call this -------------------------------
*/
exports.login=(req,res) => {
    // first,check to see if they are logged in.
    let userID = req.session.userId;
    if (userID !== undefined){
        var string =encodeURIComponent('1');
        res.redirect("/?errorStatus="+string);
        return;
    }
    // now check if the request was GET or POST
    let status = ""; // Will be used for error messages.
    if (req.method == "POST") {
        // get the body
        let post  = req.body;
        // grab form data
        let name= post.user_name;
        let pass= post.password;
        let sql="SELECT id, first_name, last_name, user_name FROM `users` WHERE `user_name`='"+name+"' and password = '"+pass+"'";                           
        db.query(sql, (err,results) => {      
           if(results.length){
              req.session.userId = results[0].id;
              let x = results[0].id; // need this for the sql query
              req.session.first_name = results[0].first_name;
              req.session.last_name = results[0].last_name;
              console.log(results[0].id);
              console.log(results[0].first_name + " Logged in!");
                res.redirect("/");
              }
              else{
                status = 'Error! Either your username or password are incorrect';
                res.render('login.ejs',{status:status});
             }
    });} else {
        // it's a get. Render normally
        res.render("login.ejs",{status:status});
    }
}

/* ---------------------------- Register Tab *****************************/
exports.register=(req,res) =>{
    let userID = req.session.userId;
    if (userID !== undefined){
        // already logged in, see above
        var string =encodeURIComponent('1');
        res.redirect("/?errorStatus="+string);
        return;
    }
    let status = "";
    if (req.method=="POST"){
        let post = req.body;
        let username = post.user_name;
        let usernameError = "";
        let fname=post.fname;
        let fnameErr="";
        let lname=post.lname;
        let lnameErr="";
        let mob_no=post.mobile;
        let mob_noErr="";
        let password=post.password;
        let passwordErr="";
        let errorFlag=false;
        console.log(fname);
        if (fname.length < 3 || fname.length > 32){
            fnameErr+="First name must have a length between 2 and 32\n";
            errorFlag = true;
        }
        if (lname.length < 2 && lname.length > 32){
            lnameErr+="Last name must have a length between 2 and 32\n";
            errorFlag = true;
        }
        if(errorFlag === false){
            var sql = "INSERT INTO users(first_name,last_name,mob_no,user_name,password) VALUES ("  + '\'' + fname + "','" +  lname + "','" + mob_no + "','" + username + "','" + password + "')";
            var query = db.query(sql,(err, result) => {
               if (err) throw err;
               message = "Your account has been created! Please login now." ;
               var string =encodeURIComponent('1');
               res.redirect("/?successStatus="+string);
               return;
            });
        } else{
            status="Error! You appear to have mistyped something in.";
            res.render("register.ejs",{status:status,
                                       user_name:username,
                                       fname: fname,
                                       lname: lname,
                                       mob_no: mob_no,
                                       fnameErr:fnameErr});
        }
    } else {
        // it's a Get. Render normally.
        let fname="";
        let lname="";
        let mob_no="";
        let username="";
        let fnameErr = "";
        status = "Please enter in your details below...";
        res.render("register.ejs",{ status:status, 
                                    user_name: username, 
                                    fname:fname, 
                                    lname:lname,
                                    mob_no:mob_no,
                                    fnameErr:fnameErr
                                });
    }
}


/****************************  logout block ********************************/
exports.logout=(req,res)=>{
    var userID = req.session.userId;
    // user must be logged in to view their own profile.
    if (userID === undefined){
        let string = encodeURIComponent('4');
        res.redirect("/?errorStatus=" + string);
        return;
    }
    req.session.destroy((err) => {
        if (err) throw err;
        var string = encodeURIComponent('2');
        res.redirect("/?successStatus="+string);
        return;
    });
}