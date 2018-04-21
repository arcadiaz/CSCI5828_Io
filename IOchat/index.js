const express = require('express');
const app = express();
const http = require('http').Server(app);
const tmi = require('tmi.js');
const io = require('socket.io')(http);
const path = require('path');
const db_tools = require('./db_tools');
app.use(express.static(path.join(__dirname, '/public')));

// libraries for using cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//set the template engine
app.set('view engine', 'pug');

//library for getting info from post request
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});

//form validation library
const validator = require('express-validator');
app.use(validator());

// establish a connection with the database
let db_con = db_tools.establish_db_connection();

db_con.query("select * from messages", function (err, result, fields) {
    console.log(result)
});

let msgs = "";
let nick = "";
let cha = "";

//render a view - main page
app.get('/', function (req, res) {
    res.render('login');
});

var client;

http.listen(3000, function () {
    console.log('listening on *:3000');
});

//form validation and connect to the Twitch chat IRC
app.post('/', urlencodedParser, function (req, res) {

    //check if any field is empty
    req.checkBody("nickname").not().isEmpty().withMessage("Please enter a nickname.");
    req.checkBody("password").not().isEmpty().withMessage("Please enter a password.");
    req.checkBody("channel").not().isEmpty().withMessage("Channel cannot be empty");

    //re-render view with error message if any field is empty
    let errors = req.validationErrors();
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

    let options = {
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
                let msg = userstate.username + ": " + message;
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



//endpoint for getting last five minutes worth of messages for a user in a channel
// app.get('/getStats/:username/:channel', urlencodedParser, function(req, res) {
//     let username = req.params.username;
//     let channel = req.params.channel;
//     db_tools.retrieve_msgs(db_con, 5, username, channel);
// });
