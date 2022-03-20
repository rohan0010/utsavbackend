const express = require('express');
const router = express.Router();
const utils = require("../config/utils");
const dbOperations = require("../config/crudoperations/categorycrud");
const validate = require("../config/validate");
const logger = require("../config/logger");
const async = require("async");

router.post('/createCategory', function (request, response) {
    
        logger.debug('routes create category');
    
        var Obj = request.body;
  
   
      dbOperations.findcategory(request, res2 => {
        
          if (
            res2!=null
          ) {
            
            response.json({ code: 422, success: false, message: "category-already-exists" });
          }
         else {
           console.log("1")
            dbOperations.createcategory(Obj,response)
        }
      });
     
   




});

router.post('/updateCategory', function (request, response) {
    
  logger.debug('routes create category');

  var Obj = request.body;


dbOperations.findcategory(request, res2 => {
  
    if (
      res2!=null
    ) {
      
      // response.json({ code: 422, success: false, message: "category-already-exists-with-this-name" });
      dbOperations.updatecategory(Obj,response)

    }
   else {
     console.log("1")
      dbOperations.updatecategory(Obj,response)
  }
});






});

router.post('/updatesubCategory', function (request, response) {
    
  logger.debug('routes create category');

  var Obj = request.body;


dbOperations.findsubCategoryByName(request, res2 => {
  
    if (
      res2!=null
    ) {
      
      // response.json({ code: 422, success: false, message: "sub-category-already-exists-with-this-name" });
      dbOperations.updatesubcategory(Obj,response)

    }
   else {
      dbOperations.updatesubcategory(Obj,response)
  }
});






});
router.post('/createsubCategory', function (request, response) {
    
  logger.debug('routes create sub category');

  var Obj = request.body;
  async.waterfall([
    function (callback) {
     
        dbOperations.findcategoryparent(request, (res) => {
          if(res==null) {
            response.json({  code: 404, success: false, message: "parent-category-not-found" }); 
          }
          else if (res.subcategory.length==0) {
            console.log("1")
            
            dbOperations.nextcategory( Obj,response,Obj.parent);
            }
            else if(res.subcategory.length>0)
            {
              callback(null, res.subcategory); 
            }
           
        })
    },
    function (subcategory, callback) {
        dbOperations.findifcategoryexists(request,subcategory,res=>{
        
          if(res!=null)
          {
            dbOperations.nextcategory( Obj,response,Obj.parent);

          //  
            // response.json({code: 422, success: false, message: "sub-category-already-exists" }); 
          }
          else if(res==null)
          {
            dbOperations.nextcategory( Obj,response,Obj.parent);
          }
        })
    },
   

], function (err, res) {
    if (err) {
        utils.response(response, 'fail');
    }
    else {
        response.send({
            message: res,
            code: 200,
            success: true
        });
    }
})

});

router.post("/loadSortedCategory", function(request, response) {
  if (request.body.type === "search" && !request.userData) {
    var userData = {};
    dbOperations.loadSortedCategories(request, response, userData);
  } else {
    var userData = request.userData;
    dbOperations.loadSortedCategories(request, response, userData);
  }
});

router.post('/getcategory',function(request,response){
    var obj=request.body;
   
    dbOperations.getcategory(obj, response
    )

      
})
router.post('/countcategory',function(request,response){
  var obj=request.body;
 
  dbOperations.countcategory(obj, response
  )

    
})
 

router.post('/getinactivecategory',function(request,response){
  var obj=request.body;
 
  dbOperations.getinactivecategory(obj, response
  )

    
})
router.post('/getCategorybyid',function(request,response){

  dbOperations.findcategorybyId(request,response)
    
          

 
            
})
 
router.post('/getMegaMenu',function(request,response){

    dbOperations.findcategorybyid(request,response)
      
            
 
   
              
})
router.post('/getsubcategory',function(request,response){
 
    dbOperations.findsubcategorybyid(request,response)
      
            
 
   
              
})
module.exports = router;



