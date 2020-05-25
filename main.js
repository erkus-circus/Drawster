var express = require('express')();
var http = require('http').Server(express);
var io = require("socket.io")(http)

express.get('/',function (req,res) {
    res.sendFile(__dirname + '/client/index.html');
});


express.get(/[A-z0-9\s\.]/,(req,res)=>{
    res.sendFile(__dirname + '/client' + req.path);
});

////////
// IO //
////////

io.on('connection', (socket)=>{
    
});


/////////////////
// HTTP LISTEN //
/////////////////

http.listen(80,  "0.0.0.0",function () {
    console.log('listening');
});