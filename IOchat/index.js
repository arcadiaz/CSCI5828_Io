var app = require('express')();
var http = require('http').Server(app);
var tmi = require('tmi.js');
var io = require('socket.io')(http);


var options = {
  identity:{
      username: "busunkim96",
      password: "oauth:"
  },
    channels: ["#arcadiiaaa"]
};

//send a file to the server
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

var client = new tmi.client(options);

client.connect();

client.addListener('join', function () {
    //client.say("#arcadiiaaa", "hi");
    console.log("joined");
});

client.addListener('chat', function (channel, userstate, message, self) {
    console.log(message);
    var msg = userstate.username + ": " + message;
    io.emit('chat message', msg);
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
        client.say("#arcadiiaaa", msg);
    });
});

