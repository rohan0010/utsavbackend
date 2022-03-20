'use strict';

const Order = require("../schemas/orderschema");
const User = require("../schemas/userschema");
const logger = require("../logger");


const dbOperations={

   loadStats : function(request,callback){
        Order.find({
            orderedDate: {
                $gte:request.body.fromDate,
                $lte:request.body.toDate
            }
        },function(error,result) {
                if(error){
                    logger.debug(error);
                    callback(error,null)
                }
                else{
                    callback(null,result);
                }
            });

        
   },

   loadOrders:function(request,callback){
        logger.debug('crud stats loadOrders');
         

        Order.find({
            orderedBy:request.body.userId,
            orderedDate: {
                $gte:request.body.fromDate,
                $lte:request.body.toDate
            }
        },
        function(error,result){
                if(error){
                    logger.debug(error);
                    callback(error,null)
                }
                else{
                    callback(null,result);
                }
        });
   },
   loadOrdersStats:function(request,callback){
    //    console.log("loadOrdesStats => =>",request.body.fromDate,request.body.toDate);
    //     Order.aggregate(
            // [
           
            //    {
            //         "$match":{
            //             "orderedDate":{"$lte":request.body.toDate,"$gte":request.body.fromDate}   
            //         }

            //    },
            //    {
            //         "$group": {
            //             "_id": {
            //                 "$month":"orderedDate"
            //             },
            //             "totalSoldInMonth": { "$sum": "$total" },
            //             "count": { "$sum": 1 }
            //         }
            //    },
               
            // ],
          
           
    //     )
    //     .cursor({batchSize: 2500, async: true})
    //     // .allowDiskUse(true)
    //     .exec(function(error,result){
    //         console.log("EXEC",error,result)
    //         result.forEach(function(err, doc) {
    //             if (err) throw err;
    //             if (doc) console.log(data) // dispatching doc to async.queue
    //           });
    //         // if(error){
    //         //     callback(error,null);
    //         // }
    //         // else{
    //         //     callback(null,result);
    //         // }
    //    });

    // Order.aggregate([
    //     { "$match": { "oderId": "dQTpH9uLg6bQzEow" } }],
    //     {cursor:{ batchSize: 2500, async: true }},
    //     function( err, cursor ) {
      
    //       if ( err )
    //         console.log(err);
      
    //       console.log("data is: ",cursor );
      
    //     }
    // )
    // 2018-08-16T09:33:06.177Z
    // 2018-07-02 12:35:09.589 
//    var pipeline = [{ $match: { orderId : "dQTpH9uLg6bQzEow"} }];
var toDate = new Date(request.body.toDate)
var fromDate = new Date(request.body.fromDate)


var pipeline =  [
           
    // {
    //      $match:{
             
    //         orderedDate:{
    //             // $lte:toDate,
    //             // $gte:fromDate
    //             $lte:{
    //                 $dateFromString:{dateString:toDate.toString()}
                    
    //             },
    //             $gte:{
    //                 $dateFromString:{dateString:fromDate.toString()}
    //              }
    //         }
         
    //     }

    // },
    {
         $group: {
             _id: {
                 "month":{
                     $month:"$orderedDate"
                },
                 "year":{
                    $year:"$orderedDate"
                 }
             },
             totalSoldInMonth: { $sum: "$total" },
             count: { $sum: 1 }
         }
    }
    
 ];

// console.log(pipeline);
//Mukul changes
// Order.aggregate(pipeline).cursor({ batchSize: 1000, async: true }).exec(function(error, cursor) {
//         console.log(cursor.hasNext().then(data=>console.log(data),err=>console.log(err)));
//   });


Order.aggregate(pipeline).then(data=>{
    if(!data){
        callback(null,null);
    }
    else{
        callback(null, data);
    }
},err=>{
    callback(err,null);
})


//     Order.aggregate(pipeline).exec(function(err,res){
//         console.log(res);
//     })
    
    // Order.aggregate([
    //     { "$match": { "oderId": "dQTpH9uLg6bQzEow"} },
    // ]).cursor({ batchSize: 2500, async: true }).exec((err, locations) => {
    //     if (err) throw err;
    //     console.log(locations);
    // });

}   

};

module.exports =dbOperations;