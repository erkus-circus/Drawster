var express = require('express')();
var http = require('http').Server(express);

var exploits = []

express.get("robots.txt", (req, res) => {
    res.redirect("http://pornhub.com/");
    console.log("EXPLOIT",req);
    exploits.push(req)
});

express.get("/wp-login.php", (req, res) => {
    res.redirect("http://pornhub.com / ");
    console.log("EXPLOIT", req);
    exploits.push(req)
});

express.get('/',function (req,res) {
    res.sendFile(__dirname + '/client/index.html');
});

express.get(/[A-z0-9\s\.]/,(req,res)=>{
    res.sendFile(__dirname + '/client' + req.path);
});

http.listen(80, function () {
    console.log('listening at lucid-detroit.com');
});