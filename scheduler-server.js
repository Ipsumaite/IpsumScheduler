var express = require('express');
var app = express(), 
    server = require('http').createServer(app)
    , io     = require('socket.io').listen(server)
    , connect = require('connect')
    , pg     = require('pg')
    , logger = require('./services/logger.js')
    , httpRes = require('./services/HTTPresponse.js')
    , Client = pg.Client;

app.get('/', function(req, res) {
   httpRes.resFast(res, ' Running Ipsum Scheduler on Openshift. ', 200);
});



var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
server.listen( port, ipaddress, function() {
    logger.logMessageSimple((new Date()) + ' Ipsum Scheduler server is listening on port 8080');
});