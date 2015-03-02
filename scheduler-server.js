var express = require('express');
var app = express(), 
    server = require('http').createServer(app)
    , io     = require('socket.io').listen(server)
    , connect = require('connect')
    , pg     = require('pg')
    , logger = require('./services/logger.js')
    , httpRes = require('./services/HTTPresponse.js')
    , Client = pg.Client
    , cycle = require('./scheduler/cycle.js').running();

app.get('/', function(req, res) {
   httpRes.resFast(res, ' Running Ipsum Scheduler on Openshift. ', 200);
});


var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
server.listen( port, ipaddress, function() {
      logger.logMessageSimple("#####################################################################################################");
      logger.logMessageSimple((new Date()) + ' Ipsum Scheduler server is listening on port 8080');
      logger.logMessageSimple(" oo                                                            dP                      dP          dP");                   
      logger.logMessageSimple("                                                               88                      88          88");                   
      logger.logMessageSimple(" dP 88d888b. .d8888b. dP    dP 88d8b.d8b.    .d8888b. .d8888b. 88d888b. .d8888b. .d888b88 dP    dP 88 .d8888b. 88d888b."); 
      logger.logMessageSimple(" 88 88'  `88 Y8ooooo. 88    88 88'`88'`88    Y8ooooo. 88'  `\"\" 88'  `88 88ooood8 88'  `88 88    88 88 88ooood8 88'  `88 ");
      logger.logMessageSimple(" 88 88.  .88       88 88.  .88 88  88  88          88 88.  ... 88    88 88.  ... 88.  .88 88.  .88 88 88.  ... 88       ");
      logger.logMessageSimple(" dP 88Y888P' `88888P' `88888P' dP  dP  dP    `88888P' `88888P' dP    dP `88888P' `88888P8 `88888P' dP `88888P' dP       ");
      logger.logMessageSimple(" 88                                                                                                                  ");
      logger.logMessageSimple(" dP ");
      logger.logMessageSimple("#####################################################################################################\n\n");
   
});