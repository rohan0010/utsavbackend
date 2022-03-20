const express = require('express');
const router = express.Router();
const utils = require("../config/utils");
const dbOperations = require("../config/crudoperations/cmscrud");
const validate = require("../config/validate");
const logger = require("../config/logger");
const async = require("async");

router.post('/cms', function (request, response) {


    var Obj = request.body;


    dbOperations.findabout(request.body.cmsid, res2 => {

        if (
            res2 != null
        ) {

            dbOperations.updateabout(Obj, response)
        }
        else {
            dbOperations.createabout(Obj, response)
        }
    });






});















router.post('/getcms', function (request, response) {
    var obj = request.body;

    dbOperations.getcms(obj, response
    )


})






module.exports = router;



