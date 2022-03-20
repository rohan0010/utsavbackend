'use strict';

const User = require('../schemas/userschema');

const commonOperations = require('./commonoperations');
const logger = require('../logger');
const utils = require('../utils');
const dbOperations = {
  sendVerificationCode2: function (number, username) {
    var newTimeStamp = new Date();
    var code = utils.randomNumberString(4);
    console.log(code);
    User.update(
      {
        username: username,
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
          var body = 'Your verification code is ' + code;
          utils.sendSms(number, body);
          //need to be a callback function
          // utils.response(response, 'success');
        }
      }
    );
  },
  ////Check Email > Username if already exists

  checkUser: function (request, response) {
    logger.debug('crud signup checkUser');
    var that = this;
    var userObject = request.body;
    request.body.userId = utils.randomStringGenerate(32);
    User.findOne(
      {
        userEmail: userObject.userEmail,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          logger.debug('crud result');
          if (result != undefined) {
            utils.response(response, 'taken', 'email already taken');
          } else {
            var obj = {
              username: userObject.username,
              notFound: undefined,
            };
            commonOperations.checkUsername(obj, function () {
              if (obj.notFound == true) {
                if (request.body.referCode) {
                  that.checkRefferalCode(request, response);
                } else {
                  that.addUser(request, response);
                }
              } else {
                utils.response(response, 'taken', 'username already taken');
              }
            });
          }
        }
      }
    );
  },

  /////////////Adding new user
  addUser: function (request, response, addMoney) {
    logger.debug('crud signup addUser');
    const utils = require('../utils');
    const config = require('../config');
    console.log(request.body.role);
    var data = {};
    data.userInfo = {};
    if (request.body.role == 'vendor') {
      data.gstNumber = request.body.gstNumber;
      data.panNumber = request.body.panNumber;
      data.companyName = request.body.companyName;
      data.contactPerson = request.body.contactPerson;
      data.companyAddress = request.body.companyAddress;
      data.userInfo = {
        bankAccountDetails: {
          ifscCode: request.body.ifscCode,
          bankAccountNumber: request.body.bankAccountNumber,
          bankName: request.body.bankName,
        },
      };
    }
    data.userEmail = request.body.userEmail;
    data.username = request.body.username;
    data.password = request.body.password;
    data.role = request.body.role;

    if (request.body.firstName) {
      data.userInfo.firstName = request.body.firstName;
    }
    data.temporaryMobile = request.body.temporaryMobile;

    if (request.body.lastName) {
      data.userInfo.lastName = request.body.lastName;
    }
    if (request.body.phoneNumber) {
      data.userInfo.mobile = request.body.phoneNumber;
    }

    let data1 = {
      userInfo: request.userData.objectId,
      userId: request.userData.userId,
    };
    data.createdBy = data1;
    const encrypt = require('../encrypt');
    var salt = encrypt.genRandomString(16);
    var encryptedData = encrypt.sha512(data.password, salt);

    data.password = encryptedData.hash;
    data.salt = encryptedData.salt;

    data.userId = request.body.userId;

    data.registrationDate = new Date();
    data.emailVerified = false;
    data.credits = addMoney;

    User.create(data, function (error, result) {
      if (error) {
        logger.error(error);
        console.log(error);
        utils.response(response, 'fail');
      } else {
        logger.debug('crud result');
        // commonOperations.sendLink(
        //   result.userEmail,
        //   "emailactivate",
        //   "emailActivationToken"
        // );
        var responseObject = {
          message: 'success',
        };
        utils.fillSession(request, response, result, responseObject);
      }
    });
  },

  ////Check Email > Username if already exists
  checkUser2: function (request, response) {
    logger.debug('crud signup checkUser2');
    var that = this;
    var userObject = request.body;
    request.body.userId = utils.randomStringGenerate(32);
    User.findOne(
      {
        mobile: userObject.mobile,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          logger.debug('crud result');
          if (result != undefined) {
            utils.response(response, 'taken', 'mobile already taken');
          } else {
            var obj = {
              username: userObject.username,
              notFound: undefined,
            };
            commonOperations.checkUsername(obj, function () {
              if (obj.notFound == true) {
                if (request.body.referCode) {
                  if (userObject.userEmail) {
                    User.findOne(
                      {
                        userEmail: userObject.userEmail,
                      },
                      function (error, result) {
                        if (error) {
                          logger.error(error);
                          utils.response(response, 'fail');
                        } else {
                          logger.debug('crud result');
                          if (result != undefined) {
                            utils.response(
                              response,
                              'taken',
                              'email already taken'
                            );
                          } else {
                            that.checkRefferalCode(request, response);
                          }
                        }
                      }
                    );
                  }
                 
                } else {
                  if (userObject.userEmail) {
                    User.findOne(
                      {
                        userEmail: userObject.userEmail,
                      },
                      function (error, result) {
                        if (error) {
                          logger.error(error);
                          utils.response(response, 'fail');
                        } else {
                          logger.debug('crud result');
                          if (result != undefined) {
                            utils.response(
                              response,
                              'taken',
                              'email already taken'
                            );
                          } else {
                            that.addUser2(request, response);
                          }
                        }
                      }
                    );
                  } else {
                    that.addUser2(request, response);
                  }
                }
              } else {
                utils.response(response, 'taken', 'username already taken');
              }
            });
          }
        }
      }
    );
  },
  checkRefferalCode: function (request, response) {
    var that = this;
    logger.debug('crud signup checkRefferalCode');
    User.findOne(
      {
        ReferralCode: request.body.referCode,
      },
      (err, res) => {
        if (err) {
          console.log('Rih', err);
          utils.response(response, 'fail', 'Invalid Refer Code');
        } else if (res) {
          console.log('Rih', res);

          if (res && res.ReferralCode) {
            var addMoney = 50;
            that.addUser2(request, response, addMoney);
            var Query;
            if (res.usedBy.length == 0) {
              Query = [request.body.userId];
            } else {
              var arr = [];
              arr.push(res.usedBy);
              arr.push(request.body.userId);
              Query = arr;
            }
            User.findOneAndUpdate(
              {
                ReferralCode: request.body.referCode,
              },
              {
                $set: {
                  usedBy: Query,
                },
              },
              function (error, result) {
                if (error) {
                  logger.error(error);
                  // callback(error, null);
                } else {
                  logger.debug('crud result' + result);
                  // callback(null, result);
                }
              }
            );
          }
        } else {
          console.log('rjha', res);
          utils.response(response, 'notFound', 'Invalid refer code');
        }
      }
    );
  },
  checkAndFindParents: function (request, response) {
    var that = this;
    logger.debug('crud signup checkAndFindParents');
    const maxChilds = require('../config').maxChildAllowed;
    User.findOne(
      {
        username: request.body.referCode,
      },
      (err, res) => {
        if (err) {
          utils.response(response, 'fail', 'Invalid Refer Code');
        } else if (res) {
          if (res && res.userId) {
            var ids = User.find(
              {
                parent: res._id,
              },
              (err1, res1) => {
                if (err1) {
                  utils.response(response, 'fail');
                } else if (res1 && res1.length < maxChilds) {
                  var ancestors = [res._id];
                  if (res.ancestors && ancestors.length > 0) {
                    ancestors = [...res.ancestors, res._id];
                  }
                  that.addUser(request, response, res._id, ancestors);
                } else {
                  utils.response(
                    response,
                    'fail',
                    'Maximum code usage exceeded'
                  );
                }
              }
            );
          }
        } else {
          utils.response(response, 'notFound', 'Invalid refer code');
        }
      }
    );
  },

  /////////////Adding new user based on mobile
  addUser2: function (request, response, addMoney) {
    logger.debug('crud signup addUser');
    const utils = require('../utils');
    const config = require('../config');
    var data = {};
    if (request.body.userEmail) {
      data.tempEmail = request.body.userEmail;
    }
    data.temporaryMobile = request.body.mobile;
    data.username = request.body.username;
    data.password = request.body.password;
    data.role = request.body.role;
    data.userInfo = {};
    if (request.body.firstName) {
      data.userInfo.firstName = request.body.firstName;
    }
    //data.temporaryMobile = request.body.temporaryMobile;

    if (request.body.lastName) {
      data.userInfo.lastName = request.body.lastName;
    }
    if (request.body.phoneNumber) {
      data.userInfo.mobile = request.body.phoneNumber;
    }

    const encrypt = require('../encrypt');
    var salt = encrypt.genRandomString(16);
    var encryptedData = encrypt.sha512(data.password, salt);

    data.password = encryptedData.hash;
    data.salt = encryptedData.salt;

    data.userId = request.body.userId;

    data.registrationDate = new Date();
    data.emailVerified = false;
    data.credits = addMoney;
    User.create(data, function (error, result) {
      if (error) {
        logger.error(error);
        console.log(error);
        utils.response(response, 'fail');
      } else {
        logger.debug('crud result');
        dbOperations.sendVerificationCode2(
          request.body.mobile,
          request.body.username
        );
        // commonOperations.sendLink(
        //   result.userEmail,
        //   "emailactivate",
        //   "emailActivationToken"
        // );
        var responseObject = {
          message: 'success',
        };
        utils.fillSession(request, response, result, responseObject);
      }
    });
  },
};

module.exports = dbOperations;
