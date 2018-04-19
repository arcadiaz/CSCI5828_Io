var express = require('express');
var app = express();
var http = require('http').Server(app);
var tmi = require('tmi.js');
var io = require('socket.io')(http);
var path = require('path');
var cookieParser = require('cookie-parser');

app.use(cookieParser());

//connect to the database
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "io"
});


con.connect(function(err) {
    if (err) throw err;
    con.query("SET NAMES 'utf8mb4'", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
});

//set the template engine
app.set('view engine', 'pug');

//library for getting info from post request
var bodyParser = require('body-parser');

//form validation library
var validator = require('express-validator');
app.use(validator());

var urlencodedParser = bodyParser.urlencoded({extended: false})

let msgs = "";
let keywords = [];
var nick;
var cha;

app.use(express.static(path.join(__dirname, '/public')));

//render a view
app.get('/', function (req, res) {
    res.render('login');
});

var client;

http.listen(3000, function () {
    console.log('listening on *:3000');
});


function create_sql_timestamp () {
    let date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' +
        ('00' + date.getUTCHours()).slice(-2) + ':' +
        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date.getUTCSeconds()).slice(-2);

    return date;
}

const process_message =  (msg, nick, channel) => {
    msg = msg.replace("'", "\\'"); //escaping single quotes '
    return new Promise((resolve, reject) => {
        // converting js timestamp to mysql timestamp https://stackoverflow.com/a/11150727
        let date = create_sql_timestamp();
        let sql = "INSERT INTO `messages` (`message`, `timestamp`, `username`, `channel`) VALUES ('" + msg + "', '" +date + "', '" + nick +"', '" + channel  + "'); ";
        con.query(sql, function (err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
};


//endpoint for getting last five minutes worth of messages for a user in a channel
app.get('/getStats/:username/:channel', urlencodedParser, function(req, res) {
    let username = req.params.username;
    let channel = req.params.channel;
    let sql = "SELECT * FROM `messages` WHERE username='" + username + "' AND channel='#" + channel+"' AND timestamp >= NOW() - INTERVAL 5 MINUTE;";
    console.log(sql);
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.status(200).json(result);
    });

});

app.post('/', urlencodedParser, function (req, res) {

    //check if any field is empty
    req.checkBody("nickname").not().isEmpty().withMessage("Please enter a nickname.");
    req.checkBody("password").not().isEmpty().withMessage("Please enter a password.");
    req.checkBody("channel").not().isEmpty().withMessage("Channel cannot be empty");

    //re-render view with error message if any field is empty
    var errors = req.validationErrors();
    if (errors){
        console.log(errors);
        res.render('login', {errors: errors});
    }

    nick = req.body.nickname;
    cha = req.body.channel.toLowerCase();

    //if the channel name does not start with #, add a # to it
    if (!cha.startsWith("#", 0)){
        cha = "#" + cha;
    }

    var options = {
        identity: {
            username: nick,
            password: req.body.password
        },
        channels: [cha]
    };

    client = new tmi.client(options);
    client.connect().then(
        data => {
            console.log("success", data, cha);



            client.addListener('join', function () {
                io.emit('display messages', "Successfully logged in!");
            });
            msgs = "";

            client.addListener('chat', function (channel, userstate, message, self) {
                var msg = userstate.username + ": " + message;
                process_message(message, nick, channel);
                io.emit('display messages', msg);

            });

            io.on('connection', function (socket) {
                socket.on('chat message', function (msg) {
                    console.log("send: ", msg);
                    client.say(cha, msg);
                });
            });

            cha = cha.replace("#", ""); // remove the # from the channel name (it causes issues later when a GET is sent)
            res.cookie('channel', cha);
            res.cookie("username", nick);
            res.render('chat');
        }
    ).catch(
        err => {
            res.render('login', {authfail: "Authentication failed, please check that your nickname and password are correct."});
            console.log("failed auth with error:", err);
        }
    );

});


