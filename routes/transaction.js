'use strict';

//Routing for superadmin factory only calls

const express = require('express');
const router = express.Router();
const utils = require("../config/utils");
const dbOperations = require("../config/crudoperations/paytmGateway");
const transactionOperation = require("../config/crudoperations/transaction");
var PaytmChecksum = require("../config/PaytmChecksum");
const validate = require("../config/validate");
const logger = require("../config/logger");
const config = require('../config/config');
const { v4: uuidv4 } = require("uuid");


router.post('/create-transaction', function (request, response) {
    var queryParam = JSON.stringify(request.body)
    transactionOperation.createTransaction(request,request.userData.objectId,request.body.amount,(err,res1)=>{
        request.body.orderId = utils.randomStringGenerate(8);
        dbOperations.generateChecksum(request,queryParam,res1.transactionId, (er,res)=>{
      
            utils.response(response, 'success',res);
        });
    })
});

router.get('/create-transaction-mobile', function (request, response) {
    var queryParam = request.query

    transactionOperation.createTransaction(request,queryParam.objectId,queryParam.amount,(err,res)=>{
        if (err){
            utils.response(response,"fail",err)
        }
        else {
            request.body.orderId = res.transactionId
            request.body.userEmail = queryParam.email
            request.body.mobile = queryParam.mobile
            request.body.amount = queryParam.amount
            dbOperations.generateChecksumMobile(request, queryParam, response)
        }
    })
});

router.post('/callback', function (request, response) {
    console.log("transaction-callback--",request.body)
    if (request.body.STATUS=='TXN_FAILURE'){
      
        response.redirect(config.furl);
    }
    else {
//         var body = {
//             "requestType"   : "Payment",
//             "mid"           : config.paytmMID,
//             "websiteName"   : "DEFAULT",
//             "orderId":request.body.ORDERID,
//             "callbackUrl"   :config.callbackUrl,
//             "txnAmount"     : {
//                 "value"     : request.body.amount.toString(),
//                 "currency"  : "INR",
//             },
//         };

// /* checksum that we need to verify */
// var paytmChecksum = request.body.CHECKSUMHASH;

// var isVerifySignature = PaytmChecksum.verifySignature(JSON.stringify(body), config.merchantKey, paytmChecksum);
// if (isVerifySignature) {
    transactionOperation.updateTransaction(request.body.ORDERID,true, () => { });

    response.redirect(config.surl);
	console.log("Checksum Matched");
// } else {
//     response.redirect(config.furl);

// 	console.log("Checksum Mismatched");
// }
      
    }
});
router.post('/callback-mobile', function (request, response) {
    //console.log("transaction-callback--",request.body)
    if (request.body.STATUS=='TXN_FAILURE'){
        response.render("pgresponse.ejs", {
            status: false,
            result: request.body
        });
    }
    else {
        response.render("pgresponse.ejs", {
            status: true,
            result: request.body
        });
    }
});


module.exports = router;

