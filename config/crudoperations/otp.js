'use strict';

const User = require('../schemas/userschema');
const utils = require('../utils');
const commonOperations = require('./commonoperations');
const logger = require('../logger');

const dbOperations = {
  /////////////Mobile Number Verifiction

  ////resendVerification COde
  reSendVerificationCode: function (request, response, userId) {
    logger.debug('crud profile sendVerificationCode');
    var mobileId = '+91' + request.body.mobile;
    var code = utils.randomNumberString(4);
    var body = 'Your verification code is ' + code;
    var newTimeStamp = new Date();

    User.findOne(
      {
        temporaryMobile: mobileId,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          if (result == null) {
            response.json({
              code: 404,
              success: false,
              message: 'mobile not found',
            });
          } else {
            User.update(
              {
                temporaryMobile: mobileId,
              },
              {
                $set: {
                  mobileTokenStamp: newTimeStamp,
                  mobileVerificationCode: code,
                },
              },
              function (error, result) {
                if (error) {
                  logger.error(error);
                  utils.response(response, 'fail');
                } else {
                  logger.debug('crud result');
                  utils.sendSms(mobileId, body);
                  utils.response(response, 'success');
                  //need to be a callback function
                }
              }
            );
          }
        }
      }
    );
  },

  ////Send Sms
  sendVerificationCode: function (request, response, userId) {
    logger.debug('crud profile sendVerificationCode');
    var mobileId = request.body.loginId;
    var code = utils.randomStringGenerate(6);
    var body = 'Your verification code is ' + code;
    var newTimeStamp = new Date();

    User.findOne(
      {
        mobile: mobileId,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          if (result == null) {
            response.json({
              code: 404,
              success: false,
              message: 'mobile-not-exists',
            });
          } else {
            User.update(
              {
                mobile: mobileId,
              },
              {
                $set: {
                  mobileTokenStamp: newTimeStamp,
                  mobileVerificationCode: code,
                },
              },
              function (error, result) {
                if (error) {
                  logger.error(error);
                  utils.response(response, 'fail');
                } else {
                  logger.debug('crud result');
                  utils.sendSms(mobileId, body);
                  utils.response(response, 'success');
                  //need to be a callback function
                }
              }
            );
          }
        }
      }
    );
  },

  ////verify code
  verifyCode: function (request, response) {
    logger.debug('crud profile verifyCode');
    var that = this;
    // var userId = session.userId;
    var CodeObject = request.body;
    var date = new Date();

    User.findOne(
      {
        $and: [
          {
            mobile: request.body.loginId,
          },
          {
            mobileVerificationCode: CodeObject.code,
          },
        ],
      },
      function (error, result) {
        if (error) {
          logger.error(error);

          utils.response(response, 'fail');
        } else {
          logger.debug('crud result');

          if (result == undefined) {
            utils.response(response, 'notFound');
          } else if (Math.abs(date - result.mobileTokenStamp) > 900000) {
            utils.response(response, 'unknown', 'code has expired');
          } else {
            User.find(
              {
                mobile: request.body.loginId,
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
                        // dbOperation.verifyCode(request, response, sessionData);
                        that.setMobile(request, result, response, sessionData);
                      }
                      i++;
                    }
                  }
                }
              }
            );
          }
        }
      }
    );
  },

  ////Check if mobile no. already exists
  checkMobileExists: function (request, result, response, session) {
    logger.debug('crud profile checkMobileExists');
    var that = this;
    var oldResult = result;

    User.findOne(
      {
        mobile: result.temporaryMobile,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          logger.debug('crud result');
          if (result != undefined) {
            utils.response(response, 'unknown', 'mobile already exists');
          } else {
            that.setMobile(request, oldResult, response, session);
          }
        }
      }
    );
  },

  ////Updating Mobileno.
  setMobile: function (request, result, response, session) {
    logger.debug('crud profile setMobile');
    // var TemporaryMobile = result.temporaryMobile;
    var userId = result.userId;

    User.update(
      {
        userId: userId,
      },
      {
        $set: {
          mobileVerificationCode: undefined,
        },
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          logger.debug('crud result');
          var responseObject = {
            message: 'success',
          };
          utils.fillSession(request, response, session, responseObject);
        }
      }
    );
  },

  //////Checking old password
  checkPassword: function (request, response, session) {
    logger.debug('crud profile checkPassword');
    var that = this;
    var passwordObject = request.body;
    var userId = session.userId;
    User.findOne(
      {
        userId: userId,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          logger.debug('crud result');
          if (result == undefined) {
            utils.response(response, 'notFound');
          } else if (result.salt === undefined) {
            utils.response(response, 'fail');
          } else {
            const encrypt = require('../encrypt');
            var salt = result.salt;
            var encryptedData = encrypt.sha512(
              passwordObject.oldPassword,
              salt
            );

            passwordObject.oldPassword = encryptedData.hash;
            if (result.password === passwordObject.oldPassword) {
              that.setNewPassword(request, response, session);
            } else {
              utils.response(response, 'fail');
            }
          }
        }
      }
    );
  },
  //////////////Setting new password
  setNewPassword: function (request, response, session) {
    logger.debug('crud profile setNewPassword');
    var passwordObject = request.body;

    const encrypt = require('../encrypt');
    var salt = encrypt.genRandomString(16);
    var encryptedData = encrypt.sha512(passwordObject.password, salt);

    passwordObject.password = encryptedData.hash;
    passwordObject.salt = encryptedData.salt;

    var userId = session.userId;

    User.update(
      {
        userId: userId,
      },
      {
        $set: {
          password: passwordObject.password,
          salt: passwordObject.salt,
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
  },
};

module.exports = dbOperations;
