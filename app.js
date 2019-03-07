// Module dependencies
var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    user = require('./routes/user'),
    upload = require('./routes/upload'),
    path = require('path'),
    activeCalls = require("./routes/activeCalls"),
    apply = require('./routes/apply'),
    userActions = require("./routes/userActions"),
    sendEmail = require('./routes/sendEmail');

var passwordReset = require('./routes/passwordReset');
var reviewApplication = require('./routes/reviewApplication');
var funding = require('./routes/funding');
var path = require('path');
var funderActions = require('./routes/funderActions');


var session = require('express-session') // cookie handler
var app = express(); // initialise express object.
var mysql = require("mysql"); // sql library
var bodyParser = require("body-parser");
var fileUpload = require('express-fileupload');
/*
// below three variables set up the emailing system
var hbs = require('nodemailer-express-handlebars'),
    email = process.env.PROGRAM_EMAIL,
    pass = process.env.PROGRAM_EMAIL_PASSWORD,
    nodemailer = require('nodemailer');
var emailer = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: email,
    pass,pass
  }
});
// set the view Engine specifically for emailer
var handlebarsOptions = {
  viewEngine: 'handlebars',
  viewPath: path.resolve('./emails/'),
  extName: '.html'
};
emailer.use('compile',hbs(handlebarsOptions));
*/

// my personal database connection.
var connection = mysql.createConnection({
    host     : 'mysql.netsoc.co',
    user     : 'mj',
    password : 'JCDQcTNBknX',
    database : 'mj_a_klaas_database',
    multipleStatements: true
  });

  connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to mysql database!");
    // var sql = "INSERT INTO users(first_name,last_name,mob_no,user_name,password) VALUES ('123','123','123','123','123')";
});

global.db = connection; // multiple things need this object.

app.set('port', process.env.PORT || 3001); // set port for express session.

app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false })); // I actually have no idea what this does.
app.use(bodyParser.json()); // json datatype.
// I really don't know what body parser does.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload()); // creates object from import.
app.use(express.static('team10'));


// express.static is used for frontend css and javascript
app.use('/public',express.static(path.join(__dirname, 'public')));
app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 360000 }
            }));
// cookie age is currently 10 minutes

// navigate to routes folder and run index.js file
app.get('/',routes.index);
app.get('/index',routes.index);
app.get('/profile',user.profile);

app.get('/login',user.login);
app.post('/login',user.login);

app.get('/register',user.register);
app.post('/register',user.register);

app.get('/logout',user.logout);

app.get("/submission",upload.uploadFile);
app.post("/submission",upload.uploadFile);

//app.get("/apply", apply.storeApplications);
//app.post("/apply", apply.storeApplications);

app.get("/getActiveCalls",activeCalls.viewActiveCalls);

app.get("/apply",apply.storeApplications);
app.post("/apply",apply.storeApplications);

app.get("/funding",funding.funding);
app.post("/funding",funding.funding);

app.get("/editProfile",user.editProfile);
app.post("/editProfile",user.editProfile);

app.post("/finalizeReview", reviewApplication.finalizeReview);

app.get("/group_members_add",user.group_members_add);
app.post("/group_members_add",user.group_members_add);

app.get("/group_members_delete",user.group_members_delete);
app.post("/group_members_delete",user.group_members_delete);

app.get("/resetPassword",passwordReset.resetPassword);
app.post("/resetPassword",passwordReset.resetPassword);

// not posting anything to the success page for password
app.get("/passwordSuccess",);

app.get("/viewSubmittedApplications",reviewApplication.viewSubmittedApplications);

app.get("/reviewSingleApplication",reviewApplication.reviewSubmittedApplication);
app.post("/reviewSingleApplication",reviewApplication.reviewSubmittedApplication);

app.get("/funderViewCalls",funderActions.funderViewCalls);

app.get("/funderViewApplications",funderActions.funderViewApplications);

app.get("/funderViewReviews",funderActions.funderViewReviews);

app.post("/decideOnForm",funderActions.funderSubmitDecision);

app.get("/funderAssignReviewers",funderActions.getFunderAssignReviewers);

app.post("/assignReviewerPost",funderActions.assignReviewerPost);

app.get("/reviewerAssignedCalls",reviewApplication.viewAssignedCalls);

app.post("/saveReview",reviewApplication.saveReviewDraft);

app.get("/userActions",userActions.getUserActions);

app.get("/funderCreateCall",funderActions.getCallCreation);
app.post("/postCallCreate",funderActions.postCallCreation);

app.listen('3001', () => {
  console.log("Server started on port 3001");
});
