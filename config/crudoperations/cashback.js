'use strict';

const cashback = require("../schemas/cashbackschema");
const logger = require("../logger");
const utils = require("../utils");
const app = require("../..");
const { response } = require("express");
var slug = require('slug')
var slugify = require('slugify')
const dbOperations = {
    createCashback: function(request,response){
        cashback.create({cashbackId:"rpMYOm1N",cashbackPercentage:request.body.cashbackPercentage,cashbackAmount:request.body.cashbackAmount},function(error,result){
            if(error){
                logger.error(error);
                utils.response(response, "fail");
                // callback(null);
            }
            else{
                response.json({ message: "success" , success: true, code: 200 });

            }
        });
    },

    findCashback: function(cashbackId,callback){
        cashback.findOne({cashbackId:cashbackId},function(error,result){
            if(error){
                logger.error(error);
                callback(null);
            }
            else{
                if(result && result.cashbackId){
                    callback(result);
                }
                else{
                    callback(null);
                }   
            }
        });
    },
  
    updateProperty: function (cashbackId, Query, response) {
        logger.debug('crud productcrud updateProperty');

        cashback.update({
            "cashbackId": cashbackId
        }, {
                $set: Query
            },
            function (error, result) {
                if (error) {
                    logger.error(error);
                }
                else {
                    logger.debug('crud result' + result);
                    response.json({ message: "success" , success: true, code: 200 });
                }
            });
    },

}






module.exports = dbOperations;