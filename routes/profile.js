'use strict';

///Routing for profile factory only calls

const express = require('express');
const router = express.Router();
const utils = require('../config/utils');
const dbOperations = require('../config/crudoperations/profile');
const commonOperations = require('../config/crudoperations/commonoperations');
const validate = require('../config/validate');
const multer = require('multer');
const logger = require('../config/logger');

var picStorage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './public/User_data');
  },
  filename: function (request, file, callback) {
    callback(null, request.uploaderId + 'profile.jpeg');
  },
});

var uploadPic = multer({
  storage: picStorage,
  limits: { fileSize: 1000000 },
  fileFilter: function (request, file, cb) {
    if (file.mimetype != 'image/jpeg' && file.mimetype != 'image/png') {
      request.fileValidationError = true;
      return cb(null, false, new Error('Invalid file type'));
    }
    cb(null, true);
  },
}).single('file');

// serverside file validation{
// limits - object - Various limits on incoming data. Valid properties are:

// fieldNameSize - integer - Max field name size (in bytes) (Default: 100 bytes).

// fieldSize - integer - Max field value size (in bytes) (Default: 1MB).

// fields - integer - Max number of non-file fields (Default: Infinity).

// fileSize - integer - For multipart forms, the max file size (in bytes) (Default: Infinity).

// files - integer - For multipart forms, the max number of file fields (Default: Infinity).

// parts - integer - For multipart forms, the max number of parts (fields + files) (Default: Infinity).

// headerPairs - integer - For multipart forms, the max number of header key=>value pairs to parse Default: 2000 (same as node's http).

// }

var callUpload = function (request, response) {
  request.fileValidationError = false;

  try {
    uploadPic(request, response, function (error) {
      if (error) {
        logger.error(error);
        console.log('rjjj', error);
        utils.response(response, 'fail');
      } else if (request.fileValidationError === true) {
        logger.error(
          'request.fileValidationError',
          request.fileValidationError
        );
        utils.response(response, 'unknown');
      } else {
        console.log('hhhh', request.file.destination.substring(9));
        var imgUrl =
          '/ftp/' +
          request.file.destination.substring(9) +
          '/' +
          request.file.filename;

        dbOperations.updateProfileuploadPic(request, response, imgUrl);
      }
    });
  } catch (error) {
    logger.error(error);
    utils.response(response, 'fail');
  }
};

router.post('/uploadPic', function (request, response) {
  logger.debug('routes profile uploadPic');

  request.uploaderId = request.userData.userId;
  callUpload(request, response);
});

/////////////Change Username
router.post('/changeUsername', function (request, response) {
  logger.debug('routes profile changeUsername');

  if (request.body.username)
    request.body.username = request.body.username.toLowerCase();
  var isValidUsername = validate.username(request.body.username);

  if (isValidUsername) {
    dbOperations.changeUsername(request, response, request.userData);
  } else {
    utils.response(response, 'unknown');
  }
});

////////////Edit/Update profile data
router.post('/updateProfileData', function (request, response) {
  logger.debug('routes profile updateProfileData');

  var profileObject = request.body;
  var isValidFirstName = validate.name(profileObject.firstName);
  var isValidLastName = validate.name(profileObject.lastName);

  if (isValidFirstName && isValidLastName) {
    dbOperations.updateProfileData(request, response, request.userData);
  } else {
    utils.response(response, 'unknown');
  }
});

////////////Mobile no. verification
/////Send Code
router.post('/updateMobile', function (request, response) {
  logger.debug('routes profile updateMobile');

  var mobileObject = request.body;
  var isValidCountryCode = validate.code(mobileObject.countryCode);
  var isValidMobile = validate.mobile(mobileObject.mobileNumber);

  if (isValidCountryCode && isValidMobile) {
    dbOperations.sendVerificationCode(request, response, request.userData);
  } else {
    utils.response(response, 'unknown');
  }
});
router.post('/updateProfilePic', function (request, response) {
  logger.debug('routes profile updateProfilePic');

  dbOperations.updateProfilePic(request, response, request.userData);
});
router.post('/updateTime', function (request, response) {
  logger.debug('routes profile updateProfilePic');

  dbOperations.setTime(request, response, request.userData);
});
router.post('/getProfileData', function (request, response) {
  logger.debug('routes profile updateProfilePic');

  dbOperations.getProfileData(request, response, request.userData);
});
router.post('/addAddress', function (request, response) {
  logger.debug('routes profile updateProfilePic');
  request.body.addressId = utils.randomStringGenerate(8);
  dbOperations.addAddress(request, response);
});
router.post('/UpdateAddress', function (request, response) {
  if (request.body.addressId) {
    var userData = request.userData;

    dbOperations.updateAddress(request, response, userData);
  } else {
    response.json({ message: 'unknown' });
  }
});
router.post('/getAddressById', function (request, response) {
  if (request.body.addressId) {
    var userData = request.userData;

    dbOperations.getAddressById(request, response, userData);
  } else {
    response.json({ message: 'unknown' });
  }
});
router.post('/getAddress', function (request, response) {
  if (request.userData) {
    var userData = request.userData;

    dbOperations.getAddress(request, response, userData);
  } else {
    response.json({ message: 'unknown' });
  }
});
router.post('/removeAddress', function (request, response) {
  if (request.body.addressId) {
    var userData = request.userData;
    dbOperations.removeAddress(request, response, userData);
  } else {
    response.json({ message: 'unknown' });
  }
});
router.post('/updateBankDetails', function (request, response) {
  logger.debug('routes profile updateBankDetails');

  dbOperations.updateBankDetails(request, response, request.userData);
});

//////////////Verify Code
router.post('/verifyCode', function (request, response) {
  logger.debug('routes profile verifyCode');

  var codeObject = request.body;
  var isValidCode = validate.code(codeObject.code);

  if (isValidCode) {
    dbOperations.verifyCode(request, response, request.userData);
  } else {
    utils.response(response, 'unknown');
  }
});

//////////////Verify Code based on mobile
router.post('/verifyOTP', function (request, response) {
  logger.debug('routes profile verifyCode');

  var codeObject = request.body;
  // var userData = request.userData;
  var isValidCode = validate.code(codeObject.code);

  if (isValidCode) {
    dbOperations.verifyOTP(request, response, request.userData);
  } else {
    utils.response(response, 'unknown');
  }
});

//////////////Verify OTP based on mobile & session
router.post('/verifyOTP2', function (request, response) {
  logger.debug('routes profile verifyOTP2');

  var codeObject = request.body;
  var isValidCode = validate.code(codeObject.code);
  console.log(request.userData);
  if (isValidCode && request.userData && request.userData.userId) {
    dbOperations.verifyOTP2(request, response, request.userData);
  } else {
    utils.response(response, 'unknown');
  }
});

////////////Change Password
router.post('/setNewPassword', function (request, response) {
  logger.debug('routes profile setNewPassword');

  var passwordObject = request.body;
  var isValidOldPassword = validate.password(passwordObject.oldPassword);
  var isValidNewPassword = validate.password(passwordObject.password);
  console.log('rj', isValidNewPassword, isValidOldPassword);
  if (isValidOldPassword && isValidNewPassword) {
    dbOperations.checkPassword(request, response, request.userData);
  } else {
    utils.response(response, 'unknown');
  }
});

module.exports = router;
