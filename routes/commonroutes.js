"use strict";

///Routing for shared calls

const express = require("express");
const router = express.Router();
const utils = require("../config/utils");
const dbOperations = require("../config/crudoperations/commonoperations");
const uploadController = require("../config/crudoperations/upload");
const nodeMailer = require("nodemailer");

const validate = require("../config/validate");
const logger = require("../config/logger");
 
router.post('/upload', function(request,response){
  console.log("rohjha",request.files)
  uploadController.uploadImage(request,response)
})
router.post('/mail',function(request,response){
  let req=request
  var f=req.body;
  console.log("rj",f)
       var transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'utsavplastotech@gmail.com',
          pass: 'aayansh@2020'
        },tls:{
          rejectUnauthorized: false
      }
      });
       // setup e-mail data with unicode symbols
       var mailOptions = {
           from: 'utsavplastotech@gmail.com', // sender address
           to: [f.To,'utsavplastotech@gmail.com'], // list of receivers
           subject: f.subject, // Subject line
           text: f.text, // plaintext body
           cc:f.cc,
           html: f.html // html body
       };
     console.log("rohan",mailOptions)
       // send mail with defined transport object
       transporter.sendMail(mailOptions, function (error, info) {
           if (error) {
               console.log(error);
           }
           if (info != undefined) {
             console.log('Message sent: ' + info.response);
             utils.response(response, "success");
           } else {
            utils.response(response, "fail");

               console.log("error sending mail");
             
           }
       });
})
////////////Activate Email
router.post("/activateEmail", function(request, response) {
  logger.debug("routes common activateemail");
  var activationObject = request.body;
  var isValidUserEmail = validate.email(activationObject.userEmail);
  var isValidToken = validate.string(activationObject.token);
  if (isValidUserEmail === true && isValidToken === true) {
    dbOperations.checkToken(request, response);
  } else {
    utils.response(response, "unknown");
  }
});

////////////CheckUsername if already exists
router.post("/checkUsername", function(request, response) {
  logger.debug("routes common checkUsername");
  if (request.body.username) {
    request.body.username = request.body.username.toLowerCase();
  }

  var usernameObj = request.body;
  usernameObj.notFound = undefined;
  dbOperations.checkUsername(usernameObj, function() {
    if (usernameObj.notFound == true) {
      utils.response(response, "notFound", "not found");
    } else {
      utils.response(response, "success", "found");
    }
  });
});

////////////////Get required products

router.post("/loadProducts", function(request, response) {
  const productcrud = require("../config/crudoperations/productcrud");
  logger.debug("routes common loadProducts");
  if (request.body.type === "search" && !request.userData) {
    var userData = {};
    productcrud.loadProducts(request, response, userData);
  } else {
    var userData = request.userData;
    productcrud.loadProducts(request, response, userData);
  }
});

router.post("/countProducts", function(request, response) {
  const productcrud = require("../config/crudoperations/productcrud");
  logger.debug("routes common countProducts");
  if (request.body.type === "search" && !request.userData) {
    var userData = {};
    productcrud.countProducts(request, response, userData);
  } else {
    var userData = request.userData;
    productcrud.countProducts(request, response, userData);
  }
});
router.post("/similarProducts", function(request, response) {
  const productcrud = require("../config/crudoperations/productcrud");
  logger.debug("routes common countProducts");
  if (request.body.type === "search" && !request.userData) {
    var userData = {};
    productcrud.countProducts1(request, response, userData);
  } else {
    var userData = request.userData;
    productcrud.countProducts1(request, response, userData);
  }
});
router.post("/loadUsers", function(request, response) {
  const productcrud = require("../config/crudoperations/productcrud");
  logger.debug("routes common loadProducts");
  if (request.body.type === "search" && !request.userData) {
    var userData = {};
    // productcrud.loadProducts(request, response, userData);
    dbOperations.loadUsers(request, response, userData);
  } else {
    var userData = request.userData;
    dbOperations.loadUsers(request, response, userData);
  }
});
router.post("/countUsers", function(request, response) {
  const productcrud = require("../config/crudoperations/productcrud");
  logger.debug("routes common loadProducts");
  if (request.body.type === "search" && !request.userData) {
    var userData = {};
    // productcrud.loadProducts(request, response, userData);
    dbOperations.countUsers(request, response, userData);
  } else {
    var userData = request.userData;
    dbOperations.countUsers(request, response, userData);
  }
});
router.post("/getProductbyslug", function(request, response) {
  logger.debug("routes admindash getProductData");

  const productcrud = require("../config/crudoperations/productcrud");
  var resObj = {};
  if (request.userData && request.userData.userId) {
    var userData = request.userData;
    productcrud.loadproductsbyslug(request.body.slug, function(productData) {
      if (productData) {
        if (request.userData.role === "customer") {
          productData.ratings = undefined;
          productData.verifiedBy = undefined;
          productData.showPriority = undefined;
        }
        resObj.likes = productData.likedBy.length;
        resObj.isLiked = productData.likedBy.indexOf(userData.userEmail) !== -1;
        productData.likedBy = undefined;
        resObj.isBookmarked =
          productData.bookmarkedBy.indexOf(userData.userEmail) !== -1;
        productData.bookmarkedBy = undefined;

        resObj.product = productData;
      }
      response.send(resObj);
    });
  } else {
    productcrud.loadproductsbyslug(request.body.slug, function(productData) {
      if (productData) {
        productData.ratings = undefined;
        productData.verifiedBy = undefined;
        productData.showPriority = undefined;
        productData.bookmarkedBy = undefined;
        resObj.likes = productData.likedBy.length;
        productData.likedBy = undefined;
        resObj.product = productData;
      }
      response.send(resObj);
    });
  }
});

// router.post('/loadOrders', function (request, response) {
//     const ordercrud = require('../config/crudoperations/orders');
//     logger.debug('routes common loadOrders');
//     if (request.body.type === "search" && !request.userData) {
//         var userData = {};
//         ordercrud.loadOrders(request, response, userData);
//     }
//     else {

//             var userData = request.userData;
//             ordercrud.loadOrders(request, response, userData);
//         }

// });

module.exports = router;
