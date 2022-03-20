'use strict';

//Routing for myorders factory


const express = require('express');
const router = express.Router();
const validate = require("../config/validate");
const logger = require("../config/logger");

const dbOperations = require('../config/crudoperations/orders');


//////////MyOrders
router.post('/loadMyOrders', function (request, response) {


        dbOperations.loadMyOrders(request, response, request.userData.userId);


   
});

router.post('/myOrderById', function (request, response) {
    logger.debug('routes myoders myOrderById');

        dbOperations.getOrderById2(request.body.id, (error, result) => {

            if (error) {
                logger.debug('routes myoder id Error ', error);

                response.json({ message: 'fail' });
            }
            else if (!result || result.result === null) {
                logger.debug('routes myoder id Result ', result);

                response.json({ notfound: 'order not found' });
            }
            else {
                if (result.result !== undefined && result.result._id) {
                    logger.debug('routes myoder id results ', result);
                    response.json(result);


                }
                else {

                    response.json({ notfound: 'order not found' });
                }

            }
        });


    
});

module.exports = router;