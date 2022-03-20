'use strict';

const Transaction = require("../schemas/transactions");
const logger = require("../logger");
const utils = require("../utils");

const dbOperations = {
    getTransactionById: function (transactionId, callback) {
        logger.debug('crud profile getUserById');
    
        Transaction.findOne(
          {
            transactionId: transactionId,
          },
          function (error, result) {
            if (error) {
              logger.error(error);
              callback(error, null);
            } else {
              logger.debug('crud result' + result);
              console.log('oneerror', result);
              callback(null, result);
            }
          }
        );
      },
    createTransaction:(request,objId,amount, callback)=>{
        logger.debug('crud tags createTag');

        var transactionId = utils.randomStringGenerate(8);
        var tag={
            transactionId: transactionId,
            createdBy: objId,
            amount: amount,
            createdOn:new Date()
        }
        Transaction.create(tag,
            function(error , result){
                if(error){
                    logger.error(error);
                    callback(error , null);
                }
                else{
                    result.transactionId=transactionId
                    callback(null , result);
                }
            });
    },
    updateTransaction: function (transactionId,completed, callback) {
        logger.debug('crud profile emptyCart');
    
        Transaction.findOneAndUpdate(
          {
            transactionId: transactionId,
          },
          {
            $set: {
              isCompleted: completed,
            },
          },
          function (error, result) {
            if (error) {
              logger.error(error);
              callback(error, null);
            } else {
              logger.debug('crud result' + result);
              callback(null, result);
            }
          }
        );
      },

}

module.exports = dbOperations;