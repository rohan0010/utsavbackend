'use strict';

const categories = require("../schemas/newschema");
const logger = require("../logger");
const utils = require("../utils");
const app = require("../..");
const { response } = require("express");
var slug = require('slug')
var slugify = require('slugify')
const dbOperations = {
   
   
    updatecategory:function(obj,response) {
       var Query={
        "description":obj.description,
        "imageUrls" : obj.imageUrls,
         
        "categoryname" : obj.categoryname.toLowerCase(),
        "slug":slug(obj.categoryname.toString()),
      
                "active":obj.active
       }
                                    categories.update({
                                        "categoryid":obj.categoryid,
                                        "categorytype":"cat"
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
 
     
    updatesubcategory:function(obj,response) {
        var Query={
         "description":obj.description,
         "imageUrls" : obj.imageUrls,
         "categoryname" : obj.categoryname.toLowerCase(),
         "slug":slug(obj.categoryname.toString()),
       

         "active":obj.active,
        }
                                     categories.update({
                                         "categoryid":obj.categoryid,
                                         "categorytype":"subcat"
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
    nextcategory:function(obj,response,parent) {
        logger.debug('crud levelcrud loadAllLevels');

        var apple = {};
        apple.categoryid = utils.randomStringGenerate(32);
        apple.categorytype= "subcat";
        apple.categoryname = obj.categoryname.toLowerCase();
        apple.slug=slug(obj.categoryname.toString())
        apple.imageUrls = obj.imageUrls;
        apple.active=obj.active;
        apple.description=obj.description;
        if(obj.priority)
        {
            apple.priority=obj.priority
        }
        else
        {
            apple.priority=1000
        }
        if(obj.delivery)
        {
            apple.delivery=obj.delivery
        }
        else
        {
            apple.delivery=15
        }
        
        categories.create(apple, function (error, result) {
            if (error) {
                logger.error(error);
                console.log("rohan",error)
                utils.response(response, "fail");
            }
            else {
                logger.debug('crud result' + result);
                console.log("rohanjjj",result)
            
          
                categories.findOne({"categoryid":parent,"categorytype":"cat"},function(error,result1){
                    if(error){
                        logger.error(error);
                        console.log("rjjj",error)
                        // callback(null);
                    }
                    else{
                        if(result1.subcategory.length==0)
                        {
                              var ancestors = [];
                       
                        ancestors.push(result.id)
                        }
                        // var ancestors = [];
                       
                        // ancestors.push(result.categoryid)
                        console.log("dd",result1.subcategory)
                        if(result1.subcategory.length>0)
                        {
                           
                            var ancestors=result1.subcategory
                            ancestors.push(result.id)
                         
                        }      
                        var Query = {
                            subcategory: ancestors,
                            
                        }
                        categories.update({
                            "categoryid": parent
                        },
                            {
                                $set: Query
                            }
                            , function (error, result) {
                                if (error) {
                                    console.log("Ddddddc",error)
                                    logger.error(error);
                                }
                                else {
                                    response.json({  success: true,message: "success" , code: 200 });
                                    logger.debug('crud result' + result);
                                }
                            });    
                    }
                });
             
                         
                           
            }
        });
    },
    loadSortedCategories: function (request, response, userData) {
        logger.debug('crud productcrud loadProducts');

        var type = request.body.type || "search";
        var filters = request.body.filters || {};
        var sortBy = request.body.sortBy || {};
        var limit=request.body.limit;
        var count = request.body.count || 0;
        var fields = request.body.fields || 'min';

        var Query = {};
        var SortQuery = { 'showPriority': -1 };
    
        if(sortBy.type === 'priority' && (sortBy.order === 1 || sortBy.order === -1)){
            SortQuery[sortBy.type] = sortBy.order;
        }
     
        if (userData && userData.role !== 'admin') {
            Query["verified"] = { $ne: false };
        }

        else if (type === "search") {
            request.body.hasFilters = false;
            Object.keys(filters).forEach(function (key) {  //only checks whether atleast a single filter exists or not
                if (filters[key] != "") {
                    request.body.hasFilters = true;
                }
            });

            if (request.body.hasFilters === true) {
                Object.keys(filters).forEach(function (key) {
                    if (filters[key] && key === "search") {
                        var regex = { $regex: filters[key], $options: "$i" }
                        Query["$or"] = [ { "categoryname": regex },
                        { "categorytype": regex }, { "slug": regex }, { "active": regex }];
                    }
                   
                    else if (filters[key]) {
                        console.log("rohan",key)
                        if(key==="active")
                        {
                            Query["active"] = { $ne:  !filters[key] };
                        }
                        else{

                       
                        filters[key] = filters[key];
                        Query[key] = { $regex: filters[key], $options: "$i" };
                    }
                        console.log("rj",key)
                    }
                 
                });
            }
        }

        var Fields = {
            '_id': false,
            'categoryid': true,
            'categoryname': true,
            'subtext': true,
            'categorytype': true,
            'description': true,
            'priority': true,
            "imageUrls":true,
            "slug": true,
            "active": true,
            "parent": true,
            "subcategory":true

        };
        if (fields === 'max') {
            Fields = {
                _id: false,
               
            }
        }
        else if (fields === 'super' && userData.userEmail && (userData.role === 'admin')) {
            Fields = {};
        }
        // Query["active"] = { $ne: false };
        console.log("sss",Query)
     
        categories
            .find(Query)
            .sort(SortQuery)
            .skip(0)
            .limit(8)
       
            .exec(function (error, result) {
                if (error) {
                    logger.error(error);
                }
                else {
                    logger.debug('crud result' + result);
                    if (result.length < 1) {
                        response.json({ message: "none" });
                    }
                    else {
                        var ten = result;
                   
                        response.send(ten);
                    }
                }
            });
    },
    addsubCategory:function(obj,id,response){

        categories.findOne({"categoryid":obj.parent,"categorytype":"cat"},function(error,result1){
            if(error){
                logger.error(error);
                console.log("rjjj",error)
                // callback(null);
            }
            else{
                if(result1.subcategory.length==0)
                {
                      var ancestors = [];
               
                ancestors.push(id)
                }
                // var ancestors = [];
               
                // ancestors.push(result.categoryid)
                console.log("dd",result1.subcategory)
                if(result1.subcategory.length>0)
                {
                   
                    var ancestors=result1.subcategory
                    ancestors.push(id)
                 
                }      
                var Query = {
                    subcategory: ancestors,
                    
                }
                categories.update({
                    "categoryid": obj.parent
                },
                    {
                        $set: Query
                    }
                    , function (error, result) {
                        if (error) {
                            console.log("Ddddddc",error)
                            logger.error(error);
                        }
                        else {
                            response.json({  success: true,message: "success" , code: 200 });
                            logger.debug('crud result' + result);
                        }
                    });    
            }
        });
    },
    createcategory:function(obj,response) {
        logger.debug('crud levelcrud loadAllLevels');
        console.log("fffff",slugify(obj.categoryname.toString())
        )
        var apple = {};
        apple.categoryid = utils.randomStringGenerate(32);
        apple.categorytype= "cat";
        apple.categoryname = obj.categoryname.toLowerCase();
        apple.imageUrls = obj.imageUrls;
        apple.slug=slug(obj.categoryname.toString())
        apple.description=obj.description;
        apple.active=obj.active;
        if(obj.priority)
        {
            apple.priority=obj.priority
        }
        else
        {
            apple.priority=1000
        }
        if(obj.delivery)
        {
            apple.delivery=obj.delivery
        }
        else
        {
            apple.delivery=15
        }
        categories.create(apple, function (error, result) {
            if (error) {
                logger.error(error);
               
                utils.response(response, "fail");
            }
            else {
                logger.debug('crud result' + result);
                console.log(result)
                response.json({   success: true,message: "success" , code: 200});
          
               
                         
                           
            }
        });
    },
    getcategoriesWithParents: function (id, callback) {
        logger.debug('crud profile getcategoriesWithParents');

       categories.findOne({id:id})
            .populate("subcategory")
            .exec(function (error, result) {
                if (error) {
                    logger.error(error);
                    callback(error,null);
                }
                else {
                    logger.debug('crud result' + result);
                    callback(null,result);
                }
        
            });
    },
    // checkAndFindParents: function (request,response) {
    //     var that = this;
    //    console.log("iamhere")
    //     categories.findOne({
    //         categoryid: request.parent
    //     },(err,res)=>{
    //         if(err){
    //             utils.response(response,'fail'); 
    //             console.log("rohan",err)
    //         }
    //         else if(res){
    //             console.log("piyush",res)
    //             if(res ){
    //               console.log("bhfvf",res.id)
    //                 // categories.find({
    //                 //     _id:res.id
    //                 // },(err1,res1)=>{
    //                 //     if(err1){
    //                 //         console.log("ndjcjkjnkv",err1)
    //                 //         utils.response(response,'fail'); 
    //                 //     }
    //                     // else if(res1 && res1.length ){
    //                     //     console.log("nkjvjjvfnjfv",res1)
    //                         var ancestors = [res.id];
    //                         if(res.ancestors && ancestors.length > 0){
    //                             ancestors= [...res.ancestors, res._id];
    //                         }
    //                         categories.update
    //                         that.createcategory(request, response, res._id , ancestors);
    //                     }   
    //                     // else{
    //                     //     utils.response(response,'fail'); 
    //                     // }
    //                 // })
                
    //         }
    //         else{
    //             utils.response(response,"notFound");
    //         }
    //     })
        
    // },
    findCategoryByName:function(request,callback){
     categories.find({
    //   categoryname:'nutrients',
    //   categorytype:'cat'
     }),function(error,result){
        if (error) {
            console.log("xx",error)
            logger.error(error,null);
        }
        else {
            console.log("xx",result)
            logger.debug('crud result' + result);
           callback(result);

    //  response.send(result)
        }
     }
    },
    findsubCategoryByName:function(request,callback){
        
        categories.findOne({
            categoryname:request.body.categoryname.toLowerCase(),
            categorytype:"subcat"
        },
            function (error, result) {
                if (error) {
                    console.log("sss",error)
                    logger.error(error,null);
                }
                else {
                    console.log("sss",result)
                    logger.debug('crud result' + result);
                   callback(result);

             // response.send(result)
                }
            });
       },
    getcategory:function(request,response){

        categories.find({
            "categorytype":"cat"
        },
            function (error, result) {
                if (error) {
                    utils.response(response, 'fail');
                    logger.error(error,null);
                }
                else {
                    logger.debug('crud result' + result);
                //    callback(result);
                response.send({
                   result,
                    code: 200,
                    success: true
                });
            //   response.send(result)
                }
            });
    },
    countcategory:function(request,response){

        categories.find({
            "categorytype":"cat",
            "active":true
        },
            function (error, result) {
                if (error) {
                    utils.response(response, 'fail');
                    logger.error(error,null);
                }
                else {
                    logger.debug('crud result' + result);
                //    callback(result);
                var count=result.length
                response.send({
                   count,
                    code: 200,
                    success: true
                });
            //   response.send(result)
                }
            });
    },
    getinactivecategory:function(request,response){

        categories.find({
            "categorytype":"cat",
            "active":false
        },
            function (error, result) {
                if (error) {
                    utils.response(response, 'fail');
                    logger.error(error,null);
                }
                else {
                    logger.debug('crud result' + result);
                //    callback(result);
                response.send({
                   result,
                    code: 200,
                    success: true
                });
            //   response.send(result)
                }
            });
    },
    findcategory:function(request,callback){
      
        categories.findOne({
            categoryname:request.body.categoryname.toLowerCase(),
            categorytype:"cat"
        },
            function (error, result) {
                if (error) {
                    console.log("sss",error)
                    logger.error(error,null);
                }
                else {
                    console.log("sss",result)
                    logger.debug('crud result' + result);
                   callback(result);

             // response.send(result)
                }
            });
    },
    findcategorybyid:function(request,response){
        categories.find({"categorytype":"cat",
    "active":true})
        .populate("subcategory")
        .exec(function (error, result) {
            if (error) {
                logger.error(error);
                utils.response(response, 'fail');
            }
            else {
                logger.debug('crud result' + result);
                // callback(null,result);
                response.send({
                    result,
                     code: 200,
                     success: true
                 });
                // console.log("rj",result)
            }
    
        });
     
    },
    findsubcategorybyid:function(request,response){
        categories.find({"categorytype":"cat",
    "categoryid":request.body.categoryid})
        .populate("subcategory")
        .exec(function (error, result) {
            if (error) {
                logger.error(error);
                utils.response(response, 'fail');
            }
            else {
                logger.debug('crud result' + result);
                // callback(null,result);
                response.send({
                    result,
                     code: 200,
                     success: true
                 });
                // console.log("rj",result)
            }
    
        });
     
    },
    findcategoryparent:function(request,callback){

        categories.findOne({
            categoryid:request.body.parent,
            categorytype:"cat"
        },
            function (error, result) {
                if (error) {
                    logger.error(error,null);
                }
                else {
                    logger.debug('crud result' + result);
                   callback(result);

             // response.send(result)
                }
            });
    },
    findcategorysub:function(request,callback){

        categories.findOne({
            categoryname:request.body.categoryname,
            categorytype:"subcat"
        },
            function (error, result) {
                if (error) {
                    logger.error(error,null);
                }
                else {
                    logger.debug('crud result' + result);
                   callback(result);

             // response.send(result)
                }
            });
    },
    findcategorybyId:function(request,response){

        categories.findOne({
            categoryid:request.body.categoryid
        },
            function (error, result) {
                if (error) {
                    logger.error(error,null);
                    utils.response(response, 'fail');
                }
                else {
                    logger.debug('crud result' + result);
                    response.send({
                        result,
                         code: 200,
                         success: true
                     });

             // response.send(result)
                }
            });
    },
    findsubCategory:function(request,callback){

        categories.find({
            _id: { $in: request }
        },
            function (error, result) {
                if (error) {
                    console.log("dd",error)
                    logger.error(error,null);
                }
                else {
                    // console.log("dd",result)
                    logger.debug('crud result' + result);
                   callback(result);

            //  response.send(result)
                }
            });
    },
    findifcategoryexists:function(request,subcategory,callback){

        categories.findOne({
            _id: { $in: subcategory },
           categoryname:request.body.categoryname.toLowerCase()
        },
            function (error, result) {
                if (error) {
                    console.log("dd",error)
                    logger.error(error,null);
                }
                else {
                    // console.log("dd",result)
                    logger.debug('crud result' + result);
                   callback(result);

            //  response.send(result)
                }
            });
    }
            


}






module.exports = dbOperations;