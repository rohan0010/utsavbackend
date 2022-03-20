'use strict';

const User = require("../schemas/userschema");
const commonOperations=require("./commonoperations");
const logger = require("../logger");
const utils = require("../utils");
const dbOperations= {

    /////Send email activation link
    sendActivationLink:function(request,response){
        User.findOne(
            {
             
                  userEmail: request.body.userEmail,
            
            },
            function (error, result) {
              if (error) {
                logger.error(error);
                utils.response(response, 'fail');
              } else {
                logger.debug('crud result');
                if (result == undefined) {
                    User.update(
                        {
                          userId: request.userData.userId,
                        },
                        {
                          $set: {
                            emailVerified: true,
                            emailActivationToken: undefined,
                            userEmail: request.body.userEmail,
                            tempEmail: undefined,
                          },
                        },
                        function (error, result) {
                          if (error) {
                            logger.error(error);
                            utils.response(response, 'fail');
                          } else {
                            logger.debug('crud result');
                            utils.response(response, 'success');

                          }
                        }
                      );
                } else {
                    utils.response(response, 'fail');
                }
              }
            }
          );
    },

    ///////Check and Update session
    checkSession:function(request,response,userData){
        logger.debug('crud index checkSession');
        var that=this;
        User.findOne({
            userId:request.userData.userId
        },
        function(error,result){
            if(error){
                logger.error(error);
                utils.response(response,'fail');
            }
            else{
                logger.debug('crud result'); 
                if(!result){
                    utils.response(response,'notFound');
                }
                else{
                    var status={};
                    status.Message="Hello "+result.username;
                    status.Email=result.userEmail;
                    status.ActivationStatus=result.emailVerified;
                    // if(result.username!=userData.username || result.userInfo!=userData.userInfo){
                        var sessionData=result;
                        const utils = require("../utils");
                        utils.fillSession(request,response,sessionData,status); 
                    // }
                    // else{
                    //     status.userData=userData;
                    //     response.send(status);
                    // }
                }
            }
        })
    },

    //////Session destroy
    destroySession:function(request,response){
        logger.debug('crud index destroySession');
        const utils = require("../utils");
        
        utils.appSessionDestroy(request.token,response);
        
    }

};

module.exports =dbOperations;