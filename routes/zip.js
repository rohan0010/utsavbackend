"use strict";

///Routing for voucher factory only calls

const express = require("express");
const router = express.Router();

const productcrud = require("../config/crudoperations/productcrud");
const dbOperation = require("../config/crudoperations/voucher");
const validate = require("../config/validate");
const logger = require("../config/logger");
const utils = require("../config/utils");
const multer = require("multer");
const config = require("../config/config");



router.post("/createZip", function(request, response) {

  for(var i=0; i<request.body.pincode.length;i++){
    productcrud.addproducttopincode(request.body.pincode[i],request.body.productId,response)
 } 
 response.json({message:"success"})
});


router.post("/removeZip", function(request, response) {

    for(var i=0; i<request.body.pincode.length;i++){
        productcrud.removepincode(request.body.pincode[i],request.body.productId,response)
     }      
     response.json({message:"success"})

});

router.post("/findZip", function(request, response) {

   
        productcrud.findzip(request.body.zipcode,response)
   

});
router.post("/findZipOnSpecificProduct", function(request, response) {

   
    productcrud.findZipOnSpecificProduct(request,response)


});

module.exports = router;
