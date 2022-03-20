'use strict';

const banner = require("../schemas/bannerschema");
const logger = require("../logger");
const utils = require("../utils");
const app = require("../..");
const { response } = require("express");
var slug = require('slug')
var slugify = require('slugify')
const dbOperations = {
    createBanner: function(request,image,response){
        banner.create({bannerId:"rpMYOm1N",content:[{
            "imageUrl":image,
            "text":request.text,
            "title":request.title,
            "subtitle":request.subtitle,
            "buttonText":request.buttonText,
            "redirectionUrl":request.redirectionUrl
        }]},function(error,result){
            if(error){
                logger.error(error);
                callback(null);
            }
            else{
                response.json({ message: "success" , success: true, code: 200 });

            }
        });
    },

    findBanner: function(bannerId,callback){
        banner.findOne({bannerId:bannerId},function(error,result){
            if(error){
                logger.error(error);
                callback(null);
            }
            else{
                if(result && result.bannerId){
                    callback(result);
                }
                else{
                    callback(null);
                }   
            }
        });
    },
    loadBanner: function(bannerId,response){
        banner.findOne({bannerId:bannerId},function(error,result){
            if(error){
                logger.error(error);
                callback(null);
            }
            else{
                if(result && result.bannerId){
                    // callback(result);
                    let content=result.content
                    response.send({
                        content,
                         code: 200,
                         success: true
                     });
                }
                else{
                    response.json({code: 422, success: false, message: "no banner added" }); 

                    // callback(null);
                }   
            }
        });
    },
    updateProperty: function (bannerId, Query, response) {
        logger.debug('crud productcrud updateProperty');

        banner.update({
            "bannerId": bannerId
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