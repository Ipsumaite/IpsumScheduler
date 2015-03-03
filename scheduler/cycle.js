'use strict';
var Firebase = require('firebase'),
    logger = require('../services/logger.js'),
    sfWrapper = require('../services/salesforceWrapper.js'),
    every = require('schedule').every;




var myChannelRef = new Firebase(process.env.FIREBASEURL+"/channels");
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
                   logger.logMessage("For user "+ key + "/"+ beacon.email+ " date difference since last activation report in minutes :"+timediff);
                     
//                    var strSOQL='SELECT Channel__c ,ContractNumber FROM Contract where AccountId = \'' + key + '\' AND SpecialTerms  not in (\'Canceled\')';
//                    sfWrapper.querySOQL(strSOQL, function (errorSubs, resultSubs) {
//                           if (errorSubs){
//                               logger.logError(' Not possible to look subscriptions for user ' + beacon.email);
//                           }else{
//                              logger.logMessage("Total Subscriptions " +resultSubs.totalSize + " found for user "+ key);
//                             for (var l=0; l< resultSubs.totalSize; l++){
//                               logger.logMessage("> Channel " + resultSubs.records[l].Channel__c + " subscribed by " + key);
//                               //Check published contents from each channel
//                               //For each channel what is the respective Account ID
//                               var subchannel = resultSubs.records[l].Channel__c;
//                               //for each accountID the reference for the published content
//                               myChannelRef.once("value", function(snap){
//                                 var accounts = snap.val();
//                                 for (var acckey in accounts ){
//                                   var channels = accounts[acckey];
//                                   for (var chkey in channels){
//                                     //console.log("\n##############"+subchannel + ".."+chkey);
//                                     if ( subchannel == chkey)
//                                       console.log("Account " + acckey + "- key " + chkey + "- Subscribed " +  subchannel);
                                    
//                                   }
//                                 }
//                                 //console.log(JSON.stringify(snap.val()));
//                               });
                              
//                             }
//                           }
//                    });

                 });

             }
          }
          
      });
  });
}