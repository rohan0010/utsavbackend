'use strict';

///Routing for forgotpassword factory only calls

const express = require('express');
const router = express.Router();
const utils = require('../config/utils');
const dbOperations = require('../config/crudoperations/forgotpassword');
const validate = require('../config/validate');
const logger = require('../config/logger');

//////Send Link
router.post('/sendLink', function (request, response) {
  logger.debug('routes forgotpass sendlink');
  if (request.body.email) {
    request.body.email = request.body.email.toLowerCase();
  }
  var forgotObject = request.body;
  var isValidUserEmail = validate.email(forgotObject.email);
  if (isValidUserEmail === true) {
    dbOperations.checkEmail(request, response);
  } else {
    utils.response(response, 'unknown');
  }
});

router.post('/sendOTP', function (request, response) {
  logger.debug('routes forgotpass sendOTP');
  // if(request.body.mobile){
  //     request.body.email=request.body.email.toLowerCase();
  // }
  var forgotObject = request.body;
  var isValidUserEmail = validate.mobile(forgotObject.mobile);
  if (isValidUserEmail === true) {
    request.body.mobile = '+91' + request.body.mobile;
    dbOperations.checkMobile(request, response);
  } else {
    utils.response(response, 'unknown');
  }
});

///////Check Token
router.post('/passwordReset', function (request, response) {
  logger.debug('routes forgotpass passwordReset');
  var passwordObject = request.body;
  var isValidUserEmail = validate.email(passwordObject.userEmail);
  var isValidToken = validate.string(passwordObject.token);
  var isValidPassword;
  if (passwordObject.newPassword != undefined) {
    isValidPassword = validate.password(passwordObject.newPassword);
    if (
      isValidUserEmail === true &&
      isValidToken === true &&
      isValidPassword === true
    ) {
      dbOperations.passwordReset(request, response);
    } else {
      utils.response(response, 'unknown');
    }
  } else if (isValidUserEmail === true && isValidToken === true) {
    dbOperations.passwordReset(request, response);
  } else {
    utils.response(response, 'unknown');
  }
});

router.post('/passwordResetMobile', function (request, response) {
  logger.debug('routes forgotpass passwordResetMobile');
  var passwordObject = request.body;
  var isValidMobile = validate.mobile(passwordObject.mobile);
  var isValidToken = validate.string(passwordObject.token);
  var isValidPassword;
  if (passwordObject.newPassword != undefined) {
    isValidPassword = validate.password(passwordObject.newPassword);
    if (
      isValidMobile === true &&
      isValidToken === true &&
      isValidPassword === true
    ) {
      request.body.mobile = '+91' + request.body.mobile;
      dbOperations.passwordResetMobile(request, response);
    } else {
      utils.response(response, 'unknown');
    }
  } else if (isValidMobile === true && isValidToken === true) {
    dbOperations.passwordResetMobile(request, response);
  } else {
    utils.response(response, 'unknown');
  }
});

module.exports = router;
