'use strict';

//Routing for userdash factory only calls

const express = require('express');
const router = express.Router();
const commonOps = require("../config/crudoperations/commonoperations")
const productcrud = require("../config/crudoperations/productcrud");
const User = require('../config/crudoperations/profile');
const orderOps = require('../config/crudoperations/orders');
const validate = require("../config/validate");
const logger = require("../config/logger");
const utils = require("../config/utils");
const cashbackOps = require("../config/crudoperations/cashback");
const transaction = require("../config/crudoperations/transaction");

const { text } = require('body-parser');
const cashback = require('../config/schemas/cashbackschema');
var pdf = require('html-pdf');

////////Add to Cart

router.post('/addToCart', function (request, response) {
    logger.debug('routes userdashboard Cart');

    var isValidQuantity = !isNaN(request.body.quantity);

    if (isValidQuantity) {


        var isValidId = validate.id(request.body.productId);
        var isValidVariant = true;

        if (isValidId && isValidVariant) {
          console.log("1")
            var userData = request.userData;
            productcrud.findProduct(request, (error, result) => {

                if (error) {


                    utils.response(response, 'fail');
                }

                else if (result != undefined) {

                    commonOps.checkProduct(userData.userId, result.productId, request.body.variantId, (err1, result1) => {
                        console.log("Ss",result1)
                        if (err1) {
                           console.log("ss",err1)
                            utils.response(response, 'fail');
                        }
                        else if (result1 == undefined) {
                            console.log("ss",result1)
                            commonOps.addToCart(userData.userId, result.productId, request.body.variantId, request.body.quantity,request.body.variant1,request.body.variant2,request.body.price,request.body.mrp,request.body.skucode,request.body.productName,request.body.productImage,request.body.codAvailable,request.body.slug, (err1, result1) => {
                                if (err1) {


                                    utils.response(response, 'fail');
                                }
                                else {

                                    utils.response(response, 'success');
                                }
                            });
                        }
                        else {

                            commonOps.increementCartItem(result1, result.productId, request.body.variantId, request.body.quantity, (err1, result1) => {
                                if (err1) {

                                    response.json({ message: 'fail4', code: 403, success: false });
                                }
                                else {
                                    utils.response(response, 'success');
                                }
                            });
                        }
                    })
                }
                else {
                    utils.response(response, 'fail', 'no product found');
                }
            });
        }
        else {
            utils.response(response, 'unknown');
        }

    }
    else {
        utils.response(response, 'unknown', "Not a customer");
    }
});


/////////Load cart for a user

router.post('/addToBuyNow', function (request, response) {
    logger.debug('routes userdashboard Cart');

    var isValidQuantity = !isNaN(request.body.quantity);

    if (isValidQuantity) {


        var isValidId = validate.id(request.body.productId);
        var isValidVariant = true;

        if (isValidId && isValidVariant) {
          console.log("1")
            var userData = request.userData;
            const profileOps = require('../config/crudoperations/profile');

            profileOps.emptybuynow(userData.userId, () => { });
            productcrud.findProduct(request, (error, result) => {

                if (error) {


                    utils.response(response, 'fail');
                }

                else if (result != undefined) {

                    commonOps.checkProduct1(userData.userId, result.productId, request.body.variantId, (err1, result1) => {
                        console.log("Ss",result1)
                        if (err1) {
                           console.log("ss",err1)
                            utils.response(response, 'fail');
                        }
                        else if (result1 == undefined) {
                            console.log("ss",result1)
                          

                            commonOps.addToBuyNow(userData.userId, result.productId, request.body.variantId, request.body.quantity,request.body.variant1,request.body.variant2,request.body.price,request.body.mrp,request.body.skucode,request.body.productName,request.body.productImage,request.body.codAvailable,request.body.slug, (err1, result1) => {
                                if (err1) {


                                    utils.response(response, 'fail');
                                }
                                else {

                                    utils.response(response, 'success');
                                }
                            });
                        }
                        else {
                            // const profileOps = require('../config/crudoperations/profile');

                            // profileOps.emptybuynow(userData.userId, () => { });
                            commonOps.increementbuyNowItem(result1, result.productId, request.body.variantId, request.body.quantity, (err1, result1) => {
                                if (err1) {

                                    response.json({ message: 'fail4', code: 403, success: false });
                                }
                                else {
                                    utils.response(response, 'success');
                                }
                            });
                        }
                    })
                }
                else {
                    utils.response(response, 'fail', 'no product found');
                }
            });
        }
        else {
            utils.response(response, 'unknown');
        }

    }
    else {
        utils.response(response, 'unknown', "Not a customer");
    }
});


router.post('/loadCart', function (request, response) {
    logger.debug('routes userdashboard loadCart');

    var go = request.userData;
    loadCart(go, response);

});
router.post('/loadQuickBuy', function (request, response) {
    logger.debug('routes userdashboard loadCart');

    var go = request.userData;
    loadQuickBuy(go, response);

});

var loadQuickBuy = function (userData, response) {
    User.getUserById(userData.userId, (error, result) => {
        if (error) {
            logger.error(error);
            utils.response(response, 'fail');
        }
        else {
            console.log("ss",result)
            productcrud.loadquickBuy(result, function (err, result2) {
                if (err) {
                    logger.error(err);
                    utils.response(response, 'fail');
                }
                else if (result2 == undefined) {
                    response.send({ message: 'none' });
                }
                else {
                    response.send(result2);
                }
            });
        }
    });
};

var loadCart = function (userData, response) {
    User.getUserById(userData.userId, (error, result) => {
        if (error) {
            logger.error(error);
            utils.response(response, 'fail');
        }
        else {
            console.log("ss",result)
            productcrud.loadCart(result, function (err, result2) {
                if (err) {
                    logger.error(err);
                    utils.response(response, 'fail');
                }
                else if (result2 == undefined) {
                    response.send({ message: 'none' });
                }
                else {
                    response.send(result2);
                }
            });
        }
    });
};

router.post('/removeFromCart', function (request, response) {
    logger.debug('routes userdashboard removeFromCart');


    var isValidId = validate.id(request.body.productId);
    var isValidVariant = validate.id(request.body.variantId);

    if (isValidId && isValidVariant) {
        var userData = request.userData;
        User.removeFromCart(request, response, userData);
    }
    else {
        response.json({ message: "unknown" });
    }

});
router.post('/updateCart', function (request, response) {
    logger.debug('routes userdashboard removeFromCart');




    if (request.body.quantity) {
        var userData = request.userData;

        User.updateCart(request, response, userData);
    }
    else {
        response.json({ message: "unknown" });
    }

});



////////Add new review

router.post('/addReview', function (request, response) {
    logger.debug('routes userdashboard addReview');


    var isValidReview = validate.complexString(request.body.review);
    var isValidId = validate.id(request.body.productId);
    var isValidRating = (!isNaN(request.body.rating) && request.body.rating <= 5 && request.body.rating > 0);
    if (isValidReview && isValidId&&isValidRating) {
        var userData = request.userData;
        productcrud.addReview(request, response, userData);
    }
    else {
        response.json({ message: "unknown" });
    }

});
router.post('/editReview', function (request, response) {
    logger.debug('routes userdashboard addReview');


    var isValidId = validate.id(request.body.productId);
    
    if ( isValidId) {
        var userData = request.userData;
        productcrud.editReview(request, response, userData);
    }
    else {
        response.json({ message: "unknown" });
    }

});
router.post('/deleteReview', function (request, response) {
    logger.debug('routes userdashboard addReview');


    var isValidId = validate.id(request.body.productId);
    
    if ( isValidId) {
        var userData = request.userData;
        productcrud.deleteReview(request, response, userData);
    }
    else {
        response.json({ message: "unknown" });
    }

});
router.post('/getreviewById', function (request, response) {
  
    if (request.body.reviewId) {
      
  
        productcrud.getReviewById(request, response);
    }
    else {
        response.json({ message: "unknown" });
    }
  
  });
////////rate product
router.post('/rateProduct', function (request, response) {
    logger.debug('routes userdashboard rateProduct');


    var isValidRating = (!isNaN(request.body.rating) && request.body.rating <= 5 && request.body.rating > 0);
    var isValidId = validate.id(request.body.productId);

    if (isValidRating && isValidId) {
        var userData = request.userData;
        productcrud.rateProduct(request, response, userData);
    }
    else {
        response.json({ message: "unknown" });
    }

});

///////////Like Product
router.post('/likeProduct', function (request, response) {
    logger.debug('routes userdash likeProduct');


    var userData = request.userData;
    productcrud.likeProduct(request.body.productId, response, userData);

});
router.post('/loadReviews', function (request, response) {
    logger.debug('routes userdash likeProduct');


    var userData = request.userData;
    productcrud.loadReviews(request.body.productId, response);

});

///////////Bookmark Product
router.post('/bookmarkProduct', function (request, response) {
    logger.debug('routes userdash bookmarkProduct');


    var userData = request.userData;
    productcrud.bookmarkProduct(request.body.productId, response, userData);

});
// 

var cancel = (request, response, userData) => {
    const orderOps = require("../config/crudoperations/orders");
  
    orderOps.updateStatus1
        (  {
            orderId: request.body.orderId,
            products: {
              $elemMatch: {
                productId: request.body.productId,
                variantId: request.body.variantId
              }
            }
          },
      "cancelled",
      (error, result) => {
        console.log(error, result);
        if (error) {
            console.log("rj",error)
          logger.error(error);
          response.json({ message: "fail" });
        } else if (result && result.products) {
            console.log("cancelorder-------->",result)
          for (var i = 0; i < result.products.length; i++) {
            var Query = {
              numberOfSells: -result.products[i].quantity,
              "variants.$.stock": result.products[i].quantity
            };
            productcrud.increementProperty2(
              result.products[i].productId,
              Query,
              (error, result) => {}
            );
          }
          const profileOps = require('../config/crudoperations/profile');

  
          profileOps.updateProperty(userData.userId,-result.creditsUsed, () => { })

          if (userData && userData.userInfo) {
            productcrud.findProduct(request, (error, result) => {

                if (error) {


                    utils.response(response, 'fail');
                }

                else if (result != undefined) {
                    var user = {userEmail:[userData.userEmail,result.postedByEmail],userId:userData.userId,userInfo:userData.userInfo,mobile:userData.mobile,content:request.body.content, orderId: request.body.orderId, productId: request.body.productId,
                        variantId: request.body.variantId,title:request.body.title };
                    console.log("rohanjha",user);
                    utils.createMail(user, "returnOrder");
        
                    response.json({ message: "success" });
                }
            })
          
          
        }
        }
      }
    );
  };
router.post('/cancelOrder', function (request, response) {
    logger.debug('routes userdash return-order');
    const orderOps = require("../config/crudoperations/orders");
console.log("Rj",request.userData)
    orderOps.getOrderById99(request, (error, result) => {
        if (error) {
          logger.error(error);
        } else if (result ) {
            // console.log("rj",result.trackStatus)
          cancel(request, response, request.userData);
        } else {
          response.json({ message: "fail" });
        }
      });
  
  
});

router.post('/stockcheck', function (request, response) {
    logger.debug('routes userdash order');
    const config = require('../config/config');

    var isValidType = false;
    var isValidCoupon = true;
    if(request.body.couponDiscount==undefined)
    {
request.body.couponDiscount = 0;
    }
    

    if (request.body.voucher) {

        isValidCoupon = validate.voucher(request.body.voucher);
        console.log(isValidCoupon)
    }

    if (config.PAYMENT_OPTIONS.indexOf(request.body.type) > -1) {
        isValidType = true;
    }


    if (isValidType && isValidCoupon && request.userData.userInfo) {

        initOrder1(request, response, request.userData);
    }
    else {
        response.json({ message: "unknown" });
    }
});
router.post('/generateInvoice',function(request,response)
{
    var text = "";
    var that=this;
    orderOps.getOrderById(request.body.orderId, (error, results) => {
        if (error) {
          logger.debug("routes amindash/orders query error", error);
    
          response.json({ message: "fail" });
        } else if (results) {
        //   logger.debug("routes amindash/orders query noorders");
           console.log("rjjj",results)
           var to = request.userData.userEmail;
           var html=""
           // text = "Order return request for order Id " + userdata.orderId + " from " + userdata.useremail+" userId "+ userdata.userId;
           var result = results;
           console.log('rohanjha',result.products)
           text = "Your Order " + result.orderId + " placed successfully. \n";
           var products = result.products;
           var today = new Date();
           var dd = today.getDate();
           
           var mm = today.getMonth()+1; 
           var yyyy = today.getFullYear();
           if(dd<10) 
           {
               dd='0'+dd;
           } 
           
           if(mm<10) 
           {
               mm='0'+mm;
           } 
           today = dd+'-'+mm+'-'+yyyy;
        //    result.products.forEach((prdt, index) => {
        //        console.log(index);
        //        text = text + `PrdtTitle ${prdt.title} + Price:${prdt.price} + Quantity ${prdt.quantity}\n`;
        //         html+=`    <tr> 
        //         <td width="100%" valign="top" align="left" style="padding:0 3.5rem;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;border-bottom:2px solid #e6e4e4;">
        //           <table border="0" cellspacing="0" cellpadding="0" width="100%">
        //             <tr> 
        //             <td width="30%" align="left" style="letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
        //             ${prdt.title}(${prdt.value})
        //             </td>
        //               <td width="15%" align="center" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
        //               $${prdt.price}
        //               </td>
                     
        //               <td width="15%" align="center" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
        //               ${prdt.quantity}
        //               </td>
                     
        //               <td width="30%" align="right" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
        //               $${prdt.quantity*prdt.price}
        //               </td>
        //             </tr> 
        //           </table>
        //         </td> 
        //       </tr>`
        //    });
        result.products.forEach((prdt, index) => {
            console.log(index);
            text = text + `PrdtTitle ${prdt.title} + Price:${prdt.price} + Quantity ${prdt.quantity}\n`;
             html+=`    <tr> 
             <td width="100%" valign="top" align="left" style="padding:0 3.5rem;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;border-bottom:2px solid #e6e4e4;">
               <table border="0" cellspacing="0" cellpadding="0" width="100%">
                 <tr> 
                 <td width="30%" align="left" style="letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                 ${prdt.title}(${prdt.variant1.name}:${prdt.variant1.value}<br>
                  ${prdt.variant2.name}:${prdt.variant2.value})
                 </td>
                   <td width="15%" align="center" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                   ${prdt.price}
                   </td>
                  
                   <td width="15%" align="center" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                   ${prdt.quantity}
                   </td>
                  
                   <td width="30%" align="right" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                   ${prdt.quantity*prdt.price}
                   </td>
                 </tr> 
               </table>
             </td> 
           </tr>`
        });
           text = text + `Address: \n TO:${result.address.fullname} \n AREA:${result.address.area}\nCITY:${result.address.city}\nSTATE:${result.address.state}\nPINCODE:${result.address.pincode}\n\n`;

           text = text + `Total Order Price is ${result.grandTotal}`;
           var htmlBody=`<!DOCTYPE html>
           <html xmlns="http://www.w3.org/1999/xhtml">
             <head>
                 <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                 <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                
             </head>
             <body style="padding:0; margin:0">
               <table width="600" cellspacing="0" cellpadding="0" bgcolor="#" style="margin:0 auto;">
                 <tr>
                   <td style="background:#fff; " width="100%" valign="top">
                     <table width="600" border="0" cellspacing="0" cellpadding="0">
                       <tr>
                         <td valign="top" >
                           <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:2.5rem 3.5rem 2rem 3.5rem;">
                             <tr> 
                               <td align="left" style="padding: 0 0.5rem;letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-size:15px;font-family:arial;font-weight: 550;" >
                                 FIT ZIGAROO
                               </td> 
                             
                             </tr> 
                             <tr> 
                               <td align="left" style="padding: 0 0.5rem;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;" >
                                DELHI NCR<br>
                                 Bakers Street<br>
                                 INDIA, 
                               </td> 
                             
                             </tr> 
                           </table> 
                           <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:2rem 3.5rem 2rem 3.5rem;background-color: #f9f9f9;">
                             <tr> 
                               <td width="60%" valign="top">
                                 <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                   <tr> 
                                     <td align="left" style="padding: 0 0.5rem 0.5rem 0.5rem;letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-size:15px;font-family:arial;font-weight: 550;" >
                                       Bill to:
                                     </td>
                                   </tr> 
                                   <tr> 
                                     <td align="left" style="padding: 0 0.5rem;letter-spacing: 0.1px;line-height:22px;color:gray;font-size:15px;font-family:arial;font-weight: 550;" >
                                     ${result.address.firstName+" "+result.address.lastName}
                                     </td>
                                   </tr>
                                   <tr> 
                                   <td align="left" style="letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-family:arial;padding:0.2rem 0;" >
                                   Shipping<br> Address
                                 </td>
                                     <td align="left" style="padding: 0 0.5rem;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;" >
                                     ${result.address.area},
                                     ${result.address.city},<br>
                                     ${result.address.state},${result.address.country},${result.address.pincode}
                                     </td>
                                   </tr> 
                                   <tr> 
                                   <td align="left" style="letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-family:arial;padding:0.2rem 0;" >
                                   Billing<br> Address
                                 </td>
                                     <td align="left" style="padding: 0 0.5rem;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;" >
                                     ${result.billing_address.area},
                                     ${result.billing_address.city},<br>
                                     ${result.billing_address.state},${result.billing_address.country},${result.billing_address.pincode}
                                     </td>
                                   </tr> 
                                 </table>
                               </td> 
                               <td width="40%" valign="top">
                                 <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0.5rem 0.5rem 0 0;">
                                   <tr> 
                                     <td align="left" style="letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-family:arial;padding:0.2rem 0;" >
                                       Invoice Date
                                     </td>
                                     <td align="right" style="letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;padding:0.2rem 0;" >
                                     ${today}
                                     </td>
                                   </tr> 
                                   <tr> 
                                     <td align="left" style="letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-family:arial;padding:0.2rem 0;" >
                                       Order Id
                                     </td>
                                     <td align="right" style="letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;padding:0.2rem 0;" >
                                      ${result.orderId}
                                     </td>
                                   </tr> 
                                   
                                 </table>
                               </td> 
                             </tr>
                           </table>
                           <table border="0" cellspacing="0" cellpadding="10" width="100%">
                             <tr> 
                               <td width="100%" valign="top" align="left" style="padding:0 3.5rem;letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-family:arial;border-bottom:2px solid #e6e4e4;">
                                 <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                   <tr> 
                                   <td width="30%" align="left" style="letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-family:arial;border-right:2px solid #e6e4e4;" >
                                   Product
                                  </td>
                                 
                                     <td width="15%" align="center" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-family:arial;border-right:2px solid #e6e4e4;" >
                                       Price
                                     </td>
                                  
                                     <td width="15%" align="right" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-family:arial;border-right:2px solid #e6e4e4;" >
                                       Quantity
                                     </td>
                                     <td width="30%" align="right" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-family:arial;" >
                                       Amount
                                     </td>
                                   </tr> 
                                 </table>
                               </td> 
                             </tr>
                           
                         ${html}
                         
                           
                           </table>
                           <table border="0" cellspacing="0" cellpadding="0" width="100%">
                             <tr> 
                               <td width="43%" valign="top" align="left" style="padding:0 0 0 3.5rem;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;">
                                 <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                   <tr> 
                                     <td width="10%" align="left" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                       thank you for your Business!
                                     </td>
                                   </tr> 
                                 </table>
                               </td> 
                               <td width="57%" valign="top" align="left">
                                 <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0 2.3rem 0 0;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;border-bottom:2px solid #e6e4e4;">
                                   <tr> 
                                     <td width="50%" align="left" style="padding: 1rem 1.8rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                       Subtotal
                                     </td>
                                     <td width="50%" align="right" style="padding: 1rem 1.8rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                     ${parseFloat(result.total).toFixed(2)}
                                     </td>
                                   </tr> 
                                 </table>
                                  <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0 2.3rem 0 0;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;border-bottom:2px solid #e6e4e4;">
                                 <tr> 
                                   <td width="50%" align="left" style="padding: 1rem 1.8rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                    Discount
                                   </td>
                                   <td width="50%" align="right" style="padding: 1rem 1.8rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                     ${parseFloat(result.totaldiscount).toFixed(2)}
                                   </td>
                                 </tr> 
                               </table>
                               <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0 2.3rem 0 0;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;">
                               <tr> 
                                 <td width="50%" align="left" style="padding: 1rem 1.8rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                   Tax
                                 </td>
                                 <td width="50%" align="right" style="padding: 1rem 1.8rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                   ${result.totaltax}
                                 </td>
                               </tr> 
                             </table>
                                 <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0 2.3rem 0 0;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;border-bottom:2px solid #e6e4e4;">
                                   <tr> 
                                     <td width="50%" align="left" style="padding: 1rem 1.8rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                      Delivery Charges
                                     </td>
                                     <td width="50%" align="right" style="padding: 1rem 1.8rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                       100
                                     </td>
                                   </tr> 
                                 </table>
                              
                                 <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0 2.3rem 0 0;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;">
                                   <tr> 
                                     <td width="50%" align="left" style="padding: 1rem 1.8rem;letter-spacing: 0.1px;background-color: #f66e3d;color:white;line-height:22px;font-family:arial;" >
                                       GrandTotal
                                     </td>
                                     <td width="50%" align="right" style="padding: 1rem 1.8rem;letter-spacing: 0.1px;background-color: #f66e3d;color:white;line-height:22px;font-family:arial;" >
                                     ${result.grandTotal}

                                     </td>
                                   </tr> 
                                 </table>
                               </td>
                             </tr>
                           </table>
                         
                               </td>
                             </tr>
                           </table>
                         </td>
                       </tr>
                     </table>
                   </td>
                 </tr>
               </table>
             </body>
           </html>`
           // that.sendSms("+917042890193",text)
           utils.sendMail(to, "Invoice", text, htmlBody);
        //    utils.response(response, 'success');
        var options = { format: 'A4' };
        const name=request.body.orderId+Math.floor((Math.random() * 100) + 54)+'.pdf'
        pdf.create(htmlBody, options).toFile('./public/Invoice'+'/invoice'+name, function(err, res) {
            if (err) return console.log(err);
                    //   response.json('success',{url:'/ftp/Invoice/'+name});
                    response.json({ url: '/ftp/Invoice/invoice'+name , success: true, code: 200 });


            console.log(res); // { filename: '/app/businesscard.pdf' }
          });
        //    let arr=[]
        //    arr.push(results)
        //    arr.push({
        //        email:request.userData.userEmail
        //    })
        //    console.log("rjjj",arr)
        //    utils.createMail(arr, "orderinvoice");

        //   response.json(results);
        } else {
          response.json({ message: "Error! Try again Later" });
        }
      });
    
})
//////////Order
router.post('/orderNow', function (request, response) {
    logger.debug('routes userdash order');
    const config = require('../config/config');
    var isValidPayment = true;

    var isValidType = false;
    var isValidCoupon = true;
  
    if(request.body.couponDiscount==undefined)
    {
request.body.couponDiscount = 0;
    }
    console.log("dicic",request.userData)
    if(request.body.useCredits==true)
    {
        const profileOps = require('../config/crudoperations/profile');

        profileOps.getUserById(request.userData.userId, (error,user) => {
            console.log("iknowerror",user)
            request.body.credit=(user.credits*25)/100
         });

        // request.body.credit=request.userData.credits
    }
    else
    {
        request.body.credit=0
    }
   
    if (request.body.voucher) {

        isValidCoupon = validate.voucher(request.body.voucher);
        console.log(isValidCoupon)
    }

    if (config.PAYMENT_OPTIONS.indexOf(request.body.type) > -1) {
        isValidType = true;
    }


    if (isValidType && isValidCoupon && request.userData.userInfo&&isValidPayment) {
        cashbackOps.findCashback("rpMYOm1N",(cashbackData)=>{
            if(cashbackData){
            
                console.log("rohan",cashbackData)
             var   cashbackPercentage=cashbackData.cashbackPercentage
                request.body.cashbackPercentage=cashbackPercentage
              var  cashbackAmount=cashbackData.cashbackAmount
                request.body.cashbackAmount=cashbackAmount
            }
            else{
              request.body.cashbackAmount=0
              request.body.cashbackPercentage=0
      
            }  
        })
        if(request.body.paymentMode==='online')
        {
           if(request.body.transactionId===undefined)
           {
            utils.response(response, 'fail',"Transaction Id not provided");
            return 0
           } 
           else{
            transaction.getTransactionById(request.body.transactionId, (error,res) => {
              if(error){
                utils.response(response, 'fail',"Payment UnProcessed Please Try Again!");
                return 0
              }
              else{
                  console.log("sdjdj",res)
                if(res.isCompleted===false)
                {
                    utils.response(response, 'fail',"Payment UnProcessed Please Try Again!");
                return 0 
                }
                else{
                    initOrder(request, response, request.userData);
                }
              }
             });
           }
        }
        else
        initOrder(request, response, request.userData);
    }
    else {
        response.json({ message: "unknown" });
    }
});

router.post('/buyNow', function (request, response) {
    logger.debug('routes userdash order');
    const config = require('../config/config');

    var isValidType = false;
    var isValidCoupon = true;
    if(request.body.couponDiscount==undefined)
    {
request.body.couponDiscount = 0;
    }
    console.log("dicic",request.userData)
    if(request.body.useCredits==true)
    {
        const profileOps = require('../config/crudoperations/profile');

        profileOps.getUserById(request.userData.userId, (error,user) => {
            console.log("iknowerror",user)
            request.body.credit=(user.credits*25)/100
         });

        // request.body.credit=request.userData.credits
    }
    else
    {
        request.body.credit=0
    }
   
    if (request.body.voucher) {

        isValidCoupon = validate.voucher(request.body.voucher);
        console.log(isValidCoupon)
    }

    if (config.PAYMENT_OPTIONS.indexOf(request.body.type) > -1) {
        isValidType = true;
    }


    if (isValidType && isValidCoupon && request.userData.userInfo) {
        cashbackOps.findCashback("rpMYOm1N",(cashbackData)=>{
            if(cashbackData){
            
                console.log("rohan",cashbackData)
             var   cashbackPercentage=cashbackData.cashbackPercentage
                request.body.cashbackPercentage=cashbackPercentage
              var  cashbackAmount=cashbackData.cashbackAmount
                request.body.cashbackAmount=cashbackAmount
            }
            else{
              request.body.cashbackAmount=0
              request.body.cashbackPercentage=0
      
            }  
        })

        if(request.body.paymentMode==='online')
        {
           if(request.body.transactionId===undefined)
           {
            utils.response(response, 'fail',"Transaction Id not provided");
            return 0
           } 
           else{
            transaction.getTransactionById(request.body.transactionId, (error,res) => {
              if(error){
                utils.response(response, 'fail',"Payment UnProcessed Please Try Again!");
                return 0
              }
              else{
                  console.log("sdjdj",res)
                if(res.isCompleted===false)
                {
                    utils.response(response, 'fail',"Payment UnProcessed Please Try Again!");
                return 0 
                }
                else{
                    initbuyNow(request, response, request.userData);
                }
              }
             });
           }
        }
        else
        initbuyNow(request, response, request.userData);    }
    else {
        response.json({ message: "unknown" });
    }
});

router.post('/cartPrice', function (request, response) {
    logger.debug('routes userdash order');
    const config = require('../config/config');

    var isValidType = true;
    var isValidCoupon = true;
    if(request.body.couponDiscount==undefined)
    {
    request.body.couponDiscount = 0;
    }
    if(request.body.useCredits==true)
    {
        const profileOps = require('../config/crudoperations/profile');

        profileOps.getUserById(request.userData.userId, (error,user) => {
            console.log("iknowerror",user)
            request.body.credit=(user.credits*25)/100
         });

        // request.body.credit=request.userData.credits
    }
    else
    {
        request.body.credit=0
    }
   
    if (request.body.voucher) {
        isValidCoupon = validate.voucher(request.body.voucher);
    }

    if (config.PAYMENT_OPTIONS.indexOf(request.body.type) > -1) {
        isValidType = true;
    }


    if (isValidType && isValidCoupon) {

        initPrice(request, response, request.userData);
    }
    else {


    }
});

router.post('/quickBuyPrice', function (request, response) {
    logger.debug('routes userdash order');
    const config = require('../config/config');

    var isValidType = true;
    var isValidCoupon = true;
    if(request.body.couponDiscount==undefined)
    {
    request.body.couponDiscount = 0;
    }
    if (request.body.voucher) {
        isValidCoupon = validate.voucher(request.body.voucher);
    }

    if (config.PAYMENT_OPTIONS.indexOf(request.body.type) > -1) {
        isValidType = true;
    }
    if(request.body.useCredits==true)
    {
        const profileOps = require('../config/crudoperations/profile');

        profileOps.getUserById(request.userData.userId, (error,user) => {
            console.log("iknowerror",user)
            request.body.credit=(user.credits*25)/100
         });

        // request.body.credit=request.userData.credits
    }
    else
    {
        request.body.credit=0
    }

    if (isValidType && isValidCoupon) {

        initBuyNowPrice(request, response, request.userData);
    }
    else {


    }
});

router.post("/loadbookmarkProduct", function (request, response) {
    var userData = request.userData;
    
    productcrud.loadBookmark(response, userData);
});

////REturn Email generator....
//////////Retutn Order
router.post('/returnOrder', function (request, response) {
    logger.debug('routes userdash return-order');


    if (request.userData && request.userData.userInfo) {
        var user = { ...request.userData, orderId: request.body.orderId };
        orderOps.returnOrder(request,response)
        // console.log(user);
        // utils.createMail(user, "returnOrder");
        // response.json({ message: "success" });
    }
    else {
        response.json({ message: "unknown" });
    }
});




var validateVoucher = function (request, response, callback) {
    const voucher = require('../config/crudoperations/voucher');
    if (request.body.voucher) {
        voucher.checkVoucher(request.body.voucher, (error, result) => {
            if (error) {
                if (request.body.type === 'cod')
                    utils.response(response, 'fail');
                else response.render("paymentFail", { message: "Transaction failed" });
            }
            else if (result == undefined) {

                if (request.body.type === 'cod')
                    utils.response(response, 'fail', "voucher not found");
                else response.render("paymentFail", { message: "Transaction failed" });
            }
            else if (result && result.expired) {
                if (request.body.type === 'cod')
                    utils.response(response, 'fail', "voucher expired");
                else response.render("paymentFail", { message: "Transaction failed" });
            }
            else {
                request.body.couponDiscount = result.discount;
                callback(request, response);
            }
        });
    }
    else {
        callback(request, response);
    }
}

var initPrice = (request, response, userData) => {

    const profileOps = require('../config/crudoperations/profile');
    const voucher = require("../config/crudoperations/voucher");


    validateVoucher(request, response, (request, response) => {
        if (request.body.type === 'cod') {
            createPrice(request, userData, (error, result) => {

                if (error) {

                    logger.error(error);
                    utils.response(response, 'fail');
                }
                else if (result) {

                    response.json({ result, message: "success" });
                }
            });
        }
        else {
            utils.response(response, 'fail', "No products in cart");
        }
    })
}

var initBuyNowPrice = (request, response, userData) => {

    const profileOps = require('../config/crudoperations/profile');
    const voucher = require("../config/crudoperations/voucher");


    validateVoucher(request, response, (request, response) => {
        if (request.body.type === 'cod') {
            createBuyNowPrice(request, userData, (error, result) => {

                if (error) {

                    logger.error(error);
                    utils.response(response, 'fail');
                }
                else if (result) {

                    response.json({ result, message: "success" });
                }
            });
        }
        else {
            utils.response(response, 'fail', "No products in cart");
        }
    })
}



var initOrder = (request, response, userData) => {
    const orderOps = require('../config/crudoperations/orders');
    const profileOps = require('../config/crudoperations/profile');
    const voucher = require("../config/crudoperations/voucher");
console.log("rjhaa",userData)
    //validate voucher 
    validateVoucher(request, response, (request, response) => {
        if (request.body.type === 'cod') {
            createOrder(request, userData, (error, result) => {

                if (error) {
                console.log("Ss",error)
                    logger.error(error);
                    utils.response(response, 'fail',error.message);
                }
                else if (result) {
                    var resultOrder = result.order;
                    orderOps.createOrder(resultOrder, (error2, result2) => {
                        if (error2) {
                              console.log("ss",error2)
                            logger.error(error2);
                            utils.response(response, 'fail');
                        }
                        else {
                            console.log("eeee",result2)
                            for (var i = 0; i < result2.products.length; i++) {
                                var Query = {
                                    "variants.$.stock": -result2.products[i].quantity
                                }
                                productcrud.increementProperty2(result2.products[i].productId, result2.products[i].variantId, Query, (error3, result3) => {
                                    if (error3) {
                                        logger.error(error3);
                                    }
                                })
                            }
                            var credits=result2.cashbackReceived-result2.creditsUsed
                            //empty cart
                            profileOps.emptyCart(userData.userId, () => { });
                            profileOps.updateProperty(userData.userId,credits, () => { })

                            //transfer credits
                            // const creditOps = require('../config/crudoperations/credits');
                            // creditOps.transferCredits(userData.userId, result2.orderId, result2.total, result2.creditsUsed, () => { });

                            var products = result.prdt;
                            var user = { useremail: request.userData.userEmail,fullName:request.userData.userInfo.firstName+request.userData.userInfo.lastName,mobile:request.userData.mobile, result2, products };
                //               var to = userdata.useremail;
                // // text = "Order return request for order Id " + userdata.orderId + " from " + userdata.useremail+" userId "+ userdata.userId;
                // var result = user.result2;
                // var text = "";
                // text = "Your Order " + result.orderId + " placed successfully. \n";
                // var products = user.products;
                // result.products.forEach((prdt, index) => {
                //     console.log(index);
                //     text = text + `PrdtTitle ${prdt.title} + Price:${prdt.price} + Quantity ${prdt.quantity}\n`;

                // });
                // text = text + `Address: \n TO:${result.address.fullname} \n AREA:${result.address.area}\nCITY:${result.address.city}\nSTATE:${result.address.state}\nPINCODE:${result.address.pincode}\n\n`;

                // text = text + `Total Order Price is ${result.total}`;
                //             //send order successfull mail
                //             utils.sendSms("+917042890193",text)
                            utils.createMail(user, "orderSuccessfull");
                            response.json({ txnId: result2.orderId, message: "success" });
                        }
                    });
                }
                else {
                    utils.response(response, 'fail', "No products in cart");
                }
            })
        }
        else {
            // for net banking 
            var paymenGateway = require("./paymentgateway");
            createOrder(request, userData, (error, result) => {
                if (error) {
                    logger.error(error);
                    response.render("paymentFail", { message: "Transaction failed" });
                }
                else if (result) {
                    var result = result.order;
                    paymenGateway.call(request, response, result, userData);
                }
                else {
                    response.render("paymentFail", { message: "Transaction failed" });
                }
            });
        }
    });
}



var initbuyNow = (request, response, userData) => {
    const orderOps = require('../config/crudoperations/orders');
    const profileOps = require('../config/crudoperations/profile');
    const voucher = require("../config/crudoperations/voucher");

    //validate voucher 
    validateVoucher(request, response, (request, response) => {
        if (request.body.type === 'cod') {
            createbuyNow(request, userData, (error, result) => {

                if (error) {
                console.log("Ss",error)
                    logger.error(error);
                    utils.response(response, 'fail',error.message);
                }
                else if (result) {
                    var resultOrder = result.order;
                    orderOps.createOrder(resultOrder, (error2, result2) => {
                        if (error2) {
                              console.log("ss",error2)
                            logger.error(error2);
                            utils.response(response, 'fail');
                        }
                        else {
                            console.log("eeee",result2)
                            for (var i = 0; i < result2.products.length; i++) {
                                var Query = {
                                    "variants.$.stock": -result2.products[i].quantity
                                }
                                productcrud.increementProperty2(result2.products[i].productId, result2.products[i].variantId, Query, (error3, result3) => {
                                    if (error3) {
                                        logger.error(error3);
                                    }
                                })
                            }
                            var credits=result2.cashbackReceived-result2.creditsUsed
                            //empty cart
                            // const profileOps = require('../config/crudoperations/profile');

                            profileOps.emptybuynow(userData.userId, () => { });
                            profileOps.updateProperty(userData.userId,credits, () => { })

                            //transfer credits
                            // const creditOps = require('../config/crudoperations/credits');
                            // creditOps.transferCredits(userData.userId, result2.orderId, result2.total, result2.creditsUsed, () => { });

                            var products = result.prdt;
                            var user = { useremail:request.userData.userEmail,fullName:request.userData.userInfo.firstName+request.userData.userInfo.lastName,mobile:request.userData.mobile, result2, products };
                //               var to = userdata.useremail;
                // // text = "Order return request for order Id " + userdata.orderId + " from " + userdata.useremail+" userId "+ userdata.userId;
                // var result = user.result2;
                // var text = "";
                // text = "Your Order " + result.orderId + " placed successfully. \n";
                // var products = user.products;
                // result.products.forEach((prdt, index) => {
                //     console.log(index);
                //     text = text + `PrdtTitle ${prdt.title} + Price:${prdt.price} + Quantity ${prdt.quantity}\n`;

                // });
                // text = text + `Address: \n TO:${result.address.fullname} \n AREA:${result.address.area}\nCITY:${result.address.city}\nSTATE:${result.address.state}\nPINCODE:${result.address.pincode}\n\n`;

                // text = text + `Total Order Price is ${result.total}`;
                //             //send order successfull mail
                //             utils.sendSms("+917042890193",text)
                            utils.createMail(user, "orderSuccessfull");
                            response.json({ txnId: result2.orderId, message: "success" });
                        }
                    });
                }
                else {
                    utils.response(response, 'fail', "No products in cart");
                }
            })
        }
        else {
            // for net banking 
            var paymenGateway = require("./paymentgateway");
            createOrder(request, userData, (error, result) => {
                if (error) {
                    logger.error(error);
                    response.render("paymentFail", { message: "Transaction failed" });
                }
                else if (result) {
                    var result = result.order;
                    paymenGateway.call(request, response, result, userData);
                }
                else {
                    response.render("paymentFail", { message: "Transaction failed" });
                }
            });
        }
    });
}


var initOrder1 = (request, response, userData) => {
    const orderOps = require('../config/crudoperations/orders');
    const profileOps = require('../config/crudoperations/profile');
    const voucher = require("../config/crudoperations/voucher");

    //validate voucher 
    validateVoucher(request, response, (request, response) => {
        if (request.body.type === 'cod') {
            createOrder1(request, userData, (error, result) => {

                if (error) {
                console.log("Ss",error)
                    logger.error(error);
                    utils.response(response, 'fail',error.message);
                    // return false;
                }
                else if (result) {
                 console.log("rohan",result)
                            response.json({message: "success" });
                        }
                    
                
                else {
                    utils.response(response, 'fail', "No products in cart");
                }
            })
        }
        else {
            // for net banking 
            var paymenGateway = require("./paymentgateway");
            createOrder(request, userData, (error, result) => {
                if (error) {
                    logger.error(error);
                    response.render("paymentFail", { message: "Transaction failed" });
                }
                else if (result) {
                    var result = result.order;
                    paymenGateway.call(request, response, result, userData);
                }
                else {
                    response.render("paymentFail", { message: "Transaction failed" });
                }
            });
        }
    });
}

var createPrice = (request, userData, callback) => {

    var coupon = request.body.voucher;
    var couponDiscount = request.body.couponDiscount;
    const config = require('../config/config');
    const profileOps = require('../config/crudoperations/profile');
    profileOps.getUserById(userData.userId, (error, result) => {
        if (result && result.userId && result.cart && result.cart.length > 0) {
            var cart = result.cart;
            var products = [];
            var productIds = [];
           
            for (var i = 0; i < cart.length; i++) {
                var product = {
                    productId: cart[i].productId,
                    variantId: cart[i].variantId,
                    quantity: cart[i].quantity
                }
                products.push(product);
                productIds.push(product.productId);
            }

            const productcrud = require('../config/crudoperations/productcrud');
            productcrud.getProductsByIds(productIds, (error2, result2) => {
                //check if cart has products and exists in db
                console.log("Dd",result2)
                if (result2) {
                    var finalAmount = 0;
                    var products2 = [];
                    var tax=0
                    var subTotal=0;
                    var totaldiscount=0
                    var price;
                    var insufficient = false;

                    for (var j = 0; j < products.length; j++) {
                        var productIndex = result2.findIndex(x => x.productId === products[j].productId);
                        console.log(productIndex)
                        var variantIndex = result2[productIndex].variants.findIndex(x => x.variantId === products[j].variantId);
                        var product2 = {
                            productId: result2[productIndex].productId,
                            price: result2[productIndex].variants[variantIndex].price+result2[productIndex].variants[variantIndex].tax,
                            tax:0 ,
                            quantity: products[j].quantity,
                 
                            // deliveryCharges:result2[j].deliveryCharges,
                            // maxAmount:result2[j].maxAmount,

                            // deliveryCharges:product[j].deliveryCharges
                        }
                        var subtotal=(product2.quantity*product2.price)
                        var totaldisc=(subtotal*couponDiscount)/100
                        totaldiscount+=(subtotal*couponDiscount)/100

                        subtotal=subtotal-totaldisc
                        subTotal+=(subtotal)

                        var Tax=product2.tax
                        
                        tax+=product2.tax
                        // var finaleAmount=subtotal+Tax
                    
                        console.log("rohan",totaldisc)
                         finalAmount+=subtotal+Tax
                         console.log("rohanjha",finalAmount)

                        products2.push(product2);
                    }
                    if(finalAmount<300)
                    finalAmount = finalAmount+config.DELIVERY_CHARGES
                    if(request.body.useCredits==true)
                    {
                        if(request.body.credit>25/100*(finalAmount))
                        {
                           request.body.credit=25/100*(finalAmount)
                        }
                    }
                   
                    console.log("vhhvshs", finalAmount)
                    //check if credits are usable
                   
                    //final amount calculation
                    finalAmount = finalAmount.toFixed(2);
                    finalAmount = parseFloat(finalAmount);

                    var price = {};
                
                    price.total = subTotal-request.body.credit;
                    price.coupon = coupon;
                    price.couponDiscount = couponDiscount;
                     price.totaltax=tax
                     price.credit=request.body.credit;
                     price.totaldiscount=totaldiscount
                     price.grandTotal=finalAmount-request.body.credit;
                     if(finalAmount<300)
                    price.deliveryCharges = config.DELIVERY_CHARGES;
                    else
                    price.deliveryCharges=0
                    if (!insufficient) {
                        var orderprdt = {
                           
                            order: price
                        }
                        callback(null, orderprdt);
                    }
                }
                else {
                    logger.error(error2);
                    callback(error2, null);
                }
            });
        }
        else {
            logger.error(error);
            callback(error, null);
        }
    });
};

var createBuyNowPrice = (request, userData, callback) => {

    var coupon = request.body.voucher;
    var couponDiscount = request.body.couponDiscount;
    const config = require('../config/config');
    const profileOps = require('../config/crudoperations/profile');
    profileOps.getUserById(userData.userId, (error, result) => {
        if (result && result.userId && result.buynow && result.buynow.length > 0) {
            var cart = result.buynow;
            var products = [];
            var productIds = [];
           
            for (var i = 0; i < cart.length; i++) {
                var product = {
                    productId: cart[i].productId,
                    variantId: cart[i].variantId,
                    quantity: cart[i].quantity
                }
                products.push(product);
                productIds.push(product.productId);
            }

            const productcrud = require('../config/crudoperations/productcrud');
            productcrud.getProductsByIds(productIds, (error2, result2) => {
                //check if cart has products and exists in db
                console.log("Dd",result2)
                if (result2) {
                    var finalAmount = 0;
                    var products2 = [];
                    var tax=0
                    var subTotal=0;
                    var totaldiscount=0
                    var price;
                    var insufficient = false;


                    for (var j = 0; j < products.length; j++) {
                        var productIndex = result2.findIndex(x => x.productId === products[j].productId);
                        console.log(productIndex)
                        var variantIndex = result2[productIndex].variants.findIndex(x => x.variantId === products[j].variantId);
                        var product2 = {
                            productId: result2[productIndex].productId,
                            price: result2[productIndex].variants[variantIndex].price+result2[productIndex].variants[variantIndex].tax,
                            tax:0,
                            quantity: products[j].quantity,
                 
                            // deliveryCharges:result2[j].deliveryCharges,
                            // maxAmount:result2[j].maxAmount,

                            // deliveryCharges:product[j].deliveryCharges
                        }
               console.log("rohan",product2)
               var subtotal=(product2.quantity*product2.price)
               var totaldisc=(subtotal*couponDiscount)/100
               totaldiscount+=(subtotal*couponDiscount)/100

               subtotal=subtotal-totaldisc
               subTotal+=(subtotal)

               var Tax=(subtotal*product2.tax)/100
               
               tax+=((subtotal)*product2.tax)/100
               // var finaleAmount=subtotal+Tax
           
               console.log("rohan",totaldisc)
                finalAmount+=subtotal+Tax
                console.log("rohanjha",finalAmount)

               products2.push(product2);
                    }
                    if(finalAmount<300)
                    finalAmount = finalAmount+config.DELIVERY_CHARGES
                    console.log("vhhvshs", finalAmount)
                    //check if credits are usable
                    if(request.body.useCredits==true)
                    {
                        if(request.body.credit>25/100*(finalAmount))
                        {
                           request.body.credit=25/100*(finalAmount)
                        }
                    }
                   
                    //final amount calculation
                    finalAmount = finalAmount.toFixed(2);
                    finalAmount = parseFloat(finalAmount);

                    var price = {};
                    price.total = subTotal-request.body.credit;
                    price.coupon = coupon;
                    price.couponDiscount = couponDiscount;
                     price.totaltax=tax
                     price.credit=request.body.credit;
                     price.totaldiscount=totaldiscount
                     price.grandTotal=finalAmount-request.body.credit;
                     if(finalAmount<300)
                    price.deliveryCharges = config.DELIVERY_CHARGES;
                    else
                    price.deliveryCharges = 0;

                    if (!insufficient) {
                        var orderprdt = {
                           
                            order: price
                        }
                        callback(null, orderprdt);
                    }
                }
                else {
                    logger.error(error2);
                    callback(error2, null);
                }
            });
        }
        else {
            logger.error(error);
            callback(error, null);
        }
    });
};

var createOrder = (request, userData, callback) => {

    var coupon = request.body.voucher;
    var couponDiscount = request.body.couponDiscount;
    var address=request.body.address;
    var billingaddress=request.body.billing_address;

    var cashbackAmount=0;
    var cashbackPercentage=0;
    const config = require('../config/config');
    const profileOps = require('../config/crudoperations/profile');
    profileOps.getUserById(userData.userId, (error, result) => {
        if (result && result.userId && result.cart && result.cart.length > 0) {
            var cart = result.cart;
            var products = [];
            var productIds = [];
            for (var i = 0; i < cart.length; i++) {
                var product = {
                    productId: cart[i].productId,
                    variantId: cart[i].variantId,
                    quantity: cart[i].quantity,
                    variant1:cart[i].variant1,
                    variant2:cart[i].variant2,
                    skucode:cart[i].skucode,
                    slug:cart[i].slug,
                    price:cart[i].price,
                    mrp:cart[i].mrp
                }
                products.push(product);
                productIds.push(product.productId);
            }

            const productcrud = require('../config/crudoperations/productcrud');
            productcrud.getProductsByIds(productIds, (error2, result2) => {
                //check if cart has products and exists in db
                console.log("rjj",result2[0].title)
                if (result2) {
                    var finalAmount = 0;
                    var subTotal=0;
                
                    var products2 = [];
                    var price;
                    var tax=0
                    
                    var totaldiscount=0
                    var insufficient = false;

                    for (var j = 0; j < products.length; j++) {
                        var productIndex = result2.findIndex(x => x.productId === products[j].productId);
                        console.log("ssorderrrrrrrr",result2[productIndex])
                        var variantIndex = result2[productIndex].variants.findIndex(x => x.variantId === products[j].variantId);
                        var product2 = {
                            productId: result2[productIndex].productId,
                            userId:result2[productIndex].createdBy.userId,
                            trackStatus:"ordered",
                            title:result2[productIndex].title,
                            price: result2[productIndex].variants[variantIndex].price+result2[productIndex].variants[variantIndex].tax,
                            tax: result2[productIndex].variants[variantIndex].tax,
                            quantity: products[j].quantity,
                            variant1:products[j].variant1,
                            variantId:products[j].variantId,
                            variant2:products[j].variant2,
                            skucode:products[j].skucode,
                            slug:products[j].slug,
                           imageUrl:result2[productIndex].imageUrls[0],

                            // deliveryCharges:result2[j].deliveryCharges,
                            // price:products[j].price,
                            mrp:products[j].mrp
                        }
               console.log("abcd",product2)
                        if (result2[productIndex].variants[variantIndex].stock < products[j].quantity) {
                            insufficient = true;
                            callback({ "message": "insufficient stock error" }, null);
                            break;
                        }

                        var subtotal=(product2.quantity*product2.price)
                        var totaldisc=(subtotal*couponDiscount)/100
                        totaldiscount+=(subtotal*couponDiscount)/100

                        subtotal=subtotal-totaldisc
                     

                        // var Tax=subtotal
                        
                        // tax+=product2.tax
                        var taxDiscount=((product2.tax*product2.quantity)*couponDiscount)/100
                        
                        tax+=(product2.tax*product2.quantity)-taxDiscount
                        // var finaleAmount=subtotal+Tax
                    
                        console.log("rohan",totaldisc)
                        subTotal+=(subtotal)
                         finalAmount+=subtotal
                         console.log("rohanjha",finalAmount)

                        products2.push(product2);


                    }
                    // cashbackOps.findCashback
                    var  cashback
                    console.log("rohanjha",request.body.cashbackPercentage,request.body.cashbackAmount)
                   
                 
                    console.log("rjha",request.body.credit)
                       
                  
                    var credit
                          
                    if(finalAmount<300)
                    finalAmount = finalAmount + config.DELIVERY_CHARGES;
                    if(finalAmount>1000)
                    {
                       cashback=(finalAmount*request.body.cashbackPercentage)/100
          
                        if(cashback>request.body.cashbackAmount)
                        {
                            cashback=request.body.cashbackAmount
                        }
                    }
                    else
                    {
                        cashback=0
                    }
                    credit=request.body.credit
                    if(request.body.useCredits===true)
                    {
                        if(credit>finalAmount)
                        {
                          finalAmount=finalAmount-credit
    
                          credit=request.body.credit+finalAmount
                          finalAmount=0
                        
                        }
                        else if(credit>25/100*(finalAmount))
                        {
                            
                            finalAmount=finalAmount-25/100*(finalAmount)
                             request.body.credit=25/100*(finalAmount)
                        }
                        else{
                            finalAmount=finalAmount-credit
                        }
                    }
                   
                    console.log("vhhvshs", finalAmount)
                    //check if credits are usable
                        console.log("bhkvfnkjnkj", credit)
                    

                    //final amount calculation
                    finalAmount = finalAmount.toFixed(2);
                    finalAmount = parseFloat(finalAmount);

                    var order = {};
                    order.orderId = utils.randomStringGenerate(16);
                    console.log("ddddd",products)
                    order.products = products2;
                    order.type = request.body.type;
                    order.trackStatus = 'ordered';
                    order.billing_address=billingaddress;

                    order.total = subTotal-credit;
                    order.totaltax=tax;
                    order.creditsUsed=credit;
                    order.cashbackReceived=cashback;
                    order.paymentMode=request.body.paymentMode
                    // order.grandTotal=finalAmount+tax+couponDiscount
                    order.address=address;
                    order.totaldiscount=totaldiscount;
                    order.grandTotal=finalAmount;
                    order.coupon = coupon;
                    order.couponDiscount = couponDiscount;
                    order.orderedBy = userData.userId;
                    // order.address = userData.userInfo;
                    order.mobile=userData.mobile
                    if(finalAmount<300)
                    order.deliveryCharges = config.DELIVERY_CHARGES;
                    else
                    order.deliveryCharges=0
                    console.log("test",products2)
                    if (!insufficient) {
                        var orderprdt = {
                            prdt: result2,
                            order: order
                        }
                        callback(null, orderprdt);
                    }
                }
                else {
                    logger.error(error2);
                    callback(error2, null);
                }
            });
        }
        else {
            logger.error(error);
            callback(error, null);
        }
    });
};

var createbuyNow = (request, userData, callback) => {

    var coupon = request.body.voucher;
    var couponDiscount = request.body.couponDiscount;
    var address=request.body.address;
    var billingaddress=request.body.billing_address;

    var cashbackAmount=0;
    var cashbackPercentage=0;
    const config = require('../config/config');
    const profileOps = require('../config/crudoperations/profile');
    profileOps.getUserById(userData.userId, (error, result) => {
        if (result && result.userId && result.buynow && result.buynow.length > 0) {
            var cart = result.buynow;
            var products = [];
            var productIds = [];
            for (var i = 0; i < cart.length; i++) {
                var product = {
                    productId: cart[i].productId,
                    variantId: cart[i].variantId,
                    quantity: cart[i].quantity,
                    variant1:cart[i].variant1,
                    variant2:cart[i].variant2,
                    skucode:cart[i].skucode,
                    slug:cart[i].slug,
                    price:cart[i].price,
                    mrp:cart[i].mrp
                }
                products.push(product);
                productIds.push(product.productId);
            }

            const productcrud = require('../config/crudoperations/productcrud');
            productcrud.getProductsByIds(productIds, (error2, result2) => {
                //check if cart has products and exists in db
                console.log("rjj",result2[0].title)
                if (result2) {
                    var finalAmount = 0;
                    var subTotal=0;
                
                    var products2 = [];
                    var price;
                    var tax=0
                    
                    var totaldiscount=0
                    var insufficient = false;

                    for (var j = 0; j < products.length; j++) {
                        var productIndex = result2.findIndex(x => x.productId === products[j].productId);
                        console.log("ss",result2[productIndex].title)
                        var variantIndex = result2[productIndex].variants.findIndex(x => x.variantId === products[j].variantId);
                        var product2 = {
                            productId: result2[productIndex].productId,
                            title:result2[productIndex].title,
                            userId:result2[productIndex].createdBy.userId,
                            trackStatus:"ordered",
                            price: result2[productIndex].variants[variantIndex].price+result2[productIndex].variants[variantIndex].tax,
                            tax: result2[productIndex].variants[variantIndex].tax,
                            quantity: products[j].quantity,
                            variant1:products[j].variant1,
                            variantId:products[j].variantId,
                            variant2:products[j].variant2,
                            skucode:products[j].skucode,
                            slug:products[j].slug,
                           imageUrl:result2[productIndex].imageUrls[0],

                            // deliveryCharges:result2[j].deliveryCharges,
                            // price:products[j].price,
                            mrp:products[j].mrp
                        }
               console.log("abcd",product2)
                        if (result2[productIndex].variants[variantIndex].stock < products[j].quantity) {
                            insufficient = true;
                            callback({ "message": "insufficient stock error" }, null);
                            break;
                        }

                        var subtotal=(product2.quantity*product2.price)
                        var totaldisc=(subtotal*couponDiscount)/100
                        totaldiscount+=(subtotal*couponDiscount)/100

                        subtotal=subtotal-totaldisc
                     

                        // var Tax=subtotal
                        
                        // tax+=product2.tax
                        // var Tax=product2.tax
                        var taxDiscount=((product2.tax*product2.quantity)*couponDiscount)/100
                        
                        tax+=(product2.tax*product2.quantity)-taxDiscount
                        // tax+=product2.tax*product2.quantity
                        // var finaleAmount=subtotal+Tax
                    
                        console.log("rohan",totaldisc)
                        subTotal+=(subtotal)
                         finalAmount+=subtotal
                         console.log("rohanjha",finalAmount)

                        products2.push(product2);




                    }
                    // cashbackOps.findCashback
                  
                    console.log("rohanjha",request.body.cashbackPercentage,request.body.cashbackAmount)
                    var  cashback
                    console.log("rohanjha",request.body.cashbackPercentage,request.body.cashbackAmount)
                   
                 
                    console.log("rjha",request.body.credit)
                       
                  
                    var credit
                          
                     if(finalAmount<300)
                    finalAmount = finalAmount + config.DELIVERY_CHARGES;
                    if(finalAmount>1000)
                    {
                       cashback=(finalAmount*request.body.cashbackPercentage)/100
          
                        if(cashback>request.body.cashbackAmount)
                        {
                            cashback=request.body.cashbackAmount
                        }
                    }
                    else
                    {
                        cashback=0
                    }
                    credit=request.body.credit
                    if(request.body.useCredits===true)
                    {
                        if(credit>finalAmount)
                        {
                          finalAmount=finalAmount-credit
    
                          credit=request.body.credit+finalAmount
                          finalAmount=0
                        
                        }
                        else if(credit>25/100*(finalAmount))
                        {
                            
                            finalAmount=finalAmount-25/100*(finalAmount)
                             request.body.credit=25/100*(finalAmount)
                        }
                        else{
                            finalAmount=finalAmount-credit
                        }
                    }
                   
                    console.log("vhhvshs", finalAmount)
                    //check if credits are usable
                        console.log("bhkvfnkjnkj", credit)
                    

                    //final amount calculation
                    finalAmount = finalAmount.toFixed(2);
                    finalAmount = parseFloat(finalAmount);

                    var order = {};
                    order.orderId = utils.randomStringGenerate(16);
                    console.log("ddddd",products)
                    order.products = products2;
                    order.type = request.body.type;
                    order.billing_address=billingaddress;

                    order.trackStatus = 'ordered';
                    order.total = subTotal-credit;
                    order.totaltax=tax;
                    order.creditsUsed=credit;
                    order.cashbackReceived=cashback;
                    order.paymentMode=request.body.paymentMode
                    // order.grandTotal=finalAmount+tax+couponDiscount
                    order.address=address;
                    order.totaldiscount=totaldiscount;
                    order.grandTotal=finalAmount;
                    order.coupon = coupon;
                    order.couponDiscount = couponDiscount;
                    order.orderedBy = userData.userId;
                    // order.address = userData.userInfo;
                    if(finalAmount<300)
                    order.deliveryCharges = config.DELIVERY_CHARGES;
                    else
                    order.deliveryCharges=0
                    console.log("abc",order)
                    if (!insufficient) {
                        var orderprdt = {
                            prdt: result2,
                            order: order
                        }
                        callback(null, orderprdt);
                    }
                }
                else {
                    logger.error(error2);
                    callback(error2, null);
                }
            });
        }
        else {
            logger.error(error);
            callback(error, null);
        }
    });
};

var createOrder1 = (request, userData, callback) => {

    var coupon = request.body.voucher;
    var couponDiscount = request.body.couponDiscount;
    var address=request.body.address;
    const config = require('../config/config');
    const profileOps = require('../config/crudoperations/profile');
    profileOps.getUserById(userData.userId, (error, result) => {
        if (result && result.userId && result.cart && result.cart.length > 0) {
            var cart = result.cart;
            var products = [];
            var productIds = [];
            for (var i = 0; i < cart.length; i++) {
                var product = {
                    productId: cart[i].productId,
                    variantId: cart[i].variantId,
                    quantity: cart[i].quantity,
                    variant1:cart[i].variant1,
                    variant2:cart[i].variant2,
                    skucode:cart[i].skucode,
                    price:cart[i].price,
                    mrp:cart[i].mrp
                }
                products.push(product);
                productIds.push(product.productId);
            }

            const productcrud = require('../config/crudoperations/productcrud');
            productcrud.getProductsByIds(productIds, (error2, result2) => {
                //check if cart has products and exists in db
                if (result2) {
                  
                    var insufficient = false;

                    for (var j = 0; j < products.length; j++) {
                        var productIndex = result2.findIndex(x => x.productId === products[j].productId);
                        var variantIndex = result2[productIndex].variants.findIndex(x => x.variantId === products[j].variantId);
                        var product2 = {
                            productId: result2[productIndex].productId,
                            title:result2[productIndex].title,
                            price: result2[productIndex].variants[variantIndex].price,
                            tax: result2[productIndex].tax,
                            quantity: products[j].quantity,
                            variant1:products[j].variant1,
                            variantId:products[j].variantId,
                            variant2:products[j].variant2,
                            skucode:products[j].skucode,
                           imageUrl:result2[productIndex].imageUrls[0],

                            // deliveryCharges:result2[j].deliveryCharges,
                            price:products[j].price,
                            mrp:products[j].mrp
                        }
                        if (result2[productIndex].variants[variantIndex].stock < products[j].quantity) {
                            insufficient = true;
                            var transporter = nodeMailer.createTransport({
                                service: 'gmail',
                                auth: {
                                  user: 'utsavplastotech@gmail.com',
                                  pass: 'aayansh@2020',
                                },
                                tls: {
                                  rejectUnauthorized: false,
                                },
                              });
                                   // setup e-mail data with unicode symbols
                                   var mailOptions = {
                                       from: 'utsavplastotech@gmail.com', // sender address
                                       to: ['utsavplastotech@gmail.com','pramodjha10@gmail.com','pkseherbal@gmail.com'], // list of receivers
                                       subject: "Insufficient Stock", // Subject line
                                       text: "Update Stock", // plaintext body
                                       html: `
                                       <h3 style="color: #757575;">Product Id:${result2[productIndex].productId}</h3><br/>
                                       <h3 style="color: #757575;">ProductName:${result2[productIndex].title}</h3><br/>
                                       <h4 style="color: #757575;">Cheers!</h4>
                                       <h4 style="color: #757575;">AlAroma Leafs Team</h4>"
                                       `, // html body
                                   };
                               
                                   // send mail with defined transport object
                                   transporter.sendMail(mailOptions, function (error, info) {
                                       if (error) {
                                           console.log(error);
                                       }
                                       if (info != undefined) {
                                         console.log('Message sent: ' + info.response);
                                        //  response.send("Success")
                                       } else {
                                           console.log("error sending mail");
                                         
                                       }
                                   });
                            callback({ "message": "insufficient stock error" }, null);
                            break;
                        }

                      
                    }
                   if(insufficient==false)
                {
                    callback(null,[])
                }
                   
                  
                }
                else {
                    logger.error(error2);
                    callback(error2, null);
                }
            });
        }
        else {
            logger.error(error);
            callback(error, null);
        }
    });
};

module.exports = router;