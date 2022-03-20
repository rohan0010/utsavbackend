const express = require('express');
const router = express.Router();
const utils = require("../config/utils");
const validate = require("../config/validate");
const logger = require("../config/logger");
const async = require("async");
const productcrud = require("../config/crudoperations/productcrud");
const User = require('../config/crudoperations/profile');
const orderOps = require('../config/crudoperations/orders');
const nodeCCAvenue = require('node-ccavenue');
const cashbackOps = require("../config/crudoperations/cashback");

const ccav = new nodeCCAvenue.Configure({
    merchant_id: 270979,
    working_key: "D1520E5DD0B171BD454817DB90BC2309",
  });
router.post('/api/create-payment', function(req, res){
	const orderParams = {
        order_id: utils.randomNumberGenerate(6,12),
        currency: 'INR',
        amount: parseInt(req.body.total).toString(),
        redirect_url: encodeURIComponent(`https://api.fitzigaroo.com/buynow/api/redirect_url`),
        cancel_url:encodeURIComponent(`https://api.fitzigaroo.com/buynow/api/redirect_url`),
        language:"EN",
        merchant_param1:req.body.couponDiscount.toString(),
        merchant_param2:req.body.userId,
        merchant_param3:req.body.useCredits,
        billing_name: req.body.address.firstName+" "+req.body.address.lastName,
        billing_address:req.body.address.area,
        billing_city:req.body.address.city,
        billing_state:req.body.address.state,
        billing_zip:req.body.address.pincode,
        billing_country:"India",
        billing_tel:req.body.mobile,
        billing_email:req.body.email,
        delivery_name:req.body.billing_address.firstName+" "+req.body.billing_address.lastName,
        delivery_city:req.body.billing_address.city,
        delivery_address:req.body.billing_address.area,
        delivery_state:req.body.billing_address.state,
        delivery_zip:req.body.billing_address.pincode,
        delivery_country:'India',
        delivery_tel:req.body.mobile

        // etc etc
      };
      const encryptedOrderData = ccav.getEncryptedOrder(orderParams);
      console.log(encryptedOrderData); // Proceed further
      res.json({ message: "success",result:encryptedOrderData });
      // createPayment(apiKey, apiSecret, redirectURL, payment, function(paymentResults){
	// 	res.json(paymentResults)
	// 	logger.info("Payment data sent back to user: " + JSON.stringify(paymentResults));
	// });
})
router.post('/api/redirect_url', (req, res) => {
    // console.log("rj",req.userData)

    const { encResp } = req.body;
    const decryptedJsonResponse = ccav.redirectResponseToJson(encResp);
    // To check order_status: - 
    console.log(decryptedJsonResponse);
    if(decryptedJsonResponse.order_status === 'Failure') {
        // DO YOUR STUFF
       res.writeHead(301,
         {Location: 'https://fitzigaroo.com/cancelorder'}
       );
       res.end();
     } else if (decryptedJsonResponse.order_status === 'Success') {
         // DO YOUR STUFF
         const profileOps = require('../config/crudoperations/profile');

   
        req.body.couponDiscount=parseInt(decryptedJsonResponse.merchant_param1)
        req.body.useCredits=decryptedJsonResponse.merchant_param3
        req.body.type="cod"
        req.body.paymentMode="online"
        let obj={
            "firstName":decryptedJsonResponse.billing_name.split(" ")[0],
            "lastName":decryptedJsonResponse.billing_name.split(" ")[1],
            "area":decryptedJsonResponse.billing_address,
            "city":decryptedJsonResponse.billing_city,
            "state":decryptedJsonResponse.billing_state,
            "country":decryptedJsonResponse.billing_country,
            "pincode":decryptedJsonResponse.billing_zip
        }
        req.body.address=obj
        let obj1={
            "firstName":decryptedJsonResponse.delivery_name.split(" ")[0],
            "lastName":decryptedJsonResponse.delivery_name.split(" ")[1],
            "area":decryptedJsonResponse.delivery_address,
            "city":decryptedJsonResponse.delivery_city,
            "state":decryptedJsonResponse.delivery_state,
            "country":decryptedJsonResponse.delivery_country,
            "pincode":decryptedJsonResponse.delivery_zip
        }
        req.body.billing_address=obj1
        profileOps.getUserById(decryptedJsonResponse.merchant_param2, (error,user) => {
            console.log("iknowerror",user)
            console.log("iknowerror--->2",user.userId)

            req.body.userData=user
                    //  initOrder(req, res, user);
                    const config = require('../config/config');

                    var isValidType = false;
                    var isValidCoupon = true;
                    if(req.body.couponDiscount==undefined)
                    {
                req.body.couponDiscount = 0;
                    }
                   //  console.log("dicic",req.userData)
                    if(req.body.useCredits==true.toString())
                    {
                        const profileOps = require('../config/crudoperations/profile');
                
                        profileOps.getUserById(req.body.userData.userId, (error,user) => {
                            console.log("iknowerror",user)
                            req.body.credit=(user.credits*25)/100

                         });
                
                        // req.body.credit=req.userData.credits
                    }
                    else
                    {
                        req.body.credit=0
                    }
                   
                    if (req.body.voucher) {
                
                        isValidCoupon = validate.voucher(req.body.voucher);
                        console.log(isValidCoupon)
                    }
                
                    if (config.PAYMENT_OPTIONS.indexOf(req.body.type) > -1) {
                        isValidType = true;
                    }
                
                
                    if (isValidType && isValidCoupon) {
                        cashbackOps.findCashback("rpMYOm1N",(cashbackData)=>{
                            if(cashbackData){
                            
                                console.log("rohan",cashbackData)
                             var   cashbackPercentage=cashbackData.cashbackPercentage
                                req.body.cashbackPercentage=cashbackPercentage
                              var  cashbackAmount=cashbackData.cashbackAmount
                                req.body.cashbackAmount=cashbackAmount
                            }
                            else{
                              req.body.cashbackAmount=0
                              req.body.cashbackPercentage=0
                      
                            }  
                        })
                
                        initOrder(req, res, user);
                       }

         });
      
         res.writeHead(301,
           {Location: 'https://fitzigaroo.com/successorder'}
         );
         res.end();
       
    }
    else if (decryptedJsonResponse.order_status === 'Aborted') {
        // DO YOUR STUFF
        res.writeHead(301,
          {Location: 'https://fitzigaroo.com/cancelorder'}
        );
        res.end();
      
   }
  });
router.post('/api/execute-payment', function(req, res){
console.log('rjha',req.body)

		// console.log("sss",paymentResults)
		// res.json(paymentResults);
        const config = require('../config/config');

        var isValidType = false;
        var isValidCoupon = true;
        if(req.body.couponDiscount==undefined)
        {
    req.body.couponDiscount = 0;
        }
        
    
        if (req.body.voucher) {
    
            isValidCoupon = validate.voucher(req.body.voucher);
            console.log(isValidCoupon)
        }
    
        if (config.PAYMENT_OPTIONS.indexOf(req.body.type) > -1) {
            isValidType = true;
        }
    
    
        if (isValidType && isValidCoupon && req.userData.userInfo) {
    
            initOrder(req, res, req.userData);
        }
        else {
            res.json({ message: "unknown" });
        }
		// logger.info("User has approved the payment: " + JSON.stringify(paymentResults));
	
})
function createPayment(apiKey, apiSecret, redirectURL, paymentJSON, callback){
	console.log("sss",paymentJSON)
	if(apiKey && apiSecret){
		// Configure PayPal SDK
		paypal.configure({
			'mode': 'sandbox',
			'client_id':  "AS2JOhekdlepTqfe9BDFIQsU8cXje1-PZScjERMX5Uajvsq8zCuxQ126T9pVnVwPEspaXIuAdKHVMave",
			'client_secret': "EMqYYUIRs2jcgoDDl3RPfOiaDuYyJyQ_ZnmGkciX1aFidQw-Rlglmjh24u9Jvba7AGHReb83DMNoeX9A",
			'headers' : {
			'custom': 'header'
			}
		});

		paypal.payment.create(paymentJSON, function (error, payment) {
			if (error) {
				console.log("rohan",error)
				callback(error)
			} else {
				logger.info("Payment Created: " + JSON.stringify(payment));
				callback(payment)
			}
		});
	}
}

function executePayment(apiKey, apiSecret, payerId, paymentId, callback){
    // Configure PayPal SDK
    paypal.configure({
        'mode': 'sandbox',
        'client_id':  "AS2JOhekdlepTqfe9BDFIQsU8cXje1-PZScjERMX5Uajvsq8zCuxQ126T9pVnVwPEspaXIuAdKHVMave",
        'client_secret': "EMqYYUIRs2jcgoDDl3RPfOiaDuYyJyQ_ZnmGkciX1aFidQw-Rlglmjh24u9Jvba7AGHReb83DMNoeX9A",
        'headers' : {
        'custom': 'header'
        }
    });

    var execute_payment_json = { "payer_id": payerId	};

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log("rohan",error)
            logger.error('Error executing payment: ' + error.response);
            callback(error);
        } else {
            console.log("rohan",payment)
            logger.info("Payment executed: " + JSON.stringify(payment));
            callback(payment);
        }
    });
}

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
var initOrder = (request, response, userData) => {
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

                            //empty cart
                            var credits=result2.cashbackReceived-result2.creditsUsed
                            //empty cart
                            profileOps.emptyCart(userData.userId, () => { });
                            profileOps.updateProperty(userData.userId,credits, () => { })

                            //transfer credits
                            // const creditOps = require('../config/crudoperations/credits');
                            // creditOps.transferCredits(userData.userId, result2.orderId, result2.total, result2.creditsUsed, () => { });

                            var products = result.prdt;
                            var user = { useremail:userData.userEmail,fullName:userData.userInfo.firstName+userData.userInfo.lastName,mobile:userData.mobile, result2, products };
                //               var to = userdata.useremail;
                // // text = "Order return request for order Id " + userdata.orderId + " from " + userdata.useremail+" userId "+ userdata.userId;
                // var result = user.result2;
                // var text = "";
                // text = "Your Order " + result.orderId + " placed successfully. \n";
                // var products = user.products;
                // result.products.forEach((prdt, index) => {
                //  ]   console.log(index);
                //     text = text + `PrdtTitle ${prdt.title} + Price:${prdt.price} + Quantity ${prdt.quantity}\n`;

                // });
                // text = text + `Address: \n TO:${result.address.fullname} \n AREA:${result.address.area}\nCITY:${result.address.city}\nSTATE:${result.address.state}\nPINCODE:${result.address.pincode}\n\n`;

                // text = text + `Total Order Price is ${result.total}`;
                //             //send order successfull mail
                //             utils.sendSms("+917042890193",text)
                utils.createMail(user, "orderSuccessfull");
              
                     
                         
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



var createOrder = (request, userData, callback) => {

    var coupon = request.body.voucher;
    var couponDiscount = request.body.couponDiscount;
    var address=request.body.address;
    var billingaddress=request.body.address;

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
                            price: result2[productIndex].variants[variantIndex].price+result2[productIndex].variants[variantIndex].tax,
                            tax: result2[productIndex].variants[variantIndex].tax,
                            quantity: products[j].quantity,
                            variant1:products[j].variant1,
                            variantId:products[j].variantId,
                            variant2:products[j].variant2,
                            skucode:products[j].skucode,
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
                        var Tax=product2.tax
                        
                        tax+=product2.tax*product2.quantity
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

                    order.total = subTotal;
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
                 
                    order.deliveryCharges = config.DELIVERY_CHARGES;
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
    var billingaddress=request.body.billing_address;

    var cashbackAmount=0;
    var cashbackPercentage=0;
    const config = require('../config/config');
    const profileOps = require('../config/crudoperations/profile');
    profileOps.getUserById(userData.userId, (error, result) => {
        if (result && result.userId && result.buynow && result.buynow.length > 0) {
            var buynow = result.buynow;
            var products = [];
            var productIds = [];
            for (var i = 0; i < buynow.length; i++) {
                var product = {
                    productId: buynow[i].productId,
                    variantId: buynow[i].variantId,
                    quantity: buynow[i].quantity,
                    variant1:buynow[i].variant1,
                    variant2:buynow[i].variant2,
                    skucode:buynow[i].skucode,
                    price:buynow[i].price,
                    mrp:buynow[i].mrp
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
                        
                        // tax+=product2.tax*product2.quantity
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
                  
                    console.log("rohanjha",request.body.cashbackPercentage,request.body.cashbackAmount)
                    var  cashback
                    console.log("rohanjha",request.body.cashbackPercentage,request.body.cashbackAmount)
                   
                 
                    console.log("rjha",request.body.credit)
                       
                  
                    var credit
                          
                
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
                 
                    order.deliveryCharges = config.DELIVERY_CHARGES;
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
module.exports = router;



