//Ref: https://codeshack.io/basic-login-system-nodejs-express-mysql/

//Variables for required pkgs/modules
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');


//connection info stored in var
var connection = mysql.createConnection({
    host     : 'cs1.ucc.ie',
    user     : 'tl10',
    password : 'jangaeyu',
    database : '2020_tl10'
});

//Framework to simplify sessions/cookies in web apps
var app = express();

//Configure our web app (Express)
//Is the user logged in?
app.use(session({
    secret: 'team10',
    resave: true,
    saveUninitialized: true
}));

//Extract form data
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//Display file (login form) to client
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/login.html'));
});

//When form is complete, process
//and verify data by contacting MySQL Database
app.post('/auth', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/home');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

//Display home page
app.get('/home', function(request, response) {
    if (request.session.loggedin) {
        response.send('Welcome back, ' + request.session.username + '!');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});


//Web app requires port :Testing at 3000
app.listen(3000);
