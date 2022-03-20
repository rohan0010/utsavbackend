'use strict';

const User = require('../schemas/userschema');
const utils = require('../utils');
const logger = require('../logger');
const config = require('../config');
const Session = require('../schemas/sessionschema');

const dbOperations = {
  ////////Checking if username exists  /////////////////////
  checkUsername: function (object, callback) {
    logger.debug('crud common checkUsername');

    User.findOne({ username: object.username }, function (error, result) {
      if (error) {
        logger.error(error);
        utils.response(response, 'fail');
      } else {
        logger.debug('crud result');
        if (result != undefined) {
          object.notFound = false;
        } else {
          object.notFound = true;
        }
      }
      callback();
    });
  },
  sendLink1: function (UserEmail, Page, TokenType) {
    logger.debug('crud common sendLink');
    const config = require('../config');
    var RandomToken = utils.randomStringGenerate(32);
    var Query = {};
    var userData = {};
    if (TokenType === 'forgotPasswordToken') {
      Query['passwordTokenStamp'] = new Date();
      userData.type = 'forgotpassword';
    } else {
      userData.type = 'verificationlink';
    }
    Query[TokenType] = RandomToken;
    var Url =
      config.domain + '/#/' + Page + '?e=' + UserEmail + '&t=' + RandomToken;

    User.update(
      {
        userEmail: UserEmail,
      },
      {
        $set: Query,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          logger.debug('crud result');
          userData.email = UserEmail;
          userData.url = Url;

          utils.createMail(userData, userData.type);
        }
      }
    );
  },

  generateReferCode: function (request, response) {
    var code = 'ZIG' + utils.randomStringGenerate(3);
    logger.debug('crud common generateReferCode');
    User.update(
      {
        userId: request.userData.userId,
      },
      {
        $set: {
          ReferralCode: code,
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
  checkRefer: function (request, callback) {
    logger.debug('crud profile getUserById');

    User.findOne(
      {
        userId: request.userData.userId,
      },
      function (error, result) {
        if (error) {
          logger.debug(error);

          callback(error, null);
        } else {
          // callback(null, result);
          if (result.ReferralCode == null) {
            callback(null, null);
          } else {
            callback(null, result);
          }
        }
      }
    );
  },
  checkBanned: function (request, callback) {
    logger.debug('crud profile getUserById');

    User.findOne(
      {
        userId: request.body.userId,
        banned: true,
      },
      function (error, result) {
        if (error) {
          logger.debug(error);

          callback(error, null);
        } else {
          callback(null, result);
        }
      }
    );
  },
  // var Query = {

  bannUser: function (request, response) {
    User.update(
      {
        userId: request.body.userId,
      },
      {
        $set: { banned: true },
      },
      function (error, result) {
        if (error) {
          logger.error(error);
        } else {
          Session.find({ userId: request.body.userId }).remove(function (
            error,
            result
          ) {
            if (error) {
              logger.error(error);
              utils.response(response, 'fail');
            } else {
              logger.debug('crud result');
              utils.response(response, 'success', 'Successfully banned user');
            }
          });
        }
      }
    );
  },

  unbannUser: function (request, response) {
    User.update(
      {
        userId: request.body.userId,
      },
      {
        $set: { banned: false },
      },
      function (error, result) {
        if (error) {
          logger.error(error);
        } else {
          logger.debug('crud result' + result);
          utils.response(response, 'success', 'Successfully unbanned user');
        }
      }
    );
  },
  getbanneduser: function (request, response) {
    User.find({ banned: true }, function (error, result) {
      if (error) {
        logger.error(error, null);
      } else {
        logger.debug('crud result' + result);
        //callback(result);

        response.send(result);
      }
    });
  },

  loadUsers: function (request, response, userData) {
    logger.debug('crud productcrud loadProducts');

    var type = request.body.type || 'search';
    var filters = request.body.filters || {};
    var sortBy = request.body.sortBy || {};
    var limit = request.body.limit||20;
    var count = request.body.count || 0;
    var fields = request.body.fields || 'min';

    var Query = {};
    var SortQuery = { showPriority: -1 };
    // if (sortBy.type === 'postDate' && (sortBy.order === 1 || sortBy.order === -1)){
    //     SortQuery[sortBy.type] = sortBy.order;
    // }
    // if(sortBy.type === 'numberOfSells' && (sortBy.order === 1 || sortBy.order === -1)){
    //     SortQuery[sortBy.type] = sortBy.order;
    // }
    // if(sortBy.type === 'price' && (sortBy.order === 1 || sortBy.order === -1)){
    //     SortQuery[sortBy.type] = sortBy.order;
    // }
    if (userData && userData.role !== 'admin') {
      Query['verified'] = { $ne: false };
    }

    // if (userData && type === "bookmarkedBy" || type === 'likedBy') {
    //     Query[type] = userData.userEmail;
    // }
    else if (type === 'search') {
      request.body.hasFilters = false;
      Object.keys(filters).forEach(function (key) {
        //only checks whether atleast a single filter exists or not
        if (filters[key] != '') {
          request.body.hasFilters = true;
        }
      });

      if (request.body.hasFilters === true) {
        Object.keys(filters).forEach(function (key) {
          if (filters[key] && key === 'search') {
            var regex = { $regex: filters[key], $options: '$i' };
            Query['$or'] = [
              { userId: regex },
              { userEmail: regex },
              { username: regex },
            ];
          } else if (filters[key]) {
            filters[key] = filters[key];
            Query[key] = { $regex: filters[key], $options: '$i' };
          }
        });
      }
    }

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
    if (fields === 'max') {
      Fields = {
        userId: false,
        username: false,
      };
    } else if (
      fields === 'super' &&
      userData.userEmail &&
      userData.role === 'admin'
    ) {
      Fields = {};
    }
    console.log(Fields);
    User.find(Query, Fields)
      .sort(SortQuery)
      .skip(count)
      .limit(limit)
      .exec(function (error, result) {
        if (error) {
          logger.error(error);
        } else {
          logger.debug('crud result' + result);
          if (result.length < 1) {
            response.json({ message: 'none' });
          } else {
            var ten = result;
            console.log('hjnh', ten);
            response.send(ten);
          }
        }
      });
  },
  countUsers: function (request, response, userData) {
    logger.debug('crud productcrud loadProducts');

    var type = request.body.type || 'search';
    var filters = request.body.filters || {};
    var sortBy = request.body.sortBy || {};
    var limit = request.body.limit||20;
    var count = request.body.count || 0;
    var fields = request.body.fields || 'min';

    var Query = {};
    var SortQuery = { showPriority: -1 };
    // if (sortBy.type === 'postDate' && (sortBy.order === 1 || sortBy.order === -1)){
    //     SortQuery[sortBy.type] = sortBy.order;
    // }
    // if(sortBy.type === 'numberOfSells' && (sortBy.order === 1 || sortBy.order === -1)){
    //     SortQuery[sortBy.type] = sortBy.order;
    // }
    // if(sortBy.type === 'price' && (sortBy.order === 1 || sortBy.order === -1)){
    //     SortQuery[sortBy.type] = sortBy.order;
    // }
    if (userData && userData.role !== 'admin') {
      Query['verified'] = { $ne: false };
    }

    // if (userData && type === "bookmarkedBy" || type === 'likedBy') {
    //     Query[type] = userData.userEmail;
    // }
    else if (type === 'search') {
      request.body.hasFilters = false;
      Object.keys(filters).forEach(function (key) {
        //only checks whether atleast a single filter exists or not
        if (filters[key] != '') {
          request.body.hasFilters = true;
        }
      });

      if (request.body.hasFilters === true) {
        Object.keys(filters).forEach(function (key) {
          if (filters[key] && key === 'search') {
            var regex = { $regex: filters[key], $options: '$i' };
            Query['$or'] = [
              { userId: regex },
              { userEmail: regex },
              { username: regex },
            ];
          } else if (filters[key]) {
            filters[key] = filters[key];
            Query[key] = { $regex: filters[key], $options: '$i' };
          }
        });
      }
    }

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
    if (fields === 'max') {
      Fields = {
        userId: false,
        username: false,
      };
    } else if (
      fields === 'super' &&
      userData.userEmail &&
      userData.role === 'admin'
    ) {
      Fields = {};
    }
    console.log(Fields);
    User.find(Query, Fields)
      .sort(SortQuery)
      .skip(count)
      .limit(limit)
      .exec(function (error, result) {
        if (error) {
          logger.error(error);
        } else {
          logger.debug('crud result' + result);
          if (result.length < 1) {
            response.json({ message: 'none' });
          } else {
            var ten = result.length;
            console.log('hjnh', ten);
            response.json({ message: 'success', usersCount: ten });
          }
        }
      });
  },

  ///////////Email activation /////////////////////////
  ////////Checking token for activation
  checkToken: function (request, response) {
    logger.debug('crud common checkToken');
    var that = this;
    var activationObject = request;

    User.findOne(
      {
        $and: [
          {
            tempEmail: activationObject.e,
          },
          {
            emailActivationToken: activationObject.t,
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
          } else {
            that.activateEmail(activationObject.e, response);
          }
        }
      }
    );
  },

  //////////Activating email
  activateEmail: function (userEmail, response) {
    logger.debug('crud common activateEmail');
    User.update(
      {
        tempEmail: userEmail,
      },
      {
        $set: {
          emailVerified: true,
          emailActivationToken: undefined,
          userEmail: userEmail,
          tempEmail: undefined,
        },
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          logger.debug('crud result');
          response.send('Successfully Verified Email');
        }
      }
    );
  },

  //////////////////Social Signin//////////////////////////
  ///////////Check if user exists
  socialSignin: function (request, response, done) {
    logger.debug('crud common socialSignin');
    var that = this;
    var SocialObject = request.body;
    console.log('error', SocialObject.socialId, SocialObject.Email);

    User.findOne(
      {
        $or: [
          { userEmail: SocialObject.Email },
          { social: { $elemMatch: { sId: SocialObject.socialId } } },
        ],
      },
      function (error, result) {
        if (error) {
          console.log('error', error);
          logger.error(error);
          return done(null);
        } else {
          console.log('error1', result);

          logger.debug('crud result');
          if (result == null) {
            console.log('error2', 'undefine');

            that.socialRegister(request, response, done);
          } else {
            var sessionData = result;
            var responseObject = {
              //No use
              message: 'loggedIn',
              callback: done,
            };
            utils.fillSession(request, response, sessionData, responseObject);
          }
          // } else {
          //   that.socialRegister(request, response, done);
          //
          //   // return done(null);
        }
      }
    );
  },

  ////////Register new User
  socialRegister: function (request, response, done) {
    var that = this;
    logger.debug('crud common socialRegister');
    var SocialObject = request.body;
    var aPosition = SocialObject.Email.indexOf('@');
    var userName = SocialObject.Email.substring(0, aPosition + 1);
    userName = userName + SocialObject.Social;

    var UserData = {};
    UserData.userInfo = {};
    UserData.userEmail = SocialObject.Email;
    UserData.username = userName;
    UserData.password = 'social';
    UserData.role = config.defaultRole;
    UserData.registrationDate = new Date();
    UserData.userInfo.fullname = SocialObject.FullName;
    UserData.emailVerified = SocialObject.verified;
    UserData.userId = utils.randomStringGenerate(32);

    UserData.social = [];
    UserData.social[0] = {};
    UserData.social[0].connection = SocialObject.Social;
    UserData.social[0].sId = SocialObject.socialId;
    UserData.social[0].accessToken = SocialObject.accessToken;

    User.create(UserData, function (error, result) {
      console.log('user-create--->', error, response);

      if (error) {
        logger.error(error);
        return done(null);
      } else {
        logger.debug('crud result');
        if (!UserData.emailVerified) {
          that.sendLink(
            result.userEmail,
            'emailactivate',
            'emailActivationToken'
          );
        }
        var responseObject = {
          //No use
          message: 'registered',
          callback: done,
        };
        utils.fillSession(request, response, result, responseObject);
      }
    });
  },

  ////////////Send Activation/forgotpassword link//////////////
  sendLink: function (request, Page, TokenType) {
    logger.debug('crud common sendLink');
    const config = require('../config');
    var RandomToken = utils.randomStringGenerate(32);
    var Query = {};
    var userData = {};
    if (TokenType === 'forgotPasswordToken') {
      Query['passwordTokenStamp'] = new Date();
      userData.type = 'forgotpassword';
    } else {
      userData.type = 'verificationlink';
    }
    Query[TokenType] = RandomToken;
    var Url =
      'http://localhost:8080' +
      '/' +
      'activateEmail' +
      '?e=' +
      "rohancool3845@gmail.com" +
      '&t=' +
      RandomToken;

    // User.update(
    //   {
    //     userId: request.userData.userId,
    //   },
    //   {
    //     $set: {
    //       emailActivationToken: RandomToken,
    //       tempEmail: request.body.userEmail,
    //       emailVerified: false,
    //     },
    //   },
    //   function (error, result) {
    //     if (error) {
    //       logger.error(error);
    //       utils.response(response, 'fail');
    //     } else {
    //       logger.debug('crud result');
    //       console.log('rjjr', result);
    //       userData.email = request.body.userEmail;
    //       userData.url = Url;

          utils.createMail(userData, 'verificationlink');
    //     }
    //   }
    // );
  },

  checkProduct: function (userId, productId, variantId, callback) {
    logger.debug('crud commonoperations checkProduct');
    console.log('3');
    User.findOne(
      {
        userId: userId,
        cart: { $elemMatch: { productId: productId, variantId: variantId } },
      },
      function (error, result) {
        if (error) {
          logger.debug(error);

          callback(error, null);
        } else {
          callback(null, result);
        }
      }
    );
  },

  checkProduct1: function (userId, productId, variantId, callback) {
    logger.debug('crud commonoperations checkProduct');
    console.log('3');
    User.findOne(
      {
        userId: userId,
        buynow: { $elemMatch: { productId: productId, variantId: variantId } },
      },
      function (error, result) {
        if (error) {
          logger.debug(error);

          callback(error, null);
        } else {
          callback(null, result);
        }
      }
    );
  },

  addToCart: function (
    userId,
    productId,
    variantId,
    quantity,
    name,
    value,
    price,
    mrp,
    sku,
    productName,
    productImage,
    codAvailable,
    slug,
    callback
  ) {
    logger.debug('crud commonoperation addToCart');
    console.log('2');
    User.update(
      { userId: userId },
      {
        $push: {
          cart: {
            productId: productId,
            productName: productName,
            productImage: productImage,
            quantity: quantity,
            variantId: variantId,
            variant1: name,
            skucode: sku,
            slug:slug,
            price: price,
            mrp: mrp,
            variant2: value,
            codAvailable: codAvailable,
          },
        },
      },
      function (error, result) {
        if (error) {
          logger.debug(error);
          callback(error, null);
        } else {
          callback(null, result);
        }
      }
    );
  },
  addToBuyNow: function (
    userId,
    productId,
    variantId,
    quantity,
    name,
    value,
    price,
    mrp,
    skucode,
    productName,
    productImage,
    codavailable,
    slug,
    callback
  ) {
    logger.debug('crud commonoperation addToCart');
    console.log('2');
    User.update(
      { userId: userId },
      {
        $push: {
          buynow: {
            productId: productId,
            productName: productName,
            productImage: productImage,
            quantity: quantity,
            variantId: variantId,
            variant1: name,
            skucode: skucode,
            price: price,
            slug:slug,
            mrp: mrp,
            variant2: value,
            codAvailable: codavailable,
          },
        },
      },
      function (error, result) {
        if (error) {
          logger.debug(error);
          callback(error, null);
        } else {
          callback(null, result);
        }
      }
    );
  },

  increementCartItem: function (
    userdata,
    productId,
    variantId,
    quantity,
    callback
  ) {
    logger.debug('crud commonoperations increementCartItem');
    User.update(
      {
        userId: userdata.userId,
        cart: { $elemMatch: { productId: productId, variantId: variantId } },
      },
      { $inc: { 'cart.$.quantity': quantity } },
      function (error, result) {
        if (error) {
          logger.debug(error);
          callback(error, null);
        } else {
          callback(null, result);
        }
      }
    );
  },
  increementbuyNowItem: function (
    userdata,
    productId,
    variantId,
    quantity,
    callback
  ) {
    logger.debug('crud commonoperations increementCartItem');
    User.update(
      {
        userId: userdata.userId,
        buynow: { $elemMatch: { productId: productId, variantId: variantId } },
      },
      { $inc: { 'cart.$.quantity': quantity } },
      function (error, result) {
        if (error) {
          logger.debug(error);
          callback(error, null);
        } else {
          callback(null, result);
        }
      }
    );
  },

  ///////// Mobile Application only operations////////////

  getProfileData: function (id, userData, callback) {
    logger.debug('crud common getProfileData');
    const Session = require('../schemas/sessionschema');
    Session.findOne({ sessionId: id }, function (error, result) {
      if (error) {
        logger.error(error);
        utils.response(response, 'fail');
      } else {
        logger.debug('crud result');
        userData = result;
      }
      callback(userData);
    });
  },
};

module.exports = dbOperations;
