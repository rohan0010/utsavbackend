'use strict';

const Orders = require("../schemas/orderschema");
const logger = require("../logger");
const utils =require("../utils");
const Products = require("../schemas/productschema");
const { request } = require("../..");
const dbOperations={

    createOrder:function (data, callback){
        logger.debug('crud order createOrder');
      console.log("ss",data)
        Orders.create(data,
        function(error,result){
            if(error){
                logger.debug(error);
                callback(error,null);
            }
            else{
                callback(null,result);
            }
        });

    },

    updateStatus:function (Query, status, callback){
        logger.debug('crud order updateStatus');
         console.log("rj",Query)
        Orders.findOneAndUpdate(Query,{
            "$set":{"trackStatus":status}
        },
        { new: true },
        function(error,result){
            if(error){
                console.log("rj",error)
                logger.debug(error);
                callback(error,null);
            }
            else{
                callback(null,result);
            }
        });

    },
    updateStatus1:function (Query, status, callback){
        logger.debug('crud order updateStatus');

        Orders.findOneAndUpdate(Query,{
            "$set":{"products.$.trackStatus":status}
        },
        { new: true },
        function(error,result){
            if(error){
                console.log("rj",error)
                logger.debug(error);
                callback(error,null);
            }
            else{
                callback(null,result);
            }
        });

    },
    updateProperty: function (orderid, url, callback) {
        logger.debug('crud productcrud updateProperty');

        Orders.update({
            "orderId": orderid
        }, {
                $set: {
                    invoiceUrl:url
                }
            },
            function (error, result) {
                if (error) {
                    logger.error(error);
                }
                else {
                    logger.debug('crud result' + result);
                    callback();
                }
            });
    },

    returnOrder:function (request,response){
        logger.debug('crud order updateStatus');

        Orders.update(  {
            orderId: request.body.orderId,
            products: {
              $elemMatch: {
                productId: request.body.productId,
                variantId: request.body.variantId
              }
            }
          },
          { $set: { "products.$.returnStatus": "pending",
          "products.$.isReturn": true } },
        function(error,result){
            if(error){
                logger.debug(error);
                console.log("rj",error)
                utils.response(response,"fail");
            }
            else{
                response.json({ message: "success" });
            }
        });

    },
    changeReturnOrderStatus:function (request,response){
        logger.debug('crud order updateStatus');
        var status=true;
        if(request.body.status=="cancelled")
        {
            status=false;
        }
        Orders.update(  {
            orderId: request.body.orderId,
            products: {
              $elemMatch: {
                productId: request.body.productId,
                variantId: request.body.variantId
              }
            }
          },
          { $set: { "products.$.returnStatus": request.body.status,
          "products.$.isReturn": status } },
        function(error,result){
            if(error){
                logger.debug(error);
                utils.response(response,"fail");
            }
            else{
                response.json({ message: "success" });
            }
        });

    },

    getOrderById:function (id, callback){
        logger.debug('crud order getOrderByid');

        Orders.findOne(
            {
                orderId:id
            },
        function(error,result){
            if(error){
                logger.debug(error);
                callback(error,null);
            }
            else{
                callback(null,result);
            }
        });

    },
    getOrderById99:function (request, callback){
        logger.debug('crud order getOrderByid');

        Orders.findOne
            (  {
                orderId: request.body.orderId,
                products: {
                  $elemMatch: {
                    productId: request.body.productId,
                    variantId: request.body.variantId
                  }
                }
              },
        function(error,result){
            if(error){
                logger.debug(error);
                callback(error,null);
            }
            else{
                callback(null,result);
            }
        });

    },
    getOrderById2: function (id, callback) {
        logger.debug('crud order getOrderById2');



        Orders.findOne({
            orderId: id
        },
            function (error, result) {
                if (error) {
                    logger.debug(error);
                    callback(error, null);
                }
                else if (result === null) {
                    logger.debug(' crudoperations odrers getOrderById Null Result', result);
                    callback(null, null);
                }
                else {
                    logger.debug(' crudoperations odrers getOrderById Result', result);


                    var prdIdArray = result.products.map(prdt => prdt.productId.toString());

                    Products.find({ productId: { $in: prdIdArray } }, { title: true, imageUrls: true, productId: true },

                        function (error, products) {
                            if (error) {
                                callback(error, null);
                            }
                            else if (products && products.length > 0) {
                                var modifiedResult = { result: result, products: products };
                                logger.debug(' crudoperations odrers getOrderById fetching products info', result);

                                callback(null, modifiedResult);


                            }
                            else {
                                logger.debug(' crudoperations odrers getOrderById fetching products info failed result is', result);

                                callback(null, null);
                            }
                        })

                }
            });


    },

    // /////Load Orders
    // loadOrders: function (request, response, userData) {
    //     logger.debug('crud ordercrud Orders');

    //     var type = request.body.type || "search";
    //     var filters = request.body.filters || {};
    //     var count = request.body.count || 0;
    //     var fields = request.body.fields || 'min';

    //     var Query = {};


    //     if (type === "search") {
    //         request.body.hasFilters = false;
    //         Object.keys(filters).forEach(function (key) {  //only checks whether atleast a single filter exists or not
    //             if (filters[key] != "") {
    //                 request.body.hasFilters = true;
    //             }
    //         });

    //         if (request.body.hasFilters === true) {
    //             Object.keys(filters).forEach(function (key) {
    //                 if (filters[key]) {
    //                     filters[key] = filters[key].replace(/ /g, '');
    //                     Query[key] = { $regex: filters[key], $options: "$i" };
    //                 }
    //             });
    //         }
    //     }

    //     var Fields = {
    //         '_id': false
    //     };
    //     if (fields === 'max') {
    //         Fields = {};
    //     }
    //     else if (fields === 'super' && userData.userEmail && (userData.role === 'admin')) {
    //         Fields = {};
    //     }
    //     Products
    //         .find(Query, Fields)
    //         .limit(count + 10)
    //         .exec(function (error, result) {
    //             if (error) {
    //                 logger.error(error);
    //             }
    //             else {
    //                 logger.debug('crud result' + result);
    //                 if (result.length < 1) {
    //                     response.json({ message: "none" });
    //                 }
    //                 else {
    //                     var ten = result.slice(count, count + 10);
    //                     for(var i=0;i<ten.length;i++){
    //                         ten[i].likedBy[0] = ten[i].likedBy.length;
    //                     }
    //                     response.send(ten);
    //                 }
    //             }
    //         });
    // },

    loadMyOrders:function (request,response,userId){
        Orders.find({ orderedBy: userId},{
            orderId:true,
            products:true,
            type:true,
            total:true,
            totaltax:true,
            address:true,
            billing_address:true,
            paymentMode:true,
            invoiceUrl:true,
            creditsUsed:true,
            totaldiscount:true,
            orderedDate:true,
            grandTotal:true,
            trackStatus:true,
            deliveryCharges:true
        },
        function(error,result){
            if(error){
                logger.debug(error);
                response.json({error:"error"})
            }
            else{
                logger.debug("crud result",result);
                response.json(result);
            }
        })
    },
   loadpendingorders:function(request,response)
   {
    Orders.find
    ({
        // productId:request.body.productId , variants: {$elemMatch: {id:request.body.variantId}
    "products.isReturn": true
}, function (error, result) {
    if (error) {
        console.log("error",error)
        logger.debug(error);
       utils.response(response,'fail')
    }
    else {
        console.log("nkngdnkjdnkj",result)
      response.send(result)
    }
});
   },
   loadFilterOrders:function(request,response,callback){

       

    var Query = {};


    var type = request.body.type || "search";
    var filters = request.body.filters || {};
    var sortBy = request.body.sortBy || {};

    var count = request.body.count || 0;
    var limit = request.body.limit || 10;
    var fields = request.body.fields || "min";

    var Query = {};
   
    // if (sortBy.type === 'postDate' && (sortBy.order === 1 || sortBy.order === -1)){
    //     SortQuery[sortBy.type] = sortBy.order;
    // }
    // if(sortBy.type === 'numberOfSells' && (sortBy.order === 1 || sortBy.order === -1)){
    //     SortQuery[sortBy.type] = sortBy.order;
    // }
    // if(sortBy.type === 'price' && (sortBy.order === 1 || sortBy.order === -1)){
    //     SortQuery[sortBy.type] = sortBy.order;
    // }
 if (type === "search") {
      request.body.hasFilters = false;
      Object.keys(filters).forEach(function(key) {
        //only checks whether atleast a single filter exists or not
        if (filters[key] != "") {
          request.body.hasFilters = true;
        }
      });

      if (request.body.hasFilters === true) {
        Object.keys(filters).forEach(function(key) {
          if (filters[key] && key === "search") {
            var regex = { $regex: filters[key], $options: "$i" };
            Query["$or"] = [
              { userId: regex },
              { userEmail: regex },
              { username: regex }
            ];
          } else if (filters[key]) {
            filters[key] = filters[key];
            Query[key] = { $regex: filters[key], $options: "$i" };
          }
        });
      }
    }

    var Fields = {
      userId: true,
      username: true,
      userEmail:true,
      userInfo:true
    };
    if (fields === "max") {
      Fields = {
        userId: false,
        username: false
      };
    } else if (
      fields === "super" &&
      userData.userEmail &&
      userData.role === "admin"
    ) {
      Fields = {};
    }

    // var count = request.body.count || 0;

    var trackStatus = request.body.trackStatus;
    
    var startDate = request.body.startDate;
    var endDate = request.body.endDate;
    var orderByDate = request.body.orderedBy || -1;

    var VALID_STATUS = require('../config').VALID_STATUS;


    




    if(trackStatus && VALID_STATUS.includes(trackStatus)){
        Query.trackStatus = trackStatus;
    }

    if(startDate){
        Query.orderedDate =  { $gte: startDate };
    }

    
    if(endDate){
        Query.orderedDate =  { ...Query.orderedDate, $lte: endDate };
    }
  





    Orders.find(Query)
        .skip(count)
        .limit(limit)
        .sort({orderedDate:orderByDate})
        .exec(function(error,results){
            if(error){
                
                utils.response(response, "fail");
                
            }
            else{
                response.send({
                    results,
                     code: 200,
                     success: true
                 });
                // callback(null,results)
                
            } 

    });

},

    //Load Order based on admin query

    loadQueryOrders:function(request,response,callback){

       

        var Query = {};



        var count = request.body.count || 0;

        var trackStatus = request.body.trackStatus;
        
        var startDate = request.body.startDate;
        var endDate = request.body.endDate;
        var orderByDate = request.body.orderedBy || -1;

        var VALID_STATUS = require('../config').VALID_STATUS;


        




        if(trackStatus && VALID_STATUS.includes(trackStatus)){
            Query.trackStatus = trackStatus;
        }

        if(startDate){
            Query.orderedDate =  { $gte: startDate };
        }

        
        if(endDate){
            Query.orderedDate =  { ...Query.orderedDate, $lte: endDate };
        }
      





        Orders.find(Query)
            .skip(count)
            .limit(10)
            .sort({orderedDate:orderByDate})
            .exec(function(error,results){
                if(error){
                    
                    utils.response(response, "fail");
                    
                }
                else{
                    response.send({
                        results,
                         code: 200,
                         success: true
                     });
                    // callback(null,results)
                    
                } 

        });

    }




}












module.exports =dbOperations;