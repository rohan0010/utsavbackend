'use strict';

///Routing for admin dashboard factory only calls

const express = require('express');
const router = express.Router();

const productcrud = require('../config/crudoperations/productcrud');
const commonOperations = require('../config/crudoperations/commonoperations');
const dbOperations = require('../config/crudoperations/signup');
const profile = require('../config/crudoperations/profile');

const validate = require('../config/validate');
const logger = require('../config/logger');
const multer = require('multer');
const config = require('../config/config');
const utils = require('../config/utils');

////////Get Store Data
router.post('/getProductById', function (request, response) {
  productcrud.findProductById(request.body.productId, response);
});

router.post('/registerVendor', function (request, response) {
  logger.debug('routes signup signup');
  console.log('rj', request.userData.role);
  if (request.body.userEmail)
    request.body.userEmail = request.body.userEmail.toLowerCase();
  if (request.body.username)
    request.body.username = request.body.username.toLowerCase();
  if (request.body.referCode)
    request.body.referCode = request.body.referCode.toLowerCase();
  var userObject = request.body;
  console.log('gg', userObject.referCode);
  var isValidFirstName = true;
  var isValidLastName = true;
  var isValidReferCode = true;

  if (userObject.firstName) {
    isValidFirstName = validate.string(userObject.firstName);
  }

  if (userObject.lastName) {
    isValidLastName = validate.string(userObject.lastName);
  }
  var isValidUserEmail = validate.email(userObject.userEmail);
  var isValidUsername = true;
  var isValidPassword = validate.password(userObject.password);
  var isValidRole = request.userData.role;

  if (userObject.referCode) {
    validate.username(userObject.referCode);
  }

  if (
    (isValidUserEmail &&
      isValidFirstName &&
      isValidLastName &&
      isValidUsername &&
      isValidPassword &&
      isValidRole == 'superadmin') ||
    ('admin' &&
      isValidReferCode &&
      userObject.gstNumber &&
      userObject.panNumber &&
      userObject.companyName &&
      userObject.contactPerson)
  ) {
    dbOperations.checkUser(request, response);
  } else {
    utils.response(response, 'unknown');
  }
});
router.post('/registerAdmin', function (request, response) {
  logger.debug('routes signup signup');
  console.log('rj', request.userData.role);
  if (request.body.userEmail)
    request.body.userEmail = request.body.userEmail.toLowerCase();
  if (request.body.username)
    request.body.username = request.body.username.toLowerCase();
  if (request.body.referCode)
    request.body.referCode = request.body.referCode.toLowerCase();
  var userObject = request.body;
  console.log('gg', userObject.referCode);
  var isValidFirstName = true;
  var isValidLastName = true;
  var isValidReferCode = true;

  if (userObject.firstName) {
    isValidFirstName = validate.string(userObject.firstName);
  }

  if (userObject.lastName) {
    isValidLastName = validate.string(userObject.lastName);
  }
  var isValidUserEmail = validate.email(userObject.userEmail);
  var isValidUsername = true;
  var isValidPassword = validate.password(userObject.password);
  var isValidRole = request.userData.role;

  if (userObject.referCode) {
    validate.username(userObject.referCode);
  }

  if (
    isValidUserEmail &&
    isValidFirstName &&
    isValidLastName &&
    isValidUsername &&
    isValidPassword &&
    isValidRole == 'superadmin' &&
    isValidReferCode
  ) {
    dbOperations.checkUser(request, response);
  } else {
    utils.response(response, 'unknown');
  }
});
router.post('/updateProfileDataSuperadmin', function (request, response) {
  logger.debug('routes profile updateProfileData');

  var profileObject = request.body;
  var isValidFirstName = validate.name(profileObject.firstName);
  var isValidLastName = validate.name(profileObject.lastName);

  if (isValidFirstName && isValidLastName) {
    profile.updateProfileDataSuperadmin(request, response, request.body.userId);
  } else {
    utils.response(response, 'unknown');
  }
});
router.post('/updateProfileDataVendor', function (request, response) {
  logger.debug('routes profile updateProfileData');

  var profileObject = request.body;
  var isValidFirstName = validate.name(profileObject.firstName);
  var isValidLastName = validate.name(profileObject.lastName);

  if (isValidFirstName && isValidLastName) {
    profile.updateProfileDataSuperadmin(request, response, request.body.userId);
  } else {
    utils.response(response, 'unknown');
  }
});
router.post('/updateBankDetailsVendor', function (request, response) {
  logger.debug('routes profile updateBankDetails');

  profile.updateBankDetailsSuperadmin(request, response, request.body.userId);
});
router.post('/updateBankDetailsSuperadmin', function (request, response) {
  logger.debug('routes profile updateBankDetails');

  profile.updateBankDetailsSuperadmin(request, response, request.body.userId);
});
router.post('/setNewPasswordVendor', function (request, response) {
  logger.debug('routes profile setNewPassword');

  var passwordObject = request.body;

  var isValidNewPassword = validate.password(passwordObject.password);

  if (isValidNewPassword) {
    profile.setNewPasswordAdmin(request, response, request.body.userId);
  } else {
    utils.response(response, 'unknown');
  }
});
router.post('/setNewPasswordAdmin', function (request, response) {
  logger.debug('routes profile setNewPassword');

  var passwordObject = request.body;

  var isValidNewPassword = validate.password(passwordObject.password);

  if (isValidNewPassword) {
    profile.setNewPasswordAdmin(request, response, request.body.userId);
  } else {
    utils.response(response, 'unknown');
  }
});
router.post('/getProfileDataVendor', function (request, response) {
  logger.debug('routes profile updateProfilePic');

  profile.getProfileDataSuperadmin(request, response, request.body.userId);
});
router.post('/getProfileDataSuperadmin', function (request, response) {
  logger.debug('routes profile updateProfilePic');

  profile.getProfileDataSuperadmin(request, response, request.body.userId);
});
router.post('/registerusers', function (request, response) {
  logger.debug('routes signup signup');
  if (request.body.userEmail)
    request.body.userEmail = request.body.userEmail.toLowerCase();
  if (request.body.username)
    request.body.username = request.body.username.toLowerCase();
  if (request.body.referCode)
    request.body.referCode = request.body.referCode.toLowerCase();
  var userObject = request.body;
  console.log('gg', userObject.referCode);
  var isValidFirstName = true;
  var isValidLastName = true;
  var isValidReferCode = true;

  if (userObject.firstName) {
    isValidFirstName = validate.string(userObject.firstName);
  }

  if (userObject.lastName) {
    isValidLastName = validate.string(userObject.lastName);
  }
  var isValidUserEmail = validate.email(userObject.userEmail);
  var isValidUsername = true;
  var isValidPassword = validate.password(userObject.password);
  var isValidRole = request.userData.role;

  if (userObject.referCode) {
    validate.username(userObject.referCode);
  }

  if (
    isValidUserEmail &&
    isValidFirstName &&
    isValidLastName &&
    isValidUsername &&
    isValidPassword &&
    isValidRole == 'admin' &&
    isValidReferCode
  ) {
    dbOperations.checkUser(request, response);
  } else {
    utils.response(response, 'unknown');
  }
});
router.post('/getAllProducts', function (request, response) {
  productcrud.getAllProducts(request.body.productId, response);
});
router.post('/countAllProducts', function (request, response) {
  productcrud.countAllProducts(request.body.productId, response);
});
router.post('/getProductData', function (request, response) {
  logger.debug('routes admindash getProductData');

  const productcrud = require('../config/crudoperations/productcrud');
  var resObj = {};
  if (request.userData && request.userData.userId) {
    var userData = request.userData;
    productcrud.getProductData(request.body.productId, function (productData) {
      console.log('Ss', productData);
      if (productData) {
        if (request.userData.role === 'customer') {
          productData.ratings = undefined;
        }
        resObj.likes = productData.likedBy.length;
        resObj.isLiked = productData.likedBy.indexOf(userData.userEmail) !== -1;
        productData.likedBy = undefined;
        resObj.isBookmarked =
          productData.bookmarkedBy.indexOf(userData.userEmail) !== -1;
        productData.bookmarkedBy = undefined;

        resObj.product = productData;
      }
      response.send(resObj);
    });
  } else {
    productcrud.getProductData(request.body.productId, function (productData) {
      if (productData) {
        productData.ratings = undefined;

        productData.bookmarkedBy = undefined;
        resObj.likes = productData.likedBy.length;
        productData.likedBy = undefined;
        resObj.product = productData;
      }
      response.send(resObj);
    });
  }
});

////Post/Update product
router.post('/updateProduct', function (request, response) {
  logger.debug('routes admindash updateProduct');

  var productObj = request.body;
  var isValidTitle = true;
  var isValidSub = true;
  var isValidDescription = true;
  var isValidType = true;
  var isValidSubtype = true;
  var isValidSubtype2 = true;
  var isValidSlug = true;
  var isValidSeoTitle = validate.string(productObj.seoTitle);
  var isValidSeoDescription = true;
  // var isValidVariant = validate.string(productObj.variantType);
  var isValidTax =
    !isNaN(request.body.tax) && request.body.tax !== undefined ? true : false;

  var allValid = true;
  if (productObj && productObj.variants.length > 0) {
    productObj.variants.forEach((variant) => {
      if (!variant.id) {
        variant.variantId = utils.randomStringGenerate(8);
      }
      var isValidVariant = true;
      var isValidPrice =
        !isNaN(variant.price) && variant.price !== undefined ? true : false;
      var isValidStock =
        !isNaN(variant.stock) && variant.stock !== undefined ? true : false;
      var isValidMRP =
        !isNaN(variant.mrp) && variant.mrp !== undefined ? true : false;

      if (!isValidVariant || !isValidPrice || !isValidStock || !isValidMRP) {
        allValid = false;
      }
    });
  } else {
    allValid = false;
  }
  if (
    allValid &&
    isValidTax &&
    isValidTitle &&
    isValidSub &&
    isValidDescription &&
    isValidType &&
    isValidSubtype &&
    isValidSubtype2 &&
    isValidSlug &&
    isValidSeoTitle &&
    isValidSeoDescription
  ) {
    var userData = request.userData;
    var isValidProductId = validate.id(productObj.productId);
    productcrud.checkSlug(productObj.slug, (err, res) => {
      if (err) {
        utils.response(response, 'fail');
      } else if (
        res &&
        res.productId &&
        res.productId != productObj.productId
      ) {
        utils.response(response, 'unknown', 'Slug exists');
      } else {
        productcrud.getProductData(productObj.productId, (res2) => {
          if (res2) {
            if (
              isValidProductId &&
              res2 &&
              res2.productId === productObj.productId
            ) {
              productcrud.updateProduct(response, productObj, userData);
            }
          } else {
            productcrud.createProduct(response, productObj, userData);
          }
        });
      }
    });
  } else {
    response.json({ message: 'unknown' });
  }
});

////// activate product
router.post('/toggle', function (request, response) {
  if (
    request.body.productId &&
    (request.userData.role == 'admin' || request.userData.role == 'superadmin'|| request.userData.role == 'vendor')
  ) {
    productcrud.toggleActive(request.body.productId, (err, res) => {
      if (err) {
        utils.response(response, 'fail');
      } else {
        utils.response(response, 'success', res);
      }
    });
  }
});

//////Upload store images

var picStorage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './public/Product_pics');
  },
  filename: function (request, file, callback) {
    callback(null, request.productId + 'pic' + request.imgCount + '.jpeg');
  },
});

var uploadPic = multer({
  storage: picStorage,
  limits: { fileSize: 2000000 },
  fileFilter: function (request, file, cb) {
    if (file.mimetype != 'image/jpeg' && file.mimetype != 'image/png') {
      request.fileValidationError = true;
      return cb(null, false, new Error('Invalid file type'));
    }
    cb(null, true);
  },
}).single('file');

var callUpload2 = function (request, response) {
  request.imgCount = request.query.i;
  request.productId = request.query.pid;
  request.fileValidationError = false;
  try {
    uploadPic(request, response, function (error) {
      if (error) {
        console.log('ss', error);
        logger.error(error);
        response.json({ message: 'fail' });
      } else if (request.fileValidationError === true) {
        logger.error(
          'request.fileValidationError',
          request.fileValidationError
        );
        response.json({ message: 'fail' });
      } else {
        const secrets = require('../config/config');
        var imgUrl =
          '/ftp' +
          '/Product_pics/' +
          request.productId +
          'pic' +
          request.imgCount +
          '.jpeg';
        productcrud.getProductData(request.productId, function (productData) {
          if (productData.imageUrls == undefined) {
            var urlArray = [];
            urlArray.push(imgUrl);
            var Query = {
              imageUrls: urlArray,
            };
          } else {
            var urlArray = productData.imageUrls;
            urlArray[request.imgCount] = imgUrl;
            var Query = {
              imageUrls: urlArray,
            };
          }

          productcrud.updateProperty(request.productId, Query, function () {});
        });
        response.json({ message: 'success' });
      }
    });
  } catch (error) {
    logger.error(error);
  }
};

var callUpload3 = function (request, response) {
  request.imgCount = request.query.i;
  request.productId = request.query.pid;
  request.fileValidationError = false;
  productcrud.getProductData(request.productId, function (productData) {
    if (productData.imageUrls == undefined) {
      // var urlArray = [];
      // urlArray.push(imgUrl);
      // var Query = {
      //   imageUrls: urlArray,
      // };
    } else {
      var urlArray = productData.imageUrls;
      urlArray[request.imgCount] = null;
      var Query = {
        imageUrls: urlArray,
      };
    }
    productcrud.updateProperty(request.productId, Query, function () {});
  });
  response.json({ message: 'success' });
};
router.post('/deletepic', function (request, response) {
  logger.debug('routes admindash uploadpic');
  var isValidI = request.query.i >= 0 && request.query.i <= 5;
  var isValidProductId = validate.id(request.query.pid);
  if (isValidI && isValidProductId) {
    callUpload3(request, response);
  } else {
    response.json({ message: 'unknown' });
  }
});
router.post('/uploadpic', function (request, response) {
  logger.debug('routes admindash uploadpic');

  var isValidI = request.query.i >= 0 && request.query.i <= 10;
  var isValidProductId = validate.id(request.query.pid);

  if (isValidI && isValidProductId) {
    callUpload2(request, response);
  } else {
    response.json({ message: 'unknown' });
  }
});

router.post('/pushArray', function (request, response) {
  logger.debug('routes admindash pushArray');

  var array = request.body.theArray;
  var isArrayValid = false;
  var field = 'xxxxxxxx';
  var productId = request.body.productId;

  switch (request.body.field) {
    case 'specs':
      field = 'specs';
      if (array && array.length > 0 && array.length < 100) {
        var allProperty = {
          valid: true,
        };
        var validKey;
        for (var i = 0; i < array.length; i++) {
          Object.keys(array[i]).forEach(function (key) {
            switch (key) {
              // case 'productId': validKey = validate.randomId(array[i][key]); break;
              case 'name':
                validKey = validate.string(array[i][key]);
                break;
              case 'value':
                validKey = validate.string(array[i][key]);
                break;
              // case '_id': validKey = true; break;
            }
            if (validKey !== true) {
              allProperty.valid = false;
            }
          });
          if (allProperty.valid === false) {
            break;
          }
        }
        isArrayValid = allProperty.valid;
      }
      break;
    // case 'affiliations':
    //     field = 'affiliations';
    //     if (array && array.length > 0 && array.length < 20) {

    //         var allProperty = {
    //             valid: true
    //         };
    //         var validKey;
    //         for (var i = 0; i < array.length; i++) {
    //             Object.keys(array[i]).forEach(function (key) {
    //                 switch (key) {
    //                     case 'productId': validKey = validate.randomId(array[i][key]); break;
    //                     case 'website': validKey = validate.string(array[i][key]); break;
    //                     case 'link': validKey = validate.complexString(array[i][key]); break;
    //                     case 'affiliateId': validKey = validate.string(array[i][key]); break;
    //                     case 'price': validKey = !isNaN(array[i][key]); break;
    //                     case 'iconUrl': validKey = validate.complexString(array[i][key]); break;
    //                 }
    //                 if (validKey !== true) {
    //                     allProperty.valid = false;
    //                 }
    //             });
    //             if (allProperty.valid === false) {
    //                 break;
    //             }
    //         }
    //         isArrayValid = allProperty.valid;
    //     }
    //     break;
    // case 'moreInfo':
    //     var allProperty = { valid: true };
    //     if (array && array.length > 0 && array.length < 10) {
    //         var allInfoValid = false;
    //         for (var i = 0; i < array.length; i++) {
    //             allInfoValid = validate.string(array[i]);
    //             if (allInfoValid !== true) {
    //                 allProperty.valid = false;
    //                 break;
    //             }
    //         }
    //         isArrayValid = allProperty.valid;

    //     }
    //     break;
  }

  var productId = request.body.productId;

  if (isArrayValid) {
    var Query = {};
    Query[field] = array;
    Query['lastUpdatedBy'] = request.userData.userEmail;
    productcrud.updateProperty(productId, Query, function () {
      response.json({ message: 'success' });
    });
  } else {
    response.json({ message: 'unknown' });
  }
});

//////toggle verify
router.post('/toggleVerify', function (request, response) {
  logger.debug('routes admindash updateprop');

  var isValidBoolean;
  var isValidProductId = validate.id(request.body.productId);
  if (typeof request.body.verified === 'boolean') {
    var isValidBoolean = true;
  }

  if (isValidProductId && isValidBoolean) {
    var Query = {
      verified: request.body.verified,
      verifiedBy: request.userData.userEmail,
    };
    productcrud.updateProperty(request.body.productId, Query, function () {
      response.json({ message: 'success' });
    });
  } else {
    response.json({ message: 'unknown' });
  }
});
router.post('/banUser', function (request, response) {
  logger.debug('routes admindash updateprop');

  commonOperations.checkBanned(request, (err1, result1) => {
    if (err1) {
      utils.response(response, 'fail');
    } else if (result1 == undefined) {
      commonOperations.bannUser(request, response);
    } else {
      commonOperations.unbannUser(request, response);
    }
  });
});
router.post('/getbanneduser', function (request, response) {
  commonOperations.getbanneduser(request, response);
});

////Post update order
router.post('/updateOrder', function (request, response) {
  logger.debug('routes admindash updateOrder');
  let VALID_STATUS = ['ordered', 'shipped', 'delivered', 'cancelled'];
  var isValidStatus = VALID_STATUS.includes(request.body.status);
  var isValidId = validate.id(request.body.orderId);

  if (isValidId && isValidStatus) {
    console.log(request.userData);
    var userData = request.userData;
    changeStatus(request, response, userData);
  } else {
    console.log('1');
    response.json({ message: 'unknown' });
  }
});
router.post('/updateVendorOrder', function (request, response) {
  logger.debug('routes admindash updateOrder');
  let VALID_STATUS = ['ordered', 'delivered', 'received', 'cancelled'];
  var isValidStatus = VALID_STATUS.includes(request.body.status);
  var isValidId = validate.id(request.body.orderId);

  if (isValidId && isValidStatus) {
    console.log(request.userData);
    var userData = request.userData;
    changeStatus1(request, response, userData);
  } else {
    console.log('1');
    response.json({ message: 'unknown' });
  }
});
var changeStatus = (request, response, userData) => {
  console.log(userData);
  const orderOps = require('../config/crudoperations/orders');
  switch (request.body.status) {
    case 'shipped':
      if (userData.role === 'superadmin') {
        const profileOps = require('../config/crudoperations/profile');

        orderOps.updateStatus(
          { orderId: request.body.orderId, trackStatus: { $ne: 'cancelled' } },
          'shipped',
          (error, result) => {
            if (error) {
              logger.error(error);
              response.json({ message: 'fail' });
            } else {
              orderOps.getOrderById(request.body.orderId, (err1, result1) => {
                if (err1) {
                } else if (result1 == undefined) {
                } else {
                  profileOps.getUserById(result1.orderedBy, (err1, result2) => {
                    if (err1) {
                    } else if (result2 == undefined) {
                    } else {

                      
                     
                      const twilio = require("twilio");
                      var accountSid = "ACb0b9cc1b92409727583e3d354d405dad";
                      var authToken = "1f381d653784842882a0f096677f1ac4";
              
                      var client = new twilio.RestClient(accountSid, authToken);
                   let   text = 'Your Order '+result2.userInfo.firstName+" "+result2.userInfo.lastName +" OrderId: "+ request.body.orderId + ' has been shipped. \n';
                      
                   result1.products.forEach((prdt, index) => {
                    console.log(index);
                   
                    text =
                      text +
                      `Product ${index+1}: \n ProductTitle ${prdt.title}(${prdt.variant1.name}:${
                        prdt.variant1.value
                      }\n  Price:${prdt.price}\n Quantity ${prdt.quantity}\n`;
                    })
                    text =
          text +
          `Shipping Address: \n TO:${result1.address.firstName+" "+result1.address.lastName} \n AREA:${result1.address.area}\nCITY:${result1.address.city}\nSTATE:${result1.address.state}\n\n`;
        
        text = text + `Total Order Price is ${result1.grandTotal}`;
                 
        var user = {
          userId: result1.orderedBy,
          orderId: request.body.orderId,
          userEmail: result2.userEmail,
          text:text
        };
        // let text='Your Order '+request.body.orderId+ ' has been Shipped'
                      client.messages.create({
                          body: text,
                          to: result2.mobile,  // Text this number
                          from: "+1 201 817 4355", // From a valid Twilio number
                      }, function (error, message) {
                          if (error) {
                              logger.error(error);
                          }
                          else {
                              logger.info(message.sid);
                          }
                      });
                      utils.createMail(user, 'ShippedOrder');
                    }
                  });
                }
              });
              response.json({ message: 'success' });
            }
          }
        );
      } else {
        response.json({ message: 'unknown' });
      }
      break;

    case 'delivered':
      if (userData.role === 'superadmin') {
        const profileOps = require('../config/crudoperations/profile');

        orderOps.updateStatus(
          { orderId: request.body.orderId, trackStatus: { $ne: 'cancelled' } },
          'delivered',
          (error, result) => {
            if (error) {
              logger.error(error);
              response.json({ message: 'fail' });
            } else if (result && result.products) {
              for (var i = 0; i < result.products.length; i++) {
                var Query = {
                  numberOfSells: result.products[i].quantity,
                };
                productcrud.increementProperty(
                  result.products[i].productId,
                  Query,
                  (error, result) => {}
                );
              }
              orderOps.getOrderById(request.body.orderId, (err1, result1) => {
                if (err1) {
                } else if (result1 == undefined) {
                } else {
                  profileOps.getUserById(result1.orderedBy, (err1, result2) => {
                    if (err1) {
                    } else if (result2 == undefined) {
                    } else {
                      
                      const twilio = require("twilio");
                      var accountSid = "ACb0b9cc1b92409727583e3d354d405dad";
                      var authToken = "1f381d653784842882a0f096677f1ac4";
              
                      var client = new twilio.RestClient(accountSid, authToken);
                   let   text = 'Your Order '+result2.userInfo.firstName+" "+result2.userInfo.lastName +"OrderId: "+ request.body.orderId + ' has been delivered. \n';
                      
                   result1.products.forEach((prdt, index) => {
                    console.log(index);
                   
                    text =
                      text +
                      `Product ${index+1}: \n ProductTitle ${prdt.title}(${prdt.variant1.name}:${
                        prdt.variant1.value
                      }\n  Price:${prdt.price}\n Quantity ${prdt.quantity}\n`;
                    })
                    text =
          text +
          `Shipping Address: \n TO:${result1.address.firstName+" "+result1.address.lastName} \n AREA:${result1.address.area}\nCITY:${result1.address.city}\nSTATE:${result1.address.state}\n\n`;
         
        text = text + `Total Order Price is ${result1.grandTotal} \n`;
        text=text+`Download Invoice from https://api.alaromaleafs.com${result1.invoiceUrl}`
        var user = {
          text:text,
          userId: result1.orderedBy,
          orderId: request.body.orderId,
          userEmail: result2.userEmail,
          invoiceLink:"https://api.alaromaleafs.com"+result1.invoiceUrl
        }; 
        client.messages.create({
          body: text,
          to: result2.mobile,  // Text this number
          from: "+1 201 817 4355", // From a valid Twilio number
      }, function (error, message) {
          if (error) {
              logger.error(error);
          }
          else {
              logger.info(message.sid);
          }
      });
                      utils.createMail(user, 'DeliveredOrder');
                    }
                  });
                }
              });
              response.json({ message: 'success' });
            }
          }
        );
      } else {
        response.json({ message: 'unknown' });
      }
      break;
    case 'cancelled':
      var allow = false;
      if (userData.role === 'customer') {
        orderOps.getOrderById(request.body.orderId, (error, result) => {
          if (error) {
            logger.error(error);
          } else if (result && result.trackStatus === 'ordered') {
            cancel(request, response, userData);
          } else {
            response.json({ message: 'fail' });
          }
        });
      } else if (userData.role === 'superadmin') {
        cancel2(request, response);
      } else {
        response.json({ message: 'fail' });
      }
      break;
    default:
      response.json({ message: 'fail' });
  }
};
var changeStatus1 = (request, response, userData) => {
  console.log(userData);
  const orderOps = require('../config/crudoperations/orders');
  switch (request.body.status) {
    case 'ordered':
      if (userData.role === 'vendor') {
        const profileOps = require('../config/crudoperations/profile');

        orderOps.updateStatus1(
          {
            orderId: request.body.orderId,
            products: {
              $elemMatch: {
                productId: request.body.productId,
                variantId: request.body.variantId,
              },
            },
          },
          'ordered',
          (error, result) => {
            if (error) {
              logger.error(error);
              console.log('rohan', error);
              response.json({ message: 'fail' });
            } else {
              console.log('rohan', result);
              orderOps.getOrderById(request.body.orderId, (err1, result1) => {
                if (err1) {
                } else if (result1 == undefined) {
                } else {
                  profileOps.getUserById(result1.orderedBy, (err1, result2) => {
                    if (err1) {
                    } else if (result2 == undefined) {
                    } else {
                      var user = {
                        userId: result1.orderedBy,
                        orderId: request.body.orderId,
                        userEmail: result2.userEmail,
                      };
                      utils.createMail(user, 'ShippedOrder');
                    }
                  });
                }
              });
              response.json({ message: 'success' });
            }
          }
        );
      } else {
        response.json({ message: 'unknown' });
      }
      break;
    case 'delivered':
      if (userData.role === 'vendor') {
        const profileOps = require('../config/crudoperations/profile');

        orderOps.updateStatus1(
          {
            orderId: request.body.orderId,
            products: {
              $elemMatch: {
                productId: request.body.productId,
                variantId: request.body.variantId,
              },
            },
          },
          'delivered',
          (error, result) => {
            if (error) {
              logger.error(error);
              console.log('rohan', error);
              response.json({ message: 'fail' });
            } else {
              console.log('rohan', result);
              orderOps.getOrderById(request.body.orderId, (err1, result1) => {
                if (err1) {
                } else if (result1 == undefined) {
                } else {
                  profileOps.getUserById(result1.orderedBy, (err1, result2) => {
                    if (err1) {
                    } else if (result2 == undefined) {
                    } else {
                      var user = {
                        userId: result1.orderedBy,
                        orderId: request.body.orderId,
                        userEmail: result2.userEmail,
                      };
                      utils.createMail(user, 'ShippedOrder');
                    }
                  });
                }
              });
              response.json({ message: 'success' });
            }
          }
        );
      } else {
        response.json({ message: 'unknown' });
      }
      break;

    case 'received':
      if (userData.role === 'vendor') {
        orderOps.updateStatus1(
          {
            orderId: request.body.orderId,
            products: {
              $elemMatch: {
                productId: request.body.productId,
                variantId: request.body.variantId,
              },
            },
          },
          'received',
          (error, result) => {
            if (error) {
              logger.error(error);
              response.json({ message: 'fail' });
            } else if (result && result.products) {
              for (var i = 0; i < result.products.length; i++) {
                var Query = {
                  numberOfSells: result.products[i].quantity,
                };
                productcrud.increementProperty(
                  result.products[i].productId,
                  Query,
                  (error, result) => {}
                );
              }
              response.json({ message: 'success' });
            }
          }
        );
      } else {
        response.json({ message: 'unknown' });
      }
      break;
    case 'cancelled':
      var allow = false;
      if (userData.role === 'customer') {
        orderOps.getOrderById(request.body.orderId, (error, result) => {
          if (error) {
            logger.error(error);
          } else if (result && result.trackStatus === 'ordered') {
            cancel(request, response, userData);
          } else {
            response.json({ message: 'fail' });
          }
        });
      } else if (userData.role === 'vendor') {
        cancel22(request, response);
      } else {
        response.json({ message: 'fail' });
      }
      break;
    default:
      response.json({ message: 'fail' });
  }
};

var cancel = (request, response, userData) => {
  const orderOps = require('../config/crudoperations/orders');

  orderOps.updateStatus(
    {
      orderId: request.body.orderId,
      orderedBy: userData.userId,
      trackStatus: { $ne: 'delivered' },
    },
    'cancelled',
    (error, result) => {
      console.log(error, result);
      if (error) {
        logger.error(error);
        response.json({ message: 'fail' });
      } else if (result && result.products) {
        for (var i = 0; i < result.products.length; i++) {
          var Query = {
            numberOfSells: -result.products[i].quantity,
            'variants.$.stock': result.products[i].quantity,
          };
          productcrud.increementProperty2(
            result.products[i].productId,
            Query,
            (error, result) => {}
          );
        }
        response.json({ message: 'success' });
      }
    }
  );
};

var cancel2 = (request, response) => {
  const orderOps = require('../config/crudoperations/orders');

  orderOps.updateStatus(
    { orderId: request.body.orderId, trackStatus: { $ne: 'delivered' } },
    'cancelled',
    (error, result) => {
      if (error) {
        logger.error(error);
        response.json({ message: 'fail' });
      } else if (result && result.products) {
        for (var i = 0; i < result.products.length; i++) {
          var Query = {
            numberOfSells: -result.products[i].quantity,
            'variants.$.stock': result.products[i].quantity,
          };
          productcrud.increementProperty2(
            result.products[i].productId,
            Query,
            (error, result) => {}
          );
        }
        response.json({ message: 'success' });
      }
    }
  );
};
var cancel22 = (request, response) => {
  const orderOps = require('../config/crudoperations/orders');

  orderOps.updateStatus1(
    {
      orderId: request.body.orderId,
      products: {
        $elemMatch: {
          productId: request.body.productId,
          variantId: request.body.variantId,
        },
      },
    },
    'cancelled',
    (error, result) => {
      if (error) {
        logger.error(error);
        response.json({ message: 'fail' });
      } else if (result && result.products) {
        for (var i = 0; i < result.products.length; i++) {
          var Query = {
            numberOfSells: -result.products[i].quantity,
            'variants.$.stock': result.products[i].quantity,
          };
          productcrud.increementProperty2(
            result.products[i].productId,
            Query,
            (error, result) => {}
          );
        }
        response.json({ message: 'success' });
      }
    }
  );
};

///Post orderlist
router.post('/orders', function (request, response) {
  logger.debug('routes amindash/orders query');

  loadOrders(request, response);
});

router.post('/loadReturnRequestedOrders', function (request, response) {
  logger.debug('routes amindash/orders query');
  const orderOps = require('../config/crudoperations/orders');

  orderOps.loadpendingorders(request, response);
});
router.post('/changeReturnOrderStatus', function (request, response) {
  logger.debug('routes amindash/orders query');
  const orderOps = require('../config/crudoperations/orders');

  orderOps.changeReturnOrderStatus(request, response);
});

var loadOrders = (request, response) => {
  const orderOps = require('../config/crudoperations/orders');
  orderOps.loadQueryOrders(request, response, (error, results) => {
    if (error) {
      logger.debug('routes amindash/orders query error', error);

      response.json({ message: 'fail' });
    } else if (results && results.length == 0) {
      logger.debug('routes amindash/orders query noorders');

      response.json({ noorders: 'no orders yet' });
    } else if (results && results.length > 0) {
      logger.debug('routes amindash/orders query result');

      response.json(results);
    } else {
      resposne.json({ message: 'Error! Try again Later' });
    }
  });
};

router.post('/order', function (request, response) {
  logger.debug('routes amindash/orders query');

  loadOrderById(request.body.orderId, request, response);
});
var loadOrderById = (id, request, response) => {
  const orderOps = require('../config/crudoperations/orders');
  orderOps.getOrderById2(id, (error, results) => {
    if (error) {
      logger.debug('routes amindash/orders query error', error);

      response.json({ message: 'fail' });
    } else if (results) {
      logger.debug('routes amindash/orders query noorders');

      response.json(results);
    } else {
      response.json({ message: 'Error! Try again Later' });
    }
  });
};
router.post('/removeUser', function (request, response) {
  if (request.body.userId) {
    productcrud.deleteUser(request.body.userId, (error, result) => {
      if (error) {
        logger.error(error);
        utils.response(response, 'fail');
      } else {
        utils.response(response, 'success');
      }
    });
  } else {
    utils.response(response, 'unknown');
  }
});
router.post('/removeProduct', function (request, response) {
  var isValidId = validate.id(request.body.productId);
  // var isValidVariant = validate.id(request.body.variantId);

  if (isValidId) {
    productcrud.deleteProduct(request.body.productId, (error, result) => {
      if (error) {
        logger.error(error);
        utils.response(response, 'fail');
      } else {
        utils.response(response, 'success');
      }
    });
  } else {
    utils.response(response, 'unknown');
  }
});

router.post('/updateVariant', function (request, response) {
  var isValidId = validate.id(request.body.productId);
  if (request.body && request.body.variants.length > 0) {
    request.body.variants.forEach((variant) => {
      if (!variant.id) {
        variant.variantId = utils.randomStringGenerate(8);
      }
    });
  }
  var query = {
    variants: request.body.variants,
  };
  if (isValidId) {
    productcrud.updateProperty(
      request.body.productId,
      query,
      (error, result) => {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          utils.response(response, 'success');
        }
      }
    );
  } else {
    utils.response(response, 'unknown');
  }
});
router.post('/loadcategory', function (request, response) {
  productcrud.loadCategory(request.body, (error, result) => {
    if (error) {
      logger.error(error);
      utils.response(response, 'fail');
    } else {
      utils.response(response, 'success');
    }
  });
});
let students = [
  config.CATEGORIES[0],
  config.CATEGORIES[1],
  config.CATEGORIES[2],
];

// let students = [
//     {name: "Rahul", college: "DTU", year: "I"},
//     {name: "Neha", college: "NSIT", year: "II"},
//     {name: "Saksham", college: "JIIT", year: "III"},
//     {name: "Parul", college: "IIIT", year: "IV"}
// ]

router.post('/getcategories', (req, res) => res.send(students));

module.exports = router;
