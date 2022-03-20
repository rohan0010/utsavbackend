'use strict';

//Routing for login factory only calls

const express = require('express');
const router = express.Router();
const utils = require('../config/utils');
const dbOperations = require('../config/crudoperations/otp');
const dbOperation = require('../config/crudoperations/login');

const validate = require('../config/validate');
const logger = require('../config/logger');

///Logging in
router.post('/login', function (request, response) {
  logger.debug('routes login login');
  if (request.body.loginId) {
    request.body.loginId = request.body.loginId.toLowerCase();
  }
  var loginObject = request.body;
  var isValidUserEmail = validate.email(loginObject.loginId);
  var isValidUsername = true;
  var isValidMobile = validate.mobile(loginObject.loginId);
  var isValidPassword = validate.password(loginObject.loginPassword);
  if (
    (isValidUserEmail === true ||
      isValidUsername === true ||
      isValidMobile === true) &&
    isValidPassword === true &&
    (loginObject.rememberMe === true ||
      loginObject.rememberMe === false ||
      loginObject.rememberMe === undefined)
  ) {
    dbOperation.doLogin(request, response);
  } else {
    utils.response(response, 'unknown');
  }
});
router.post('/loginAdmin',function(request,response){
  logger.debug('routes login login');
  if(request.body.loginId){
      request.body.loginId=request.body.loginId.toLowerCase();
  }
  var loginObject=request.body;
  var isValidUserEmail=validate.email(loginObject.loginId);
  var isValidUsername=true;
  var isValidMobile=validate.mobile(loginObject.loginId);
  var isValidPassword=validate.password(loginObject.loginPassword);
  if((isValidUserEmail===true || isValidUsername===true || isValidMobile===true) && isValidPassword===true
  && (loginObject.rememberMe===true || loginObject.rememberMe===false || loginObject.rememberMe===undefined)){
      dbOperation.doLogin1(request,response);
  }
  else{
      utils.response(response,'unknown');
  }
});

router.post('/resendConfirmationOTP', function (request, response) {
  logger.debug('routes login resendConfirmationOTP');
  var isValidMobile = validate.mobile(request.body.mobile);
  if (isValidMobile) {
    dbOperations.reSendVerificationCode(request, response);
  } else {
    utils.response(response, 'unknown');
  }
});

router.post('/loginUsingOtp', function (request, response) {
  logger.debug('routes login loginUsingOtp');

  dbOperations.sendVerificationCode(request, response);
});
router.post('/verifyOtp', function (request, response) {
  dbOperations.verifyCode(request, response);
});
module.exports = router;
