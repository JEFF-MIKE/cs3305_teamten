// home page
exports.index = (req, res) => {
    // below are personal details
    let message = '';
    let userName = (req.session.user_name === undefined ? "" : req.session.user_name);
    // below are roles for nav
    if (req.query.errorStatus==='0'){
        // set in user.js
        message = "You must be logged in in order to view your profile.";
    } else if (req.query.errorStatus ==='1'){
        // they are already logged in, return them to home.
        message = "You are already logged in. Cannot log in again";
    } else if (req.query.errorStatus==='2'){
        // Data for profile could not be retrieved, returning to home page.
        message="An error has occured! please try again later...";
    } else if(req.query.errorStatus==="4"){
        message = "You are not logged in, cannot log out!";
    }
    if (req.session.user_name !== undefined) {
        // display that a user is currently logged in.
        userName = "Welcome, " + req.session.user_name;
    }
    if (req.query.successStatus==="1"){
        message = "Account registered, please login now.";
    }
    if (req.query.successStatus==="2"){
        message = "You have been successfully logged out!";
    }
    res.render('index.ejs',{message: message,userName:userName});
};
