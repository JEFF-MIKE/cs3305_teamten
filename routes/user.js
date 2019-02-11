/*
-------------------------- When profile link is clicked, call this. -----------------------
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
        let sql="SELECT first_name, last_name, user_name, mob_no FROM `users` WHERE `id`='"+userID+"'";
        db.query(sql, (err,results) => {      
            if(results.length){
               let fname = results[0].first_name;
               let lname = results[0].last_name;
               let user_name = results[0].user_name;
               let mobile = results[0].mob_no;
               res.render("profile.ejs",{fname:fname,lname:lname,user_name:user_name,mobile:mobile});
            } else {
                // details could not be retrieved. display error message.
                let string=encodeURIComponent("2");
                res.redirect("/?errorStatus" + string);
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
              req.session.first_name = results[0].first_name;
              req.session.last_name = results[0].last_name;
              console.log(results[0].id);
              console.log(results[0].first_name);
              res.redirect("/");
           }
           else{
              status = 'Error! Either your username or password are incorrect';
              res.render('login.ejs',{status:status});
           }
        }); 
    } else {
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