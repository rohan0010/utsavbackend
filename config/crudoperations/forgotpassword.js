'use strict';

const User = require('../schemas/userschema');
const commonOperations = require('./commonoperations');
const logger = require('../logger');
const utils = require('../utils');
const dbOperations = {
  /////Sending link with token
  checkEmail: function (request, response) {
    logger.debug('crud forgotpass checkEmail');

    var ForgotObject = request.body;
    User.findOne({ userEmail: ForgotObject.email }, function (error, result) {
      if (error) {
        logger.error(error);
        utils.response(response, 'fail');
      } else {
        logger.debug('crud result');
        if (result != undefined) {
          commonOperations.sendLink(
            ForgotObject.email,
            'forgotpassword',
            'forgotPasswordToken'
          );
          //need to be a callback function
          utils.response(response, 'success', 'sent');
        } else {
          utils.response(response, 'notFound');
        }
      }
    });
  },

  sendVerificationCode2: function (number) {
    var newTimeStamp = new Date();
    var code = utils.randomNumberString(4);
    console.log(code);
    User.update(
      {
        mobile: number,
      },
      {
        $set: {
          passwordTokenStamp: newTimeStamp,
          forgotPasswordToken: code,
        },
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          logger.debug('crud result');
          var body = 'Your reset password code is ' + code;
          utils.sendSms(number, body);
          //need to be a callback function
          // utils.response(response, 'success');
        }
      }
    );
  },

  checkMobile: function (request, response) {
    logger.debug('crud forgotpass checkMobile');

    var ForgotObject = request.body;
    User.findOne({ mobile: ForgotObject.mobile }, function (error, result) {
      if (error) {
        logger.error(error);
        utils.response(response, 'fail');
      } else {
        logger.debug('crud result');
        if (result != undefined) {
          dbOperations.sendVerificationCode2(ForgotObject.mobile);
          //need to be a callback function
          utils.response(response, 'success', 'sent');
        } else {
          utils.response(response, 'notFound');
        }
      }
    });
  },

  /////checking token
  passwordReset: function (request, response) {
    logger.debug('crud forgotpass passwordReset');
    var that = this;
    var PasswordObject = request.body;

    User.findOne(
      {
        $and: [
          {
            userEmail: PasswordObject.userEmail,
          },
          {
            forgotPasswordToken: PasswordObject.token,
          },
        ],
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          logger.debug('crud result');
          var date = new Date();

          if (result == undefined) {
            utils.response(response, 'notFound');
          } else if (Math.abs(date - result.passwordTokenStamp) > 86400000) {
            utils.response(response, 'fail');
          } else {
            if (PasswordObject.newPassword != undefined) {
              that.saveNewPassword(request, response);
            } else {
              utils.response(response, 'success');
            }
          }
        }
      }
    );
  },

  passwordResetMobile: function (request, response) {
    logger.debug('crud forgotpass passwordResetMobile');
    var that = this;
    var PasswordObject = request.body;

    User.findOne(
      {
        $and: [
          {
            mobile: PasswordObject.mobile,
          },
          {
            forgotPasswordToken: PasswordObject.token,
          },
        ],
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          //   console.log(result);
          logger.debug('crud result');
          var date = new Date();

          if (result == undefined) {
            utils.response(response, 'notFound');
          } else if (Math.abs(date - result.passwordTokenStamp) > 86400000) {
            utils.response(response, 'fail');
          } else {
            if (PasswordObject.newPassword != undefined) {
              that.saveNewPasswordMobile(request, response);
            } else {
              utils.response(response, 'fail');
            }
          }
        }
      }
    );
  },

  /////////Saving new password
  saveNewPassword: function (request, response) {
    logger.debug('crud forgotpass saveNewPassword');

    var newPasswordObject = request.body;

    const encrypt = require('../encrypt');
    var salt = encrypt.genRandomString(16);
    var encryptedData = encrypt.sha512(newPasswordObject.newPassword, salt);

    newPasswordObject.newPassword = encryptedData.hash;
    newPasswordObject.salt = encryptedData.salt;

    User.update(
      {
        userEmail: newPasswordObject.userEmail,
      },
      {
        $set: {
          password: newPasswordObject.newPassword,
          salt: newPasswordObject.salt,
          emailVerified: true,
          forgotPasswordToken: undefined,
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

  saveNewPasswordMobile: function (request, response) {
    logger.debug('crud forgotpass saveNewPasswordMobile');

    var newPasswordObject = request.body;

    const encrypt = require('../encrypt');
    var salt = encrypt.genRandomString(16);
    var encryptedData = encrypt.sha512(newPasswordObject.newPassword, salt);

    newPasswordObject.newPassword = encryptedData.hash;
    newPasswordObject.salt = encryptedData.salt;

    User.update(
      {
        mobile: newPasswordObject.mobile,
      },
      {
        $set: {
          password: newPasswordObject.newPassword,
          salt: newPasswordObject.salt,
          emailVerified: true,
          forgotPasswordToken: undefined,
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
