"use strict";

///Routing for voucher factory only calls

const express = require("express");
const router = express.Router();

const dbOperation = require("../config/crudoperations/cashback");
const validate = require("../config/validate");
const logger = require("../config/logger");
const utils = require("../config/utils");
const multer = require("multer");
const config = require("../config/config");



router.post("/createCashback", function(request, response) {
  logger.debug("routes voucher createVoucher");

  dbOperation.findCashback("rpMYOm1N",(cashbackData)=>{
    if(cashbackData){
         var Query={
             cashbackPercentage:request.body.cashbackPercentage,
             cashbackAmount:request.body.cashbackAmount
         }
        dbOperation.updateProperty("rpMYOm1N",Query,response)
      
    }
    else{
        dbOperation.createCashback(request,response)
    }  
})
});

router.post("/loadCashback", function(request, response) {
    logger.debug("routes voucher createVoucher");
  
    dbOperation.findCashback("rpMYOm1N",(cashbackData)=>{
      if(cashbackData){
        response.json({ message: "success", 'data':cashbackData });

        
      }
      else{
        response.json({ message: "fail" });

      }  
  })
  });
  








module.exports = router;
