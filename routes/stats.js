'use strict';

///Routing for index factory only calls

const express = require('express');
const router = express.Router();

const dbOperations = require("../config/crudoperations/stats");
const OrderOps = require("../config/crudoperations/orders");
const logger = require("../config/logger");
const validate = require("../config/validate");



const paymentTypes = require("../config/config").PAYMENT_OPTIONS;

router.post("/getOrders",function(request,response){
    logger.debug("routes stats getOrders");
    var isValidToDate = true
    var isValidFromDate = true

    if(isValidFromDate && isValidToDate) {
       
            var userData = request.userData;
            dbOperations.loadStats(request, (error,result)=>{
                if(error){
                    response.send({message:'fail'});
                }
                else{
                    var deliveredCount = 0;
                    var deliveredMoneyCount = 0;
                    var cancelledCount = 0;
                    var cancelledMoneyCount = 0;
                    var ongoingCount = 0;
                    var ongoingMoneyCount = 0;
                    var paymentOptions = {};
                    ///Data counting 
                    result.forEach(order => {
                        var trackStatus =  order.trackStatus;
                        var type = order.type;
                       if(trackStatus == "delivered"){
                            deliveredCount = deliveredCount + 1;
                            deliveredMoneyCount = deliveredMoneyCount + order.total;

                            paymentTypes.forEach(function(paymentType){
                                if(paymentType === type){
                                    paymentOptions[type] = paymentOptions[type]||0 + order.total; 
                                }

                            });
                       }
                       else if(trackStatus === "cancelled"){
                            cancelledCount = cancelledCount + 1;
                            cancelledMoneyCount = cancelledMoneyCount   + order.total;
                       }
                       else{
                            ongoingCount = ongoingCount + 1;
                            ongoingMoneyCount = ongoingMoneyCount   + order.total;
                       }




                    });

                    var delivered = {count:deliveredCount,money:deliveredMoneyCount};
                    var cancelled = {count:cancelledCount,money:cancelledMoneyCount};
                    var ongoing = {count:ongoingCount,money:ongoingMoneyCount};
                    console.log("Will Make stas query",request.body.fromDate,request.body.toDate);
                    dbOperations.loadOrdersStats(request,(error2,result2)=>{
                        console.log("Callback ans is",error2,result2);
                        if(error2){
                            response.send({message:'fail 2'});

                        }
                        else{
                            response.send({message:'success',paymentTypes:paymentOptions,delivered,cancelled,ongoing});

                        }
                    })

                    //response.send({message:'success',paymentTypes:paymentOptions,delivered,cancelled,ongoing});
                }
            });
        
    }
    else {
        response.json({ message: "unknown" });
    }

});
router.post('/filterOrders',function(request,response){
   OrderOps.loadQueryOrders(request,response)
})
router.post('/vendorFilterOrders',function(request,response){
    OrderOps.loadFilterOrders(request,response)
 })
router.post('/getUserOrder',function(request,response){
    logger.debug("routes stats getOrders");
     
            dbOperations.loadOrders(request, (error,result)=>{
                if(error){
                    response.send({message:'fail'});
                }
                else{
                    var deliveredCount = 0;
                    var deliveredMoneyCount = 0;
                    var cancelledCount = 0;
                    var cancelledMoneyCount = 0;
                    var ongoingCount = 0;
                    var ongoingMoneyCount = 0;
                    var paymentOptions = {};
                    ///Data counting 
                    result.forEach(order => {
                        var trackStatus =  order.trackStatus;
                        var type = order.type;
                       if(trackStatus == "delivered"){
                            deliveredCount = deliveredCount + 1;
                            deliveredMoneyCount = deliveredMoneyCount + order.total;

                            paymentTypes.forEach(function(paymentType){
                                if(paymentType === type){
                                    paymentOptions[type] = paymentOptions[type]||0 + order.total; 
                                }

                            });
                       }
                       else if(trackStatus === "cancelled"){
                            cancelledCount = cancelledCount + 1;
                            cancelledMoneyCount = cancelledMoneyCount   + order.total;
                       }
                       else{
                            ongoingCount = ongoingCount + 1;
                            ongoingMoneyCount = ongoingMoneyCount   + order.total;
                       }




                    });

                    var delivered = {count:deliveredCount,money:deliveredMoneyCount};
                    var cancelled = {count:cancelledCount,money:cancelledMoneyCount};
                    var ongoing = {count:ongoingCount,money:ongoingMoneyCount};
                    
                    dbOperations.loadOrdersStats(request,(error2,result2)=>{
                        console.log("CAllback ans is",error2,result2);
                        if(error2){
                            response.send({message:'fail 2'});

                        }
                        else{
                            console.log("\n\nDATA",result2);
                            response.send({message:'success',paymentTypes:paymentOptions,delivered,cancelled,ongoing});

                        }
                    })

                }
            });
        
        
})

module.exports = router;
