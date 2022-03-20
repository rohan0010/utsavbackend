"use strict";

///Routing for register factory only calls

const express = require("express");
const router = express.Router();
const utils = require("../config/utils");
const dbOperations = require("../config/crudoperations/commonoperations");
const validate = require("../config/validate");
const logger = require("../config/logger");

////User registration
router.post("/generateReferralCode", function (request, response) {
  dbOperations.checkRefer(request, (err1, result1) => {
    if (err1) {
      utils.response(response, "fail");
    } else if (result1 == undefined) {
      dbOperations.generateReferCode(request, response);
   
    } else {
      utils.response(response, "fail", "Already Generated Referral Code");
      
    }
  });
});

module.exports = router;
