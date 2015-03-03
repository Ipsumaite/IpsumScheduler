'use strict';
var Firebase = require('firebase'),
    logger = require('../services/logger.js'),
    sfWrapper = require('../services/salesforceWrapper.js'),
    every = require('schedule').every;




var myChannelRef = new Firebase(process.env.FIREBASEURL+"/channels");
var publishrate= process.env.PERIOD+"s";
var myRef = new Firebase(process.env.FIREBASEURL+"/streams");
var contents=[];

var subscriptions = [];
var subscriptionsShadow = [];
exports.readsubscriptions=function(){
  
  var strSOQL='SELECT Channel__c ,ContractNumber, AccountId FROM Contract  WHERE SpecialTerms  not in (\'Canceled\')';
  logger.logMessage("Reading Subscriptions");  
                  
                   while (subscriptionsShadow.pop()) {}
                   sfWrapper.querySOQL(strSOQL, function (errorSubs, resultSubs) {
                          if (errorSubs){
                             logger.logError(' Not possible to look for subscriptions');
                          }else{
                            logger.logMessage("Total Subscriptions " +resultSubs.totalSize + " found !");
                            for (var l=0; l< resultSubs.totalSize; l++){
                                logger.logMessage("> Channel " + resultSubs.records[l].Channel__c + " subscribed by " + resultSubs.records[l].AccountId);
                                subscriptionsShadow.push(
                                  {
                                    Channel:  resultSubs.records[l].Channel__c,
                                    ContractNumber:  resultSubs.records[l].ContractNumber,
                                    AccountId:  resultSubs.records[l].AccountId                             
                                  }
                                );

                              }
                              if (subscriptionsShadow.length>0){
                                while (subscriptions.pop()) {}
                                subscriptions = subscriptionsShadow.slice();
                              }
                              logger.logMessage(" Loaded "+subscriptions.length + " subscriptions");
                          }
                   });
}

// Puts contents in memory
exports.running=function(){
  
  myChannelRef.on("value", function(snapshot) {
       while (contents.pop()) {}
       var accounts = snapshot.val();

       for (var account in accounts) {
         var channels = accounts[account];
         for (var channel in channels){
           var conts = channels[channel];
           var channeltmp={};
           channeltmp.Id =  channel;
           channeltmp.contents = [];
           
           for (var content in conts){
             logger.logMessage("Reading published contents  from  Accounts -->" + account + " Channel " + channel + " Content " + content);
             var contenttmp = conts[content];
             channeltmp.contents.push(
                contenttmp
             );
           }
           contents.push(channeltmp);
         }
       }
  });
}


exports.streams=function(){
    every(publishrate).do(function() {
      var d = new Date();
      logger.logMessage("Checking all streams again... ");

      myRef.once("value", function(snapshot) {
          if (snapshot.val()){
            var accounts = snapshot.val();

            for (var account in accounts) {
                 var beacon =  accounts[account].beacon;
                 var streamcontents = accounts[account].contents; 
                 var timediff = Math.round((Date.now()-beacon.date)/(1000*60));
                 logger.logMessage("For user "+ account + "/"+ beacon.email+ " date difference since last activation report in minutes: "+timediff);
                 if (timediff < parseInt(process.env.STREAMTIMEOUT)){

                   //check for each account what were the subscriptios and for each subscribed channel copy the contents
                   subscriptions.forEach(function (subscription){
                     if (subscription.AccountId == account){
                        logger.logMessage(" Found subscribed channel " + subscription.Channel + " for account " + account + "/"+ beacon.email );

                        if (streamcontents !== undefined){
                          myRef.child(account+"/contents").remove();
                        }
                       // Check channels to add contents, if channel match with subscription just clone data into stream
                       contents.forEach(function (channel){
                         if (channel.Id == subscription.Channel){
                           myRef.child(account+"/contents").set(
                             channel.contents
                           );
                         }
                       });

                     }
                   });
                 }else{ //Remove Account from streams caused by timeout
                    logger.logMessage("Removed stream "+ account + "/"+ beacon.email+ " for activation timeout ");
                    myRef.child(account).remove();
                 }

              
             }
          }
      });
  });
 
  
}