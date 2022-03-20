'use strict';

const User = require('../schemas/userschema');
const utils = require('../utils');
const commonOperations = require('./commonoperations');
const logger = require('../logger');
const { response } = require('express');

const dbOperations = {
  //Updating username
  changeUsername: function (request, response, session) {
    logger.debug('crud profile changeUsername');
    var UsernameObject = request.body;
    var userId = session.userId;

    var obj = {
      username: UsernameObject.username,
      notFound: undefined,
    };
    commonOperations.checkUsername(obj, function () {
      if (obj.notFound === true) {
        User.update(
          { userId: userId },
          {
            $set: {
              username: obj.username,
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
        utils.response(response, 'success', 'taken');
      }
    });
  },
  updateBankDetails: function (request, response, session) {
    logger.debug('crud profile sendVerificationCode');
    var userInfo = {};
    var userId = session.userId;
    let data = {
      ifscCode: request.body.ifscCode,
      bankAccountNumber: request.body.bankAccountNumber,
      bankName: request.body.bankName,
    };
    userInfo.bankAccountDetails = data;
    User.findOne(
      {
        userId: userId,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          userInfo.firstName = result.userInfo.firstName;
          userInfo.lastName = result.userInfo.lastName;

          userInfo.profilePic = result.userInfo.profilePic;
          User.update(
            {
              userId: userId,
            },
            {
              $set: {
                userInfo: userInfo,
              },
            },
            function (error, result) {
              if (error) {
                logger.error(error);
                utils.response(response, 'fail');
              } else {
                logger.debug('crud result');
                console.log('fjvnjf', result);
                utils.response(response, 'success');
              }
            }
          );
        }
      }
    );
  },
  ////updating info
  updateProfileData: function (request, response, session) {
    logger.debug('crud profile updateProfileData');
    var profileObject = request.body;
    var userInfo = {};
    userInfo.firstName = profileObject.firstName;
    userInfo.lastName = profileObject.lastName;
    userInfo.mobile = profileObject.mobile;

    User.findOne(
      {
        userId: session.userId,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          if (result.userInfo.bankAccountDetails != undefined) {
            userInfo.bankAccountDetails = result.userInfo.bankAccountDetails;
          }
          userInfo.profilePic = result.userInfo.profilePic;
          User.update(
            {
              userId: session.userId,
            },
            {
              $set: {
                userInfo: userInfo,
              },
            },
            function (error, result) {
              if (error) {
                logger.error(error);
                utils.response(response, 'fail');
              } else {
                logger.debug('crud result');
                console.log('rohan', result);
                utils.response(response, 'success');
              }
            }
          );
        }
      }
    );
  },
  updateProfileDataSuperadmin: function (request, response, userId) {
    logger.debug('crud profile updateProfileData');
    var profileObject = request.body;
    var userInfo = {};
    userInfo.firstName = profileObject.firstName;
    userInfo.lastName = profileObject.lastName;
    userInfo.mobile = profileObject.mobile;
    let data = {
      ifscCode: request.body.ifscCode,
      bankAccountNumber: request.body.bankAccountNumber,
      bankName: request.body.bankName,
    };
    userInfo.bankAccountDetails = data;
    let obj = {
      userInfo: userInfo,
    };

    obj.gstNumber = request.body.gstNumber;
    obj.panNumber = request.body.panNumber;
    obj.companyName = request.body.companyName;
    obj.contactPerson = request.body.contactPerson;
    obj.companyAddress = request.body.companyAddress;

    User.findOne(
      {
        userId: userId,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          obj.userInfo.profilePic = result.userInfo.profilePic;
          console.log(obj);
          User.update(
            {
              userId: userId,
            },
            {
              $set: obj,
            },
            function (error, result) {
              if (error) {
                logger.error(error);
                utils.response(response, 'fail');
              } else {
                logger.debug('crud result');
                console.log('rohan', result);
                utils.response(response, 'success');
              }
            }
          );
        }
      }
    );
  },
  /////////////Mobile Number Verifiction
  ////Send Sms
  sendVerificationCode: function (request, response, session) {
    logger.debug('crud profile sendVerificationCode');
    var MobileObject = request.body;
    var userId = session.userId;
    var number = MobileObject.countryCode + MobileObject.mobileNumber;
    var code = utils.randomNumberString(4);
    var body = 'Your verification code is ' + code;
    var newTimeStamp = new Date();
    User.findOne(
      {
        mobile: number,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else if (result != undefined) {
          response.send({
            message: 'Mobile already registered',
            code: 500,
            success: true,
          });
        } else {
          User.findOne(
            {
              userId: userId,
              mobile: number,
            },
            function (error, result) {
              if (error) {
                logger.error(error);
                utils.response(response, 'fail');
              } else if (
                result &&
                result.mobileTokenStamp &&
                Math.abs(newTimeStamp - result.mobileTokenStamp) < 900000
              ) {
                logger.debug('crud result');
                body =
                  'Your verification code is ' + result.mobileVerificationCode;
                utils.sendSms(number, body);
                utils.response(response, 'success');
              } else {
                User.update(
                  {
                    userId: userId,
                  },
                  {
                    $set: {
                      mobileTokenStamp: newTimeStamp,
                      temporaryMobile: number,
                      mobileVerificationCode: code,
                    },
                  },
                  function (error, result) {
                    if (error) {
                      logger.error(error);
                      utils.response(response, 'fail');
                    } else {
                      logger.debug('crud result');
                      utils.sendSms(number, body);
                      //need to be a callback function
                      utils.response(response, 'success');
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  },

  sendVerificationCode2: function (username) {
    var newTimeStamp = new Date();
    var code = utils.randomNumberGenerate(4);
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
          body = 'Your verification code is ' + code;
          utils.sendSms(number, body);
          //need to be a callback function
          // utils.response(response, 'success');
        }
      }
    );
  },

  setTime: function (request, response, session) {
    var userId = session.userId;

    User.update(
      {
        userId: userId,
      },
      {
        $set: {
          isScheduledMessage: true,
          scheduledTime: request.body.time,
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
  updateProfilePic: function (request, response, session) {
    logger.debug('crud profile sendVerificationCode');

    var userInfo = {};
    var userId = session.userId;

    userInfo.profilePic = request.body.profilePic;
    User.findOne(
      {
        userId: userId,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          if (result.userInfo.bankAccountDetails != undefined) {
            userInfo.bankAccountDetails = result.userInfo.bankAccountDetails;
          }
          userInfo.firstName = result.userInfo.firstName;
          userInfo.lastName = result.userInfo.lastName;
          userInfo.mobile = result.userInfo.mobile;

          User.update(
            {
              userId: userId,
            },
            {
              $set: {
                userInfo: userInfo,
              },
            },
            function (error, result) {
              if (error) {
                logger.error(error);
                utils.response(response, 'fail');
              } else {
                logger.debug('crud result');
                console.log('fjvnjf', result);

                utils.response(response, 'success');
              }
            }
          );
        }
      }
    );
  },
  updateProfileuploadPic: function (request, response, imgurl) {
    logger.debug('crud profile sendVerificationCode');

    var userInfo = {};
    var userId = request.uploaderId;

    userInfo.profilePic = imgurl;
    User.findOne(
      {
        userId: userId,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          if (result.userInfo.bankAccountDetails != undefined) {
            userInfo.bankAccountDetails = result.userInfo.bankAccountDetails;
          }
          userInfo.firstName = result.userInfo.firstName;
          userInfo.lastName = result.userInfo.lastName;
          userInfo.mobile = result.userInfo.mobile;

          User.update(
            {
              userId: userId,
            },
            {
              $set: {
                userInfo: userInfo,
              },
            },
            function (error, result) {
              if (error) {
                logger.error(error);
                utils.response(response, 'fail');
              } else {
                logger.debug('crud result');
                console.log('fjvnjf', result);

                utils.response(response, 'success');
              }
            }
          );
        }
      }
    );
  },
  addAddress: function (request, response) {
    logger.debug('crud commonoperation addToCart');
    var obj = request.body;
    User.update(
      { userId: request.userData.userId },
      {
        $push: {
          Addresses: {
            addressId: obj.addressId,
            firstName: obj.firstName,
            lastName: obj.lastName,
            area: obj.area,
            city: obj.city,
            state: obj.state,
            pincode: obj.pincode,
            country: obj.country,
          },
        },
      },
      function (error, result) {
        if (error) {
          logger.debug(error);
          // callback(error, null);
        } else {
          utils.response(response, 'success');
        }
      }
    );
  },
  updateAddress: function (request, response, userData) {
    var apple = userData;

    User.update(
      {
        userId: apple.userId,
        Addresses: {
          $elemMatch: {
            addressId: request.body.addressId,
          },
        },
      },
      {
        $set: {
          'Addresses.$.area': request.body.area,
          'Addresses.$.firstName': request.body.firstName,
          'Addresses.$.lastName': request.body.lastName,
          'Addresses.$.city': request.body.city,
          'Addresses.$.state': request.body.state,
          'Addresses.$.pincode': request.body.pincode,
          'Addresses.$.country': request.body.country,
        },
      },
      function (error, result) {
        if (error) {
          logger.debug(error);
          callback(error, null);
        } else {
          response.json({ message: 'success' });
        }
      }
    );
  },
  removeAddress: function (request, response, userData) {
    logger.debug('productcrud removeFromCart');

    User.update(
      {
        userId: userData.userId,
      },
      {
        $pull: {
          Addresses: {
            addressId: request.body.addressId,
          },
        },
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          response.json({ message: 'fail' });
        } else {
          logger.debug('crud result' + result);
          response.json({ message: 'success' });
        }
      }
    );
  },
  getProfileData: function (request, response, session) {
    logger.debug('crud profile sendVerificationCode');

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
          let info = result.userInfo;
          response.send({
            info,
            code: 200,
            success: true,
          });
        }
      }
    );
  },

  getProfileDataSuperadmin: function (request, response, userId) {
    logger.debug('crud profile sendVerificationCode');

    // var userId = session.userId;
    var Fields = {
      userId: true,
      username: true,
      userEmail: true,
      userInfo: true,
      mobile: true,
      companyAddress: true,
      gstNumber: true,
      panNumber: true,
      companyName: true,
      contactPerson: true,
    };
    User.findOne(
      {
        userId: userId,
      },
      Fields,
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          // let info = result.userInfo;
          response.send({
            result,
            code: 200,
            success: true,
          });
        }
      }
    );
  },
  getAddress: function (request, response, session) {
    logger.debug('crud profile sendVerificationCode');

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
          let info = result.Addresses;
          response.send({
            info,
            code: 200,
            success: true,
          });
        }
      }
    );
  },
  getAddressById: function (request, response, session) {
    logger.debug('crud profile sendVerificationCode');

    var userId = session.userId;

    var address = [];
    User.findOne(
      {
        userId: userId,
        //  Addresses: {
        //   $elemMatch: {
        //     addressId: request.body.addressId
        //   }
        // }
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          for (var i = 0; i < result.Addresses.length; i++) {
            if (result.Addresses[i].addressId == request.body.addressId) {
              address.push(result.Addresses[i]);
            }
          }
          response.send({
            address,
            code: 200,
            success: true,
          });
        }
      }
    );
  },
  getProfileInfoData: function (userId, callback) {
    logger.debug('crud profile sendVerificationCode');

    User.findOne(
      {
        userId: userId,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
        } else {
          callback(result);
        }
      }
    );
  },
  updateBankDetails: function (request, response, session) {
    logger.debug('crud profile sendVerificationCode');

    var userInfo = {};
    var userId = session.userId;
    let data = {
      ifscCode: request.body.ifscCode,
      bankAccountNumber: request.body.bankAccountNumber,
      bankName: request.body.bankName,
    };
    userInfo.bankAccountDetails = data;
    User.findOne(
      {
        userId: userId,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          userInfo.firstName = result.userInfo.firstName;
          userInfo.lastName = result.userInfo.lastName;
          userInfo.mobile = result.userInfo.mobile;
          userInfo.profilePic = result.userInfo.profilePic;

          User.update(
            {
              userId: userId,
            },
            {
              $set: {
                userInfo: userInfo,
              },
            },
            function (error, result) {
              if (error) {
                logger.error(error);
                utils.response(response, 'fail');
              } else {
                logger.debug('crud result');
                console.log('fjvnjf', result);

                utils.response(response, 'success');
              }
            }
          );
        }
      }
    );
  },
  updateBankDetailsSuperadmin: function (request, response, userId) {
    logger.debug('crud profile sendVerificationCode');

    var userInfo = {};
    // var userId = session.userId;
    let data = {
      ifscCode: request.body.ifscCode,
      bankAccountNumber: request.body.bankAccountNumber,
      bankName: request.body.bankName,
    };
    userInfo.bankAccountDetails = data;
    User.findOne(
      {
        userId: userId,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          userInfo.firstName = result.userInfo.firstName;
          userInfo.lastName = result.userInfo.lastName;
          userInfo.mobile = result.userInfo.mobile;
          userInfo.profilePic = result.userInfo.profilePic;

          User.update(
            {
              userId: userId,
            },
            {
              $set: {
                userInfo: userInfo,
              },
            },
            function (error, result) {
              if (error) {
                logger.error(error);
                utils.response(response, 'fail');
              } else {
                logger.debug('crud result');
                console.log('fjvnjf', result);

                utils.response(response, 'success');
              }
            }
          );
        }
      }
    );
  },

  checkPasswordAdmin: function (request, response, session) {
    logger.debug('crud profile checkPassword');
    var that = this;
    var passwordObject = request.body;
    var userId = session;
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
              that.setNewPasswordAdmin(request, response, session);
            } else {
              utils.response(response, 'fail');
            }
          }
        }
      }
    );
  },
  //////////////Setting new password
  setNewPasswordAdmin: function (request, response, session) {
    logger.debug('crud profile setNewPassword');
    var passwordObject = request.body;

    const encrypt = require('../encrypt');
    var salt = encrypt.genRandomString(16);
    var encryptedData = encrypt.sha512(passwordObject.password, salt);

    passwordObject.password = encryptedData.hash;
    passwordObject.salt = encryptedData.salt;

    var userId = session;

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

  ////verify code
  verifyCode: function (request, response, session) {
    logger.debug('crud profile verifyCode');
    var that = this;
    var userId = session.userId;
    var CodeObject = request.body;
    var date = new Date();

    User.findOne(
      {
        $and: [
          {
            userId: userId,
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
            that.checkMobileExists2(result, response);
          }
        }
      }
    );
  },

  ////verify otp based on mobile number
  verifyOTP: function (request, response, session) {
    logger.debug('crud profile verifyOTP');
    var that = this;
    // var userId = session.userId;
    var CodeObject = request.body;
    var date = new Date();

    User.findOne(
      {
        $and: [
          {
            temporaryMobile: '+91' + CodeObject.mobile,
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
            that.checkMobileExists2(result, response, request);
          }
        }
      }
    );
  },

  verifyOTP2: function (request, response, session) {
    logger.debug('crud profile verifyOTP2');
    var that = this;
    var userId = session.userId;
    var CodeObject = request.body;
    var date = new Date();

    User.findOne(
      {
        $and: [
          {
            temporaryMobile: '+91' + CodeObject.mobile,
          },
          {
            mobileVerificationCode: CodeObject.code,
          },
          {
            userId: userId,
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
            that.checkMobileExists2(result, response, request);
          }
        }
      }
    );
  },

  ////Check if mobile no. already exists
  checkMobileExists: function (result, response) {
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
            that.setMobile(oldResult, response);
          }
        }
      }
    );
  },

  ////Check if mobile no. already exists & send session
  checkMobileExists2: function (result, response, request) {
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
            that.setMobile2(oldResult, response, request);
          }
        }
      }
    );
  },

  /// Update mobile with session
  setMobile2: function (result, response, request) {
    logger.debug('crud profile setMobile');
    var TemporaryMobile = result.temporaryMobile;
    var userId = result.userId;
    if (!result.tempEmail) {
      result.tempEmail = result.userEmail;
    }

    User.update(
      {
        userId: userId,
      },
      {
        $set: {
          mobile: TemporaryMobile,
          temporaryMobile: undefined,
          mobileVerificationCode: undefined,
          userEmail: result.tempEmail,
          tempEmail: undefined,
        },
      },
      function (error, result2) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          logger.debug('crud result');
          var responseObject = {
            message: 'success',
          };
          console.log();
          result.mobile = TemporaryMobile;
          result.temporaryMobile = undefined;
          result.mobileVerificationCode = undefined;
          result.userEmail = result.tempEmail;
          result.tempEmail = undefined;
          utils.fillSession(request, response, result, responseObject);
          // utils.response(response, 'success');
        }
      }
    );
  },

  ////Updating Mobileno.
  setMobile: function (result, response) {
    logger.debug('crud profile setMobile');
    var TemporaryMobile = result.temporaryMobile;
    var userId = result.userId;

    User.update(
      {
        userId: userId,
      },
      {
        $set: {
          mobile: TemporaryMobile,
          temporaryMobile: undefined,
          mobileVerificationCode: undefined,
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
            console.log('rohan', response);
            utils.response(response, 'fail');
          } else {
            console.log('here', result);

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
              console.log('here');
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

  /////get user by id
  getUserById: function (id, callback) {
    logger.debug('crud profile getUserById');

    User.findOne(
      {
        userId: id,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          callback(error, null);
        } else {
          logger.debug('crud result' + result);
          console.log('oneerror', result);
          callback(null, result);
        }
      }
    );
  },
  getincash: function (id, response) {
    logger.debug('crud profile getUserById');

    User.find(
      {
        incash: { $gt: 0 },
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          // callback(error,null);
        } else {
          logger.debug('crud result' + result);
          //callback(null,result);
          response.send(result);
        }
      }
    );
  },
  getUserWithParents: function (id, callback) {
    logger.debug('crud profile getUsersWithParents');

    User.findOne({ userId: id }),
      function (error, result) {
        if (error) {
          logger.error(error);
          callback(error, null);
        } else {
          logger.debug('crud result' + result);
          callback(null, result);
        }
      };
  },
  populate: function (ancestors, callback) {
    User.find({ parent: ancestors }).exec(function (error, result) {
      if (error) {
        logger.error(error);
        callback(error, null);
      } else {
        logger.debug('crud result' + result);
        console.log('nvjnf', result);
        callback(null, result);
      }
    });
  },
  findallusers: function (ancestors, callback) {
    User.find().exec(function (error, result) {
      if (error) {
        logger.error(error);
        callback(error, null);
      } else {
        logger.debug('crud result' + result);
        console.log('nvjnf', result);
        callback(null, result);
      }
    });
  },

  assignCredit: function (id, credits, bp, callback) {
    logger.debug('crud profile assignCredit');
    User.findOne(
      {
        userId: id,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          callback(error, null);
        } else {
          User.findOneAndUpdate(
            {
              userId: id,
            },
            {
              $inc: {
                credits: credits,
                businessPoints: bp,
              },
            },
            function (error, result) {
              if (error) {
                logger.error(error);
                callback(error, null);
              } else {
                logger.debug('crud result' + result);
                callback(null, result);
              }
            }
          );
        }
      }
    );
  },
  incash: function (response, id, callback) {
    logger.debug('crud profile assignCredit');
    User.findOne(
      {
        userId: id,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          callback(error, null);
        } else {
          User.findOneAndUpdate(
            {
              userId: id,
            },
            {
              $set: {
                credits: result.credits - result.incash,
                incash: 0,
              },
            },
            function (error, result) {
              if (error) {
                logger.error(error);
                callback(error, null);
              } else {
                logger.debug('crud result' + result);
                callback(null, result);
              }
            }
          );
        }
      }
    );
  },
  getuser: function (request, response) {
    User.find({ role: { $ne: 'superadmin' } }, function (error, result) {
      if (error) {
        logger.error(error, null);
      } else {
        logger.debug('crud result' + result);
        //callback(result);

        response.send(result);
      }
    });
  },
  getuserrole: function (request, response) {
    User.find({ role: request.body.role })
    .sort({"registrationDate":-1})
   
    .exec(function (error, result) {
  
      if (error) {
        logger.error(error, null);
      } else {
        logger.debug('crud result' + result);
        //callback(result);

        response.send(result);
      }
    });
  },
  count: function (request, response) {
    User.find({ role: request.body.role }, function (error, result) {
      if (error) {
        logger.error(error, null);
      } else {
        logger.debug('crud result' + result);
        //callback(result);
        let res = result.length;
        // response.send(res);
        response.json({ users: { res }, code: 200, success: true });
      }
    });
  },
  incashuser: function (response, id, bp, callback) {
    logger.debug('crud profile assignCredit');
    User.findOne(
      {
        userId: id,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          callback(error, null);
        } else {
          if (bp > result.credits) {
            utils.response(response, 'fail', 'Please enter valid credit');
          } else {
            var amount = parseInt(result.incash) + parseInt(bp);
            console.log('fjvjf', amount);
            User.findOneAndUpdate(
              {
                userId: id,
              },
              {
                $set: {
                  incash: amount,
                },
              },
              function (error, result) {
                if (error) {
                  logger.error(error);
                  callback(error, null);
                } else {
                  logger.debug('crud result' + result);
                  callback(null, result);
                }
              }
            );
          }
        }
      }
    );
  },

  /////push to array
  pushToArray: function (id, field, target, callback) {
    logger.debug('crud profile getUserById');
    var Query = {};
    Query[field] = target;

    User.findOneAndUpdate(
      {
        userId: id,
      },
      {
        $push: Query,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          callback(error, null);
        } else {
          logger.debug('crud result' + result);
          callback(null, result);
        }
      }
    );
  },

  removeFromCart: function (request, response, userData) {
    logger.debug('productcrud removeFromCart');

    User.update(
      {
        userId: userData.userId,
      },
      {
        $pull: {
          cart: {
            productId: request.body.productId,
            variantId: request.body.variantId,
          },
        },
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          response.json({ message: 'fail' });
        } else {
          logger.debug('crud result' + result);
          response.json({ message: 'success' });
        }
      }
    );
  },
  updateCart: function (request, response, userData) {
    var apple = userData;

    User.update(
      {
        userId: apple.userId,
        cart: {
          $elemMatch: {
            productId: request.body.productId,
            variantId: request.body.variantId,
          },
        },
      },
      { $set: { 'cart.$.quantity': request.body.quantity } },
      function (error, result) {
        if (error) {
          logger.debug(error);
          callback(error, null);
        } else {
          response.json({ message: 'success' });
        }
      }
    );
  },
  updateProperty: function (user, credit, callback) {
    logger.debug('crud profile emptyCart');

    User.findOne(
      {
        userId: user,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          callback(error, null);
        } else {
          User.findOneAndUpdate(
            {
              userId: user,
            },
            {
              $set: {
                credits: result.credits + credit,
              },
            },
            function (error, result) {
              if (error) {
                logger.error(error);
                callback(error, null);
              } else {
                logger.debug('crud result' + result);
                callback(null, result);
              }
            }
          );
        }
      }
    );
  },
  emptybuynow: function (user, callback) {
    logger.debug('crud profile emptyCart');

    User.findOneAndUpdate(
      {
        userId: user,
      },
      {
        $set: {
          buynow: [],
        },
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          callback(error, null);
        } else {
          logger.debug('crud result' + result);
          callback(null, result);
        }
      }
    );
  },

  emptyCart: function (user, callback) {
    logger.debug('crud profile emptyCart');

    User.findOneAndUpdate(
      {
        userId: user,
      },
      {
        $set: {
          cart: [],
        },
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          callback(error, null);
        } else {
          logger.debug('crud result' + result);
          callback(null, result);
        }
      }
    );
  },
};

module.exports = dbOperations;
