var express = require('express');
var app = express();
var http = require('http').Server(app);
var tmi = require('tmi.js');
var io = require('socket.io')(http);
var path = require('path');

var nick;
var cha;

app.use(express.static(path.join(__dirname, '/public')));

//send a file to the server
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


var client;

http.listen(3000, function(){
    console.log('listening on *:3000');
});


io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        console.log("send: ", msg)
        client.say(cha, msg);
    });

    socket.on('userlogin', function (nickname, oath, channel) {
        nick = nickname;
        cha = channel
        var options = {
            identity:{
                username: nickname,
                password: oath
            },
            channels: [channel]
        };
        //console.log(options);
        client = new tmi.client(options);
        client.connect();

        client.addListener('join', function () {
            //client.say("#arcadiiaaa", "hi");
            io.emit('display messages', "Successfully logged in!");
        });

        client.addListener('chat', function (channel, userstate, message, self) {
            console.log(message);
            var msg = userstate.username + ": " + message;
            io.emit('display messages', msg);
        });

    })
});



