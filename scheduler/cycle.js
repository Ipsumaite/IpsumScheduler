'use strict';
var Firebase = require('firebase'),
    logger = require('../services/logger.js'),
    sfWrapper = require('../services/salesforceWrapper.js'),
    every = require('schedule').every;




var myRootRef = new Firebase(process.env.FIREBASEURL+"/streams");
var publishrate= process.env.PERIOD+"s";
var myRef = new Firebase(process.env.FIREBASEURL+"/streams");

exports.running=function(){
    every(publishrate).do(function() {
      var d = new Date();
      logger.logMessage("Checking all streams again... "+d.toString());

      myRef.once("value", function(snapshot) {
          if (snapshot.val()){
            var json = snapshot.val();

            for (var key in json) {
                  var beacon, beacons;

                 logger.logMessage("Checking User :" +key);
                 myRef.child(key+"/beacon").on("value", function(snapshotbeacon){
                   beacons = snapshotbeacon.val();
                   for (var key2 in beacons ){
                      beacon = beacons[key2];
                   }
                   var timediff = Math.round((Date.now()-beacon.date)/(1000*60));
                   logger.logMessage("For user "+ key + "/"+ beacon.email+ " date difference in minutes :"+timediff);
                     
                   var strSOQL='SELECT Channel__c ,ContractNumber FROM Contract where AccountId = \'' + key + '\' AND SpecialTerms  not in (\'Canceled\')';
                   sfWrapper.querySOQL(strSOQL, function (errorSubs, resultSubs) {
                          if (errorSubs){
                              logger.logError(' Not possible to look subscriptions for user ' + beacon.email);
                          }else{
                             logger.logMessage("Total Subscriptions " +resultSubs.totalSize + " found for user "+ beacon.email);
                            for (var l=0; l< resultSubs.totalSize; l++){
                              logger.logMessage("> Channel " + resultSubs.records[l].Channel__c + " subscribed by " + beacon.email);
                              //Check published contents from each channel
                              
                              
                            }
                          }
                   });

                 });

             }
          }
          
      });
  });
}