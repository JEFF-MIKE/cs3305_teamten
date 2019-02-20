// Module dependencies
var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    user = require('./routes/user'),
    upload = require('./routes/upload'),
    path = require('path');

var session = require('express-session') // cookie handler
var app = express(); // initialise express object.
var mysql = require("mysql"); // sql library
var bodyParser = require("body-parser");
var fileUpload = require('express-fileupload');

// my personal database connection.
var connection = mysql.createConnection({
    host     : 'mysql.netsoc.co',
    user     : 'mj',
    password : 'JCDQcTNBknX',
    database : 'mj_a_klaas_database',
    multipleStatements: true
});

// var connection = mysql.createConnection({
//   host     : '127.0.0.1',
//   user     : 'root',
//   password : '12345678',
//   database : 'nodemysql'
//   // multipleStatements: true
// });


// Connect
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to mysql database...");
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

// express.static is used for frontend css and javascript
app.use('/public',express.static(path.join(__dirname, 'public')));
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

app.get("/submission",upload.uploadFile);
app.post("/submission",upload.uploadFile);

app.get("/apply",user.apply);

// // Create DB
// app.get('/createdb', (req, res) => {
//   let sql = 'CREATE DATABASE nodemysql'
//   connection.query(sql, (err, result) => {
//     if(err) throw err;
//     console.log(result);
//     res.send('database created...');
//   });
// });

// // Create table
// app.get('/createpoststable', (req, res) => {
//   let sql = 'create table posts(id int auto_increment, title varchar(255), body varchar(255), primary key(id))';
//   connection.query(sql, (err, result) => {
//       if(err) throw err;
//       console.log(result);
//       res.send('Posts table created...')
//   });
// });

// // Insert post 1
// app.get('/addpost1', (req, res) => {
//   let post = {title:'Post One', body:'This is post number one'};
//   let sql = 'insert into posts set ?';
//     let query = connection.query(sql, post, (err, result) => {
//       if(err) throw err;
//       console.log(result);
//       res.send('Posts 1 added...');
//   });
// });

// // Insert post 2
// app.get('/addpost2', (req, res) => {
//   let post = {title:'Post Two', body:'This is post number two'};
//   let sql = 'insert into posts set ?';
//     let query = connection.query(sql, post, (err, result) => {
//       if(err) throw err;
//       console.log(result);
//       res.send('Posts 2 added...');
//   });
// });

// // Select post
// app.get('/getposts', (req, res) => {
//   let sql = 'select * from posts';
//     let query = connection.query(sql, (err, result) => {
//       if(err) throw err;
//       console.log(result);
//       res.send('Posts fetched...');
//   });
// });

// // Select single post
// app.get('/getpost/:id', (req, res) => {
//   let sql = `select * from posts where id = ${req.params.id}`;
//     let query = connection.query(sql, (err, result) => {
//       if(err) throw err;
//       console.log(result);
//       res.send('Post fetched...');
//   });
// });


// // Update title
// app.get('/updatepost/:id', (req, res) => {
//   let newTitle = 'Updated Title';
//   let sql = `update posts set title = '${newTitle}' where id = ${req.params.id}`;
//     let query = connection.query(sql, (err, result) => {
//       if(err) throw err;
//       console.log(result);
//       res.send('Post updated...');
//   });
// });


// // Delete post
// app.get('/deletepost/:id', (req, res) => {
//   let sql = `delete from posts where id = ${req.params.id}`;
//     let query = connection.query(sql, (err, result) => {
//       if(err) throw err;
//       console.log(result);
//       res.send('Post deleted...');
//   });
// });

app.listen('3001', () => {
  console.log("Server started on port 3001");
});