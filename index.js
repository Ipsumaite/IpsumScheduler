var express = require('express');
var app = express(), 
    server = require('http').createServer(app)
    , io     = require('socket.io').listen(server)
    , connect = require('connect')
    , pg     = require('pg')
    , Client = pg.Client;

app.get('/', function(request, response) {
  response.send('Testing nitrous.io - Openshift Integration');
});



var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
server.listen( port, ipaddress, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});