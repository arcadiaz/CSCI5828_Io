var express = require('express');
var app = express();
var http = require('http').Server(app);
var tmi = require('tmi.js');
var io = require('socket.io')(http);
var path = require('path');

//set the template engine
app.set('view engine', 'pug')

//library for getting info from post request
var bodyParser = require('body-parser');

//form validation library
var validator = require('express-validator');
app.use(validator());

var urlencodedParser = bodyParser.urlencoded({extended: false})

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
    cha = req.body.channel;

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

            client.addListener('chat', function (channel, userstate, message, self) {
                var msg = userstate.username + ": " + message;
                io.emit('display messages', msg);
            });

            io.on('connection', function (socket) {
                socket.on('chat message', function (msg) {
                    console.log("send: ", msg);
                    client.say(cha, msg);
                });
            });

            res.render('chat');
        }
    ).catch(
        err => {
            res.render('login', {authfail: "Authentication failed, please check that your nickname and password are correct."});
            console.log("failed auth with error:", err);
        }
    );

});


