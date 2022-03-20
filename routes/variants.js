const express = require('express');
const router = express.Router();
const utils = require("../config/utils");
const dbOperations = require("../config/crudoperations/variantcrud");
const validate = require("../config/validate");
const logger = require("../config/logger");
const async = require("async");
const variants = require('../config/schemas/variantschema');

router.post('/createVariant', function (request, response) {
    
      
    
        var Obj = request.body;
  
   
      dbOperations.findVariant(Obj, res2 => {
        console.log("dd",res2)
          if (
            res2!=null
          ) {
            
            response.json({ code: 422, success: false, message: "variant-type-already-exists" });
          }
         else {
         
            dbOperations.createVariant(Obj,response)
        }
      });
     
   




});

router.post("/removeVariant", function(request, response) {
  var isValidId = validate.id(request.body.variantId);


  if (isValidId) {
    dbOperations.deleteVariant(request.body.variantId, (error, result) => {
      if (error) {
        logger.error(error);
        utils.response(response, "fail");
      } else {
        utils.response(response, "success");
      }
    });
  } else {
    utils.response(response, "unknown");
  }
});
router.post('/findVariantbyId',function(request,response){

  dbOperations.findVariantbyId(request,response)
    
          

 
            
})
router.post('/findAllVariants',function(request,response){

  dbOperations.findAllVariants(request,response)
    
          

 
            
})
router.post('/countVariants',function(request,response){

  dbOperations.countVariants(request,response)
    
          

 
            
})
router.post('/updateVariant', function (request, response) {
    
      
    
  var Obj = request.body;

   
      dbOperations.updateVariant(Obj,response)


});

module.exports = router;



