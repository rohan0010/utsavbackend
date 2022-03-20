"use strict";

///Routing for voucher factory only calls

const express = require("express");
const router = express.Router();

const productcrud = require("../config/crudoperations/productcrud");
const dbOperation = require("../config/crudoperations/influencer");
const validate = require("../config/validate");
const logger = require("../config/logger");
const utils = require("../config/utils");
const multer = require("multer");
const config = require("../config/config");

var createVoucher = function(voucher, response) {
  dbOperation.checkVoucher(voucher.voucherId, (error, result) => {
    if (error) {
      response.json({ message: "fail" });
    } else if (result == undefined) {
      dbOperation.create(voucher, (error1, result1) => {
        if (error1) {
         console.log("ejj",error1)
          response.json({ message: "fail" });
        } else {
          response.json({ message: "success" });
        }
      });
    } else {
      response.json({ message: "voucher exist" });
    }
  });
};

router.post("/createVoucher", function(request, response) {
  logger.debug("routes voucher createVoucher");

  var voucher = request.body;

  var isValidDiscount = !isNaN(voucher.discount);
  var isValidExpiry = typeof voucher.expired == "boolean";
  voucher.influencerId = voucher.influencerId.toLowerCase();
  voucher.voucherDate=voucher.voucherDate
  voucher.expiryDate=voucher.expiryDate
  var isValidVoucher = true;
 console.log("jdjd",isValidDiscount,isValidExpiry,isValidVoucher)
  if (isValidDiscount && isValidExpiry && isValidVoucher) {
    // var userData = request.userData;
    console.log("jdjd",isValidDiscount,isValidExpiry,isValidVoucher)

    createVoucher(voucher, response);
  } else {
    response.json({ message: "unknown" });
  }
});

var updateVoucher = function(voucher, response) {
  dbOperation.update(voucher, (error, result) => {
    if (error) {
      response.json({ message: "fail" });
    } else if (result != undefined) {
      response.json({ message: "success" });
    } else {
      response.json({ message: "voucher not found" });
    }
  });
};

router.post("/update", function(request, response) {
  logger.debug("routes voucher update");

  var voucher = request.body;
  var isValidDiscount =
    !isNaN(voucher.discount) && voucher.discount > 0 && voucher.discount < 100;
  var isValidExpiry = typeof voucher.expired == "boolean";
  voucher.influencerId = voucher.influencerId.toLowerCase();
  voucher.voucherDate=voucher.voucherDate
  voucher.expiryDate=voucher.expiryDate
  var isValidVoucher = true;
  if (isValidDiscount && isValidExpiry && isValidVoucher) {
    var userData = request.userData;
    updateVoucher(voucher, response);
  } else {
    response.json({ message: "unknown" });
  }
});

//////Load vouchers

router.post("/loadVoucher", function(request, response) {
  var commonOpertion = require("../config/crudoperations/commonoperations");
  logger.debug("routes voucher loadVoucher");
  if (request.body.type === "search" && !request.userData) {
    var userData = {};
    dbOperation.loadVouchers(request, response, userData);
  } else {
    var userData = request.userData;
    dbOperation.loadVouchers(request, response, userData);
  }
});

router.post("/countVoucher", function(request, response) {
  var commonOpertion = require("../config/crudoperations/commonoperations");
  logger.debug("routes voucher loadVoucher");
  if (request.body.type === "search" && !request.userData) {
    var userData = {};
    dbOperation.countVouchers(request, response, userData);
  } else {
    var userData = request.userData;
    dbOperation.countVouchers(request, response, userData);
  }
});

router.post("/validateVoucher", function(request, response) {
  logger.debug("routes voucher validateVoucher");
  request.body.influencerId = request.body.influencerId.toLowerCase();
  var isValidVoucher = true;

  if (isValidVoucher) {
    console.log(isValidVoucher);
    dbOperation.checkVoucher(request.body.influencerId, (error, result) => {
      if (error) {
        response.json({ message: "fail" });
      } else if (result != undefined && result.expired) {
        response.json({ message: "expired" });
      } else if (result) {
        response.send(result);
      } else {
        response.json({ message: "not-found" });
      }
    });
  } else {
    response.json({ message: "not-found" });
  }
});
router.post("/removeVoucher", function(request, response) {
  var isValidId = validate.id(request.body.voucherId);
  request.body.influencerId = request.body.influencerId.toLowerCase();
  var isValidVoucher = true;

  if (isValidVoucher) {
    console.log(isValidVoucher);
    dbOperation.deleteVoucher(request.body.influencerId, (error, result) => {
      if (error) {
        response.json({ message: "fail" });
      } else if (result != undefined && result.expired) {
        response.json({ message: "expired" });
      } else if (result) {
        response.json({ message: "success" });
    } else {
        response.json({ message: "not-found" });
      }
    });
  } else {
    response.json({ message: "not-found" });
  }
 
});

module.exports = router;
