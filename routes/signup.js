'use strict';

///Routing for register factory only calls

const express = require('express');
const router = express.Router();
const utils = require('../config/utils');
const dbOperations = require('../config/crudoperations/signup');
const validate = require('../config/validate');
const logger = require('../config/logger');

////User registration
router.post('/registerUser', function (request, response) {
  logger.debug('routes signup signup');
  // if (request.body.userEmail)
  //   request.body.userEmail = request.body.userEmail.toLowerCase();
  if (request.body.username)
    request.body.username = request.body.username.toLowerCase();

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
  var isValidUserEmail = true;
  var isValidUsername = true;
  var isValidPassword = validate.password(userObject.password);
  var isValidRole = validate.string(userObject.role);

  if (userObject.referCode) {
    validate.username(userObject.referCode);
  }

  if (
    isValidUserEmail &&
    isValidFirstName &&
    isValidLastName &&
    isValidUsername &&
    isValidPassword &&
    isValidRole &&
    isValidReferCode
  ) {
    dbOperations.checkUser2(request, response);
  } else {
    utils.response(response, 'unknown');
  }
});
router.post('/resendVerificationCode', function (request, response) {
  logger.debug('routes signup signup');
  // if (request.body.userEmail)
  //   request.body.userEmail = request.body.userEmail.toLowerCase();
  if (request.body.username)
    request.body.username = request.body.username.toLowerCase();

  
  if (
   request.body.username
  ) {
    dbOperations.sendVerificationCode2(
      request.body.mobile,
      request.body.username
    );
    utils.response(response, 'success', 'sent');
  } else {
    utils.response(response, 'unknown');
  }
});
module.exports = router;
