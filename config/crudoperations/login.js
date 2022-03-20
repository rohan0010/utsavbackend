'use strict';

const User = require('../schemas/userschema');
const logger = require('../logger');
const utils = require('../utils');
const Session = require('../schemas/sessionschema');
const dbOperation = require('../crudoperations/otp');

const dbOperations = {
  //Check login id and password > Fill Session
  doLogin: function (request, response) {
    logger.debug('crud login doLogin');
    const utils = require('../utils');
    var loginObject = request.body;
    var mobileId = loginObject.loginId;
    if (loginObject.loginId.length != 10) {
      mobileId = 'xxxxxxxxxxxxxxx';
    }
    User.find(
      {
        $or: [
          {
            userEmail: loginObject.loginId,
          },
          {
            username: loginObject.loginId,
          },
          {
            mobile: { $regex: mobileId },
          },
          {
            temporaryMobile: { $regex: mobileId },
          },
        ],
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          logger.debug('crud result');
          if (result.length < 1) {
            utils.response(response, 'fail');
          } else {
            var i = 0;
            var numberOfUsersFound = 0;
            const encrypt = require('../encrypt');
            while (i < result.length) {
              if (result[i].salt === undefined) {
                i++;
              } else {
                var salt = result[i].salt;
                var encryptedData = encrypt.sha512(
                  loginObject.loginPassword,
                  salt
                );

                var encryptedPassword = encryptedData.hash;
                if (result[i].password === encryptedPassword) {
                  result[i].rememberMe = loginObject.rememberMe;
                  numberOfUsersFound++;
                  var sessionData = result[i];
                }
                i++;
              }
            }
            if (numberOfUsersFound === 1) {
              var responseObject = {
                message: 'success',
              };
              console.log('rohan', sessionData.banned);
              if (sessionData.banned == true) {
                utils.response(response, 'fail', 'You have been banned');
              } else if (result[0].temporaryMobile && !result[0].mobile) {
                utils.response(response, 'fail', 'Mobile not verified');
              } else {
                utils.fillSession(
                  request,
                  response,
                  sessionData,
                  responseObject
                );
              }
            } else if (numberOfUsersFound > 1) {
              utils.response(response, 'fail');
            } else {
              utils.response(response, 'notFound');
            }
          }
        }
      }
    );
  },
  doLogin1:function (request,response){
    logger.debug('crud login doLogin');
    const utils =require("../utils");
    var loginObject=request.body;
    var mobileId = loginObject.loginId; 
    if(loginObject.loginId.length!=10){
        mobileId = "xxxxxxxxxxxxxxx";
    }
    User.find({
        "$or": [{
                "userEmail":loginObject.loginId
            }, 
            {
                "username": loginObject.loginId
            },
            {
                "mobile": { "$regex": mobileId }
            }]
    },
    function(error,result){
        if(error){
            logger.error(error);
            utils.response(response,'fail');
        }
        else{ 
            logger.debug('crud result'); 
            if(result.length<1){
                utils.response(response,'fail');
            }
            else{
                var i=0;
                var numberOfUsersFound=0;
                const encrypt=require('../encrypt');
                while(i<result.length){
                    if(result[i].salt===undefined){
                        i++;
                    }
                    else{
                        var salt=result[i].salt;
                        var encryptedData=encrypt.sha512(loginObject.loginPassword,salt);

                        var encryptedPassword=encryptedData.hash;
                        if(result[i].password===encryptedPassword){
                            result[i].rememberMe=loginObject.rememberMe;
                            numberOfUsersFound++;
                            var sessionData=result[i];
                        }
                        i++;    
                   }
                }
                if(numberOfUsersFound===1){
                    var responseObject={
                        message:"success",
                    };
                    console.log("rohan",sessionData.banned)
                    if(sessionData.banned==true)
                    {
                        utils.response(response,'fail',"You have been banned");

                    }
                    else{
                        utils.fillSession(request,response,sessionData,responseObject);
                    }
                
                }
                else if(numberOfUsersFound>1){
                    utils.response(response,'fail');
                }
                else{
                    utils.response(response,'notFound');
                }  
            }  
        }
    });
},


  doLoginUsingOtp: function (request, response) {
    const utils = require('../utils');
    var loginObject = request.body;
    var mobileId = loginObject.loginId;

    User.find(
      {
        mobile: mobileId,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          logger.debug('crud result');

          var i = 0;

          while (i < result.length) {
            if (result[i].salt === undefined) {
              i++;
            } else {
              if ((result[i].salt = '12d0c7c2a72c2ed5')) {
                var sessionData = result[i];
                dbOperation.sendVerificationCode(
                  request,
                  response,
                  sessionData.userId
                );
              }
              i++;
            }
          }
        }
      }
    );
  },

  verifyOtp: function (request, response) {
    const utils = require('../utils');
    var loginObject = request.body;
    var mobileId = loginObject.loginId;

    User.find(
      {
        mobile: mobileId,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          logger.debug('crud result');

          var i = 0;
          var numberOfUsersFound = 0;
          while (i < result.length) {
            if (result[i].salt === undefined) {
              i++;
            } else {
              if ((result[i].salt = '12d0c7c2a72c2ed5')) {
                numberOfUsersFound++;
                var sessionData = result[i];
                dbOperation.verifyCode(request, response, sessionData);
              }
              i++;
            }
          }
        }
      }
    );
  },
};

module.exports = dbOperations;
