'use strict';

///Routing for index factory only calls

const express = require('express');
const router = express.Router();
const utils = require("../config/utils");
const dbOperations = require("../config/crudoperations/index");
const commonoperations = require("../config/crudoperations/commonoperations");
const logger = require("../config/logger");

const User = require('../config/schemas/userschema');
var async = require("async");
/* GET home page. */
router.get('/', function(req, res, next) {
    var path = require("path");
    var welcomePage = require("../config/pages");
    var newPath = path.normalize(__dirname+"/..");
    var homePagePath = path.join(newPath,welcomePage);
    res.sendFile(path.resolve(homePagePath));

});

///Check login Status
router.get('/webindex', function(request,response) {
    logger.debug('routes index webindex');
 
    dbOperations.checkSession(request,response,request.userData);
           
});

///Send email activation link
router.get('/sendActivationLink',function(request,response){
    logger.debug('routes index sendActivationLink');

    dbOperations.sendActivationLink(request,response);
});
router.get('/activateEmail',function(request,response){
    logger.debug('routes index sendActivationLink');
  
    commonoperations.checkToken(request.query,response);
});

///Send email activation link
router.post('/sendEmailActivationLink',function(request,response){
    logger.debug('routes index sendActivationLink');
    User.findOne(
        {
          userEmail: request.body.userEmail,
        },
        function (error, result) {
          if (error) {
            logger.error(error);
            utils.response(response, 'fail');
          } else {
            logger.debug('crud result');
            if (result != undefined) {
              utils.response(
                response,
                'taken',
                'email already taken'
              );
            } else {
            //   that.addUser2(request, response);
            dbOperations.sendActivationLink(request,response);
            }
        }
        })
  
});

///Logging out
router.get('/logout',function(request,response){
    logger.debug('routes index logout');
    dbOperations.destroySession(request,response);
});
var stack = {};
var checkData1 = function(callback){
    callback(null,'raj');
}
var checkData2 = function(callback){
    callback(null,'shyam');
}


router.get('/get',function(req,res){
    console.log("hey");
    async.series([
    checkData1,
    checkData2
    ],function(err,result){
        res.send(result);
    });
})

// using celebrate
// const { celebrate, Joi, errors } = require('celebrate');
// ////User registration
// router.post('/registerUser',celebrate({
//     body: Joi.object().keys({
//       userEmail: Joi.string().required(),
//       username: Joi.string().required(),
//       role: Joi.string().default('admin')
//     })}),function(request,response){

    // username: Joi.string().alphanum().min(3).max(30).required(),
    // password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    // access_token: [Joi.string(), Joi.number()],
    // birthyear: Joi.number().integer().min(1900).max(2013),
    // email: Joi.string().email({ minDomainAtoms: 2 })
module.exports = router;
