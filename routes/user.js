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

function fetchId(data,callback){
    // callback function for grabbing ID from table when creating user account.
    let sql = "SELECT id FROM users where email = ?;"
    db.query(sql,data.email, (err,rows) => {
        if (err){
            callback(err,null);
        } else {
            console.log(rows[0]);
            console.log("This is id from table:" + rows[0].id);
            callback(null,rows[0].id);
        }
    });
}

function insertRoles(data,callback){
    // callback function for inserting into roles table on account creation.
    let sql = "INSERT INTO `roles` (id,researcher,reviewer,funder,admin,research_office) VALUES (?,?,?,?,?);";
    // data is an object of roles mapped to yes or no
    db.query(sql,[data.tempUserID, data.researcher ,data.reviewer, data.funder, data.admin,data.research_office],(err,rows) => {
        if (err){
            callback(err,null);
        } else {
            // it's an insert, it's completed.
            callback(null,"Completed");
        }
    });
}

function selectRoles(data,callback){
    /* 
    Callback function for checking to see if the user should be able
    to view a certain website or not. Data is id.
    */
   let sql = "SELECT * FROM `roles` where id = ?";
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

exports.profile=(req,res) =>{
    // session details.
    let userID = req.session.user_id;
    let userName = req.session.user_name;

    // user must be logged in to view their own profile.
    if (userID === undefined){
        let string = encodeURIComponent('0');
        res.redirect("/?errorStatus=" + string);
        return;
    } else{
        // they are logged in, display their profile details.
        // first, escape with array, sub with question marks
        console.log("ID is " + userID);
        var sql="SELECT first_name, last_name, user_name, email, mob_no FROM users WHERE id=?;SELECT * FROM roles WHERE id=?;"
        db.query(sql,[userID,userID], (err,results) => {
            // declare variables and return inside this function
            let errorFlag = false;
            let fname = "";
            let lname = "";
            let user_name = "";
            let mobile = "";
            let email = "";
            let admin = "";
            let researcher = "";
            let reviewer = "";
            let funder = "";
            let research_office = "";
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
                results[1][0].research_office === "YES" ? research_office = "Y" : research_office = "N";
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
                                    email: email,
                                    admin: admin,
                                    researcher: researcher,
                                    reviewer: reviewer,
                                    funder: funder,
                                    research_office: research_office,
                                    userName: userName });
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
    let status = "";
    if (userID !== undefined){
        var string =encodeURIComponent('1');
        res.redirect("/?errorStatus="+string);
        return;
    }
    // now check if the request was GET or POST
    if (req.method == "POST") {
        // get the body
        let post  = req.body;
        // grab form data
        let email= post.email;
        let pass= post.password;
        let sql="SELECT id, first_name, last_name, user_name FROM `users` WHERE `email`=? and password = ?;";                           
        db.query(sql, [email,pass],(err,results) => {      
           if(results.length){
              req.session.user_id = results[0].id; // set their userID here.
              let x = results[0].id; // need this for the sql query
              //session data used for cosmetic stuff.
              req.session.first_name = results[0].first_name;
              req.session.last_name = results[0].last_name;
              req.session.user_name= results[0].user_name
              console.log(results[0].id);
              console.log(results[0].first_name + " Logged in!");
                res.redirect("/");
              }
              else{
                console.log("Yep, this error message came up!");
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
    let userID = req.session.user_id;
    if (userID !== undefined){
        // already logged in, see above
        var string =encodeURIComponent('1');
        res.redirect("/?errorStatus="+string);
        return;
    }
    let username="";
    let email="";
    let fname="";
    let lname="";
    let mob_no="";
    let generalErr = "";
    let fnameErr = "";
    let lnameErr="";
    let usernameError="";
    let emailError = "";
    let passwordErr="";
    let mob_noErr = "";
    if (req.method=="POST"){
        // PASSWORD WILL BE LOOKED AT ONCE OTHER WEBSITE FEATURES ARE DONE.
        let post = req.body;
        // each variable will need to be checked before added to the database.
        username = post.user_name;
        email = post.email;
        fname=post.fname;
        lname=post.lname;
        mob_no=post.mobile;
        // declare password for this if block.
        let password=post.password;
        let otherPassword=post.otherPassword;
        let passwordErr="";
        let errorFlag=false;
        let regexp = new RegExp("[0-9+]");
        console.log(fname);
        if (fname.length < 3 || fname.length > 32){
            fnameErr+="First name must have a length between 2 and 32\n";
            errorFlag = true;
        }
        if (lname.length < 2 && lname.length > 32){
            lnameErr+="Last name must have a length between 2 and 32\n";
            errorFlag = true;
        }
        if (regexp.test(mob_no) === false){
            mob_noErr += "Please only enter digits for phone number\n";
            errorFlag = true;
        }
        if (password != otherPassword){
            passwordErr += "Your passwords did not match, please re-enter them!\n";
            errorFlag = true;
        }
        if(errorFlag === false){
            var sql = "INSERT INTO users(first_name,last_name,email,mob_no,user_name,password) VALUES (?,?,?,?,?,?);";
            // role by default is currently being done.
            // sql += "INSERT INTO roles(admin,researcher,funder,reviewer) VALUES('NO','YES','NO','NO');"
            var query = db.query(sql,[fname,lname,email,mob_no,username,password],(err, result) => {
               if (err) throw err;
               //var tempUserID = null;
               message = "Your account has been created! Please login now." ;
               let idData = {email: email};
               fetchId(idData,(err,id_num) => {
                if (err){
                    console.log(err);
                    res.send(err);
                } else {
                    let rolesData = {
                        admin:"NO",
                        researcher: "YES",
                        reviewer: "NO",
                        funder: "NO",
                        research_office: "NO",
                        tempUserID: id_num
                    };
                    insertRoles(rolesData,(err,content) => {
                        if (err){
                            console.log("Error occured in roles data!");
                            return res.render(err);
                        } else {
                         console.log("Successfully inserted roles into database");
                        }
                    });
                }
              //console.log("Temp user ID is: " + tempUserID);
               });
               /*
               let rolesData = {
                   admin:"NO",
                   researcher: "YES",
                   reviewer: "NO",
                   funder: "NO",
                   tempUserID: tempUserID
               };
               */
               /*
               insertRoles(rolesData,(err,content) => {
                   if (err){
                       console.log("Error occured in roles data!");
                       return res.render(err);
                   } else {
                    console.log("Successfully inserted roles into database");
                   }
               });
               */
               //console.log("This is temp user ID: " + tempUserID);
               var string =encodeURIComponent('1');
               return res.redirect("/?successStatus="+string);
            });
        } else{
            generalErr="Errors detected!";
            return res.render("register.ejs",{ generalErr:generalErr,
                                        user_name:username,
                                        fname: fname,
                                        lname: lname,
                                        email: email,
                                        mob_no: mob_no,
                                        fnameErr:fnameErr,
                                        lnameErr:lnameErr,
                                        usernameError:usernameError,
                                        emailError:emailError,
                                        passwordErr:passwordErr,
                                        mob_noErr: mob_noErr
                                    });
        }
    } else {
        // it's a Get. Render normally.
        return res.render("register.ejs",{ generalErr:generalErr,
            user_name:username,
            fname: fname,
            lname: lname,
            email:email,
            mob_no: mob_no,
            fnameErr:fnameErr,
            lnameErr:lnameErr,
            usernameError:usernameError,
            emailError:emailError,
            passwordErr:passwordErr,
            mob_noErr: mob_noErr
        });
    }
}


/****************************  logout block ********************************/
exports.logout=(req,res)=>{
    var userID = req.session.user_id;
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

/**************************** apply for founding ********************************/
exports.apply=(req, res) => {

    if (req.method=="POST"){
        let post = req.body

        // for table ------ applications_v1
        // let id = ; auto_incresed
        // var myDate = new Date();
        // let name_of_application = post.name_of_application; // need to add a form in apply.ejs
        // let time_of_submission = myDate.toLocaleString();
        // let commen = post.comment;
        // let file_name = "tmp";
        // let user_ID = req.session.userId;

//
        var myDate = new Date();
        let name_of_application = "test"; // need to add a form in apply.ejs
        let time_of_submission = myDate.toLocaleString();
        let commen = "commenTest";
        let file_name = "tmp";
        let user_ID = req.session.userId;
//



        let sql = "insert into applications_v1(name_of_application,time_of_submission,commen,file_name,user_ID) value(?,?,?,?,?)";
        db.query(sql, [name_of_application,time_of_submission,commen,file_name,user_ID], (err, result) => {
            if(err) throw err;
            console.log(result);
            res.send('database for application created...');
        });

    } else {
        var userID = req.session.userId;
        if (userID === undefined){
            res.send('You need to login first...');
            return
        }
        else {
            return res.render("apply.ejs");
        }
    }
}

/**************************** group and memebers add ********************************/

/*
database name : group_member_relationship
groupName
memberName
*/
exports.group_members_add=(req, res) => {
    if (req.method=="POST") {
        let post = req.body;
        let groupName = post.groupName;
        let memberName = post.memberName;

        // find two Id and send them into table groups_memberships
        // write sentence
        sql_find_groupID = "select group_id from groups where group_name=?";
        sql_find_memberID = "select id from users where user_name=?";

        // function error1() {
        // return {err: 1, msg: "Error: Cannot find info about this group name..."};
        // }
        // function error2() {
        // return {err: 2, msg: "Error: Cannot find info about this member name..."};
        // }

        
        db.query(sql_find_groupID,[groupName], (err1, result1) => {
            if(result1.length == 0) {
                console.log("Yep, this error message came up!");
                status = 'Error! your group name is not exist';
                return res.render('group_member_add.ejs',{status:status});
            }
            console.log(result1[0].group_id);
            db.query(sql_find_memberID,[memberName], (err2, result2) => {
            if(result2.length == 0) {
                console.log("Yep, this error message came up!");
                status = 'Error! your member name is not exist';
                return res.render('group_member_add.ejs',{status:status});
            }
            console.log(result2[0].id);
            var sql = "insert into groups_memberships(group_id, user_id) value(?,?)";
                db.query(sql, [result1[0].group_id, result2[0].id], (err, result) => {
                    if(err) throw err;
                    console.log(result);
        
                    var sql_find_all_group_name = "Select group_name From groups Where group_id in ( select  group_id from groups_memberships where user_id=?)";
                    db.query(sql_find_all_group_name, result2[0].id, (err, result3) => {
                        if(err) throw err;
                        console.log(result3);
                        res.send(result3);
                        
                    });
                    
                    
                });
            });
        });   
    } else {
        status=""
        return res.render("group_member_add.ejs",{status:status});
    }
}



/**************************** group and memebers delete ********************************/


exports.group_members_delete=(req, res) => {
    if (req.method=="POST") {
        let post = req.body;
        let groupName = post.groupName;
        let memberName = post.memberName;

        //
        sql_find_groupID = "select group_id from groups where group_name=?";
        sql_find_memberID = "select id from users where user_name=?";

        db.query(sql_find_groupID,[groupName], (err1, result1) => {
            // not find error
            if(result1.length == 0) {
                console.log("Yep, this error message came up!");
                status = 'Error! your group name is not exist';
                return res.render('group_member_delete.ejs',{status:status});
            }

            console.log(result1[0].group_id);
            db.query(sql_find_memberID,[memberName], (err2, result2) => {
                //not find error
                if(result2.length == 0) {
                    console.log("Yep, this error message came up!");
                    status = 'Error! your member name is not exist';
                    return res.render('group_member_delete.ejs',{status:status});
                }

                console.log(result2[0].id);

                sql = "delete from groups_memberships where group_id="+result1[0].group_id+" and user_id="+result2[0].id
                db.query(sql, (err, result) => {
                    if(err) {
                        status = "Error! no relationship between them";
                        return res.render('group_member_delete.ejs',{status:status}); 
                    }
                    console.log(result);
        
                    var sql_find_all_group_name = "Select group_name From groups Where group_id in ( select  group_id from groups_memberships where user_id=?)";
                    db.query(sql_find_all_group_name, result2[0].id, (err, result3) => {
                        if(err) throw err;
                        console.log(result3);
                        res.send(result3)
                        
                    });
                    
                    
                });
            });        
        });



    } else {
        status=""
        return res.render("group_member_delete.ejs",{status:status});
    }
}