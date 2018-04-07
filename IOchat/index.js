var express = require('express');
var app = express();
var http = require('http').Server(app);
var tmi = require('tmi.js');
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');
var events = require('events');
var eventEmitter = new events.EventEmitter();



var urlencodedParser = bodyParser.urlencoded({extended: false})


var nick;
var cha;

app.use(express.static(path.join(__dirname, '/public')));

//send a file to the server
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/loginPage.html');
});


var client;

http.listen(3000, function () {
    console.log('listening on *:3000');
});

app.post('/', urlencodedParser, function (req, res) {
    nick = req.body.nickname;
    cha = req.body.channel;
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
            console.log("success", data);
            eventEmitter.emit('auth passed', res);
        }
    ).catch(
        err => {
            eventEmitter.emit('auth failed', res, err);
        }
    );

});

eventEmitter.on('auth passed', function (res) {

    client.addListener('join', function () {
        io.emit('display messages', "Successfully logged in!");
    });

    client.addListener('chat', function (channel, userstate, message, self) {
            var msg = userstate.username + ": " + message;
            io.emit('display messages', msg);
    });

    io.on('connection', function (socket) {
        socket.on('chat message', function (msg) {
            console.log("send: ", msg)
            client.say(cha, msg);
        });
    });

    res.sendFile(__dirname + '/index.html');

});


eventEmitter.on('auth failed', function (res, err) {
    console.log("failed auth with error:", err);
    res.sendFile(__dirname + '/loginPage.html');
});

