// Module dependencies
var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    user = require('./routes/user'),
    path = require('path');

var session = require('express-session') // cookie handler
var app = express(); // initialise express object.
var mysql = require("mysql"); // sql library
var bodyParser = require("body-parser");

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

// session stuff
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 60000 }
            }));

// navigate to routes folder and run index.js file
app.get('/',routes.index);
app.get('/profile',user.profile);

app.get('/login',user.login);
app.post('/login',user.login);

app.get('/register',user.register);
app.post('/register',user.register);

app.get('/logout',user.logout);

app.listen('3001');