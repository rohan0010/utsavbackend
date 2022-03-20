"use strict";

///Routing for admin dashboard factory only calls

const express = require("express");
const router = express.Router();

const productcrud = require("../config/crudoperations/productcrud");
const bannercrud = require("../config/crudoperations/bannercrud");

const commonOperations = require("../config/crudoperations/commonoperations");
const validate = require("../config/validate");
const logger = require("../config/logger");
const multer = require("multer");
const config = require("../config/config");
const utils = require("../config/utils");
const banner = require("../config/schemas/bannerschema");

//////Upload store images

var picStorage = multer.diskStorage({
  destination: function(request, file, callback) {
    callback(null, "./public/Banner_Pics");
  },
  filename: function(request, file, callback) {
    callback(null,  "pic" + request.imgCount + ".jpeg");
  }
});

var uploadPic = multer({
  storage: picStorage,
  limits: { fileSize: 2000000 },
  fileFilter: function(request, file, cb) {
    if (file.mimetype != "image/jpeg" && file.mimetype != "image/png") {
      request.fileValidationError = true;
      return cb(null, false, new Error("Invalid file type"));
    }
    cb(null, true);
  }
}).single("file");

var callUpload2 = function(request, response) {
  console.log("riagan",request.query)
  request.imgCount = request.query.i;
  request.text=request.query.text;
  request.title=request.query.title;
  request.subtitle=request.query.subtitle;
  request.buttonText=request.query.buttonText;
  request.redirectionUrl=request.query.redirectionUrl;
  request.fileValidationError = false;
  try {
    uploadPic(request, response, function(error) {
      if (error) {
        console.log("ss",error)
        logger.error(error);
        response.json({ message: "fail" });
      } else if (request.fileValidationError === true) {
        logger.error(
          "request.fileValidationError",
          request.fileValidationError
        );
        response.json({ message: "fail" });
      } else {
        var imgUrl ="/ftp"+
          "/Banner_Pics/" +
          "pic" +
          request.imgCount +
          ".jpeg";
          bannercrud.findBanner("rpMYOm1N",(bannerData)=>{
            if(bannerData){
                var urlArray = bannerData.content;
                console.log("rohan",urlArray[request.imgCount])
                urlArray[request.imgCount]={
                  imageUrl:"",
                  text:"",
                  title:"",
                  subtitle:"",
                  buttonText:"",
                  redirectionUrl:""
                }
                urlArray[request.imgCount].imageUrl=imgUrl
                urlArray[request.imgCount].text=request.query.text
                urlArray[request.imgCount].title=request.query.title
                urlArray[request.imgCount].subtitle=request.query.subtitle

                urlArray[request.imgCount].buttonText=request.query.buttonText
                urlArray[request.imgCount].redirectionUrl=request.query.redirectionUrl
                // urlArray[request.imgCount] = imgUrl;
                var Query = {
                  content: urlArray,
                 
                };
                bannercrud.updateProperty("rpMYOm1N",Query,response)
              
            }
            else{
                bannercrud.createBanner(request,imgUrl,response)
            }  
        })
      }
    });
  } catch (error) {
    logger.error(error);
  }
};

router.post("/uploadpic", function(request, response) {
  logger.debug("routes admindash uploadpic");

  var isValidI = request.query.i >= 0 && request.query.i <= 4;

  if (isValidI ) {
  
   
    callUpload2(request, response);
  } else {
    response.json({ message: "unknown" });
  }
});

router.post("/loadBanner", function(request, response) {
  logger.debug("routes admindash loadBanner");

  
   
  bannercrud.loadBanner("rpMYOm1N", response);
 
});
router.post("/removeBanner", function(request, response) {
  logger.debug("routes admindash loadBanner");

  request.imgCount = request.query.i;

   
  bannercrud.findBanner("rpMYOm1N",(bannerData)=>{
    if(bannerData){
        // var urlArray = bannerData.imageUrls;
        // urlArray[request.imgCount] = null;
        // var Query = {
        //   imageUrls: urlArray,
         
        // };
        var urlArray = bannerData.content;
        console.log("rohan",urlArray[request.imgCount])
        urlArray.splice(request.imgCount,1)
        // urlArray[request.imgCount] = imgUrl;
        var Query = {
          content: urlArray,
         
        };
        bannercrud.updateProperty("rpMYOm1N",Query,response)
      
    }
    else{
      response.json({ message: "unknown" });
    }  
})

 
});
module.exports = router;
