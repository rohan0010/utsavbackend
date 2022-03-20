'use strict';

const cron = require('node-cron');
const logger = require("./logger");

const Users = require('./schemas/userschema');


var schedular = {

    scheduleMessages:() => {
        cron.schedule('* * 0 * * *', function () {
        Users.find({ isScheduledMessage: true }, function(error, result) {
            if (error) {
              logger.error(error);
              utils.response(response, "fail");
            } else {
              logger.debug("crud result");
              console.log("rohan",result)
              for(var i=0;i<result.length;i++)
              {
                  sendmessage(result[i].scheduledTime,result[i].mobile)
              }
            }
        })
   
        });
    },



 


};

var sendmessage = (time,mobile)=>{
    var today = new Date();
    var dd = today.getDate();
    
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 
    
    if(mm<10) 
    {
        mm='0'+mm;
    } 
    today = yyyy+'-'+mm+'-'+dd;
   
    var msg912=require('msg91-sms');
    msg912.scheduleOne('361330ADluy5BU60ad12f0P1',mobile,"Gym Reminder",'alaromaleafs',4,'91',today,time,function(response){
        console.log("rohhaannn",response)
      })
};



module.exports = schedular;
