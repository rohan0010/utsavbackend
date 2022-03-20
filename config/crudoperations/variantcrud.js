'use strict';

const variants = require("../schemas/variantschema");
const logger = require("../logger");
const utils = require("../utils");
const app = require("../..");
const { response } = require("express");

const dbOperations = {
   
   
    createVariant:function(obj,response) {
      
        var variant = {};
        variant.variantId = utils.randomStringGenerate(32);
      variant.variantName=obj.variantName
      variant.value=obj.value
      variant.categoryId=obj.categoryId
       
        variants.create(variant, function (error, result) {
            if (error) {
                logger.error(error);
               
                utils.response(response, "fail");
            }
            else {
                logger.debug('crud result' + result);
           
               
                response.json({   success: true,message: "success" , code: 200});
          
               
                         
                           
            }
        });
    },
    findVariant:function(obj,callback) {

       console.log("1")
       variants.findOne({variantName:obj.variantName},function(error,result){
        if(error){
            logger.error(error);
            callback(null);
        }
        else{
           
                callback(result);
            
        }
    });
    },
    updateVariant:function(obj,response) {
        var Query={
         "variantName": obj.variantName,
         "value":obj.value,
         "categoryId":obj.categoryId
        }
                                     variants.update({
                                         "variantId":obj.variantId,
                                     
                                     },
                                         {
                                             $set: Query
                                         }
                                         , function (error, result) {
                                             if (error) {
                                                 logger.error(error);
                                                 utils.response(response, "fail");
                                             }
                                             else {
                                              
                                                  
                                                 response.json({ message: "success" , success: true, code: 200 });
                                                 logger.debug('crud result' + result);
                                             }
                                         });   
          
                             
                          
       
     },
  
     deleteVariant: function (variantId,callback){
        logger.debug('crud role deleteRole');
        variants.findOne({
            variantId:variantId
        }).remove(function (error, result) {
            if (error) {
                logger.debug(error);
                callback(error,null);
            }
            else {
                logger.debug('crud result');
                callback(null,result);
            }
        });
    },
    findVariantbyId:function(request,response){
        variants.findOne({variantId:request.body.variantId},function(error,result){
            if(error){
                logger.error(error);
                utils.response(response, 'fail');
            }
            else{
               
                response.send({
                    result,
                     code: 200,
                     success: true
                 });
                
            }
        });
    },
    findAllVariants:function(request,response){
        var type = request.body.type || "search";
    var filters = request.body.filters || {};
    var fields = request.body.fields || "min";

    var Query = {};

    try {
      request.body.hasFilters = false;
      Object.keys(filters).forEach(function(key) {
        //only checks whether atleast a single filter exists or not
        if (filters[key] != "") {
          request.body.hasFilters = true;
        }
      });

      if (request.body.hasFilters === true) {
        Object.keys(filters).forEach(function(key) {
          if (filters[key]) {
            filters[key] = filters[key].replace(/ /g, "");
            Query[key] = { $regex: filters[key], $options: "$i" };
          }
        });
      }
    } catch (error) {
      logger.error(error);
    }

    var Fields = {
      _id: false
    };
    if (fields === "max") {
      Fields = {
        _id: false
      };
    } else if (
      fields === "super" &&
      userData &&
      config.higherOrderRoles.indexOf(userData.role) > -1
    ) {
      Fields = {};
    }
   
    console.log("query", Query);
    variants.find(Query).exec(function(error, result) {
      if (error) {
        logger.error(error);
      } else {
        logger.debug("crud result");
        if (result.length < 1) {
          response.json({ message: "Not found", code: 404, success: false });
        } else {
            response.send({
                            result,
                             code: 200,
                             success: true
                         });
                        
        //   response.json({ vouchers: { result }, code: 200, success: true });
        }
      }
    });
        // variants.find({},function(error,result){
        //     if(error){
        //         logger.error(error);
        //         utils.response(response, 'fail');
        //     }
        //     else{
               
        //         response.send({
        //             result,
        //              code: 200,
        //              success: true
        //          });
                
        //     }
        // });
    },
    countVariants:function(request,response){
        variants.find({},function(error,result){
            if(error){
                logger.error(error);
                utils.response(response, 'fail');
            }
            else{
               var count=result.length
                response.send({
                    count,
                     code: 200,
                     success: true
                 });
                
            }
        });
    },
  
            

            


}






module.exports = dbOperations;