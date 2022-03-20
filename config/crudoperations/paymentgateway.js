'use strict';

const User = require("../schemas/userschema");
const logger = require("../logger");
const Utils = require('../utils');

const dbOperations = {

    //Check login id and password > Fill Session
    saveTxnDetails: function (request, txnObject, response) {
        logger.debug('crud payment saveTxnDetails');
        var email;
        if (request.userData) {
            email = request.userData.userEmail;
        }
        else {
            email = txnObject.email;
        }
        var newTokens = 0;
        if (request.userData && request.userData.role === 'customer') {
            newTokens = Cpakages[txnObject.productinfo].tickets;
        }
        else {
            newTokens = Epakages[txnObject.productinfo].tickets;
        }
        var txnString = JSON.stringify(txnObject);
        var txnDate = new Date();
        User.update({
            userEmail: email
        }, {
                $push: {
                    transactions: txnString
                },
                $set: {
                    plan: txnObject.productinfo,
                    lastTxnDate: txnDate,
                },
                $inc: {
                    tickets: +newTokens
                }
            },
            function (error, result) {
                if (error) {
                    logger.error(error);
                }
                else {
                    logger.debug('crud result', result);
                    var mailData = {
                        uemail: email,
                        amount: txnObject.amount,
                        name: txnObject.firstname,
                        product: txnObject.productinfo,
                        txnid: txnObject.txnid
                    };
                    Utils.createMail(mailData, 'paymentreceived');
                    response.render("paymentSuccess", { txnId: txnObject.txnid, message: "Transaction successfull" });
                }
            });
    },

    
    saveEventTxnDetails: function (request, txnObject, response) {
        logger.debug('crud payment saveEventTxnDetails');
        var email;
        if (request.userData) {
            email = request.userData.userEmail;
        }
        else {
            email = txnObject.email;
        }

        var txnString = JSON.stringify(txnObject);
        var txnDate = new Date();
        User.update({
            userEmail: email
        }, {
                $push: {
                    transactions: txnString
                }
            },
            function (error, result) {
                if (error) {
                    logger.error(error);
                }
                else {
                    logger.debug('crud result', result);

                    const Events = require('../eventschema');
                    Events.update({
                        eventId: txnObject.productinfo
                    }, {
                            $push: {
                                usersRegistered: email
                            }
                        },
                        function (error, result) {
                            if (error) {
                                logger.error(error);
                            }
                            else {
                                logger.debug('crud result', result);

                                Events.find({
                                    eventId: txnObject.productinfo
                                }, function (error, result) {
                                    if (error) {
                                        logger.error(error);
                                    }
                                    else {
                                        logger.debug('crud result', result);
                                        var mailData = {
                                            uemail: email,
                                            amount: txnObject.amount,
                                            name: txnObject.firstname,
                                            product: result[0],
                                            txnid: txnObject.txnid
                                        };
                                        Utils.createMail(mailData, 'paymentreceivedevent')
                                        response.render("paymentSuccess", { txnId: txnObject.txnid, message: "Transaction successfull" });
                                    }
                                });
                            }
                        });

                }
            });
    }
};

module.exports = dbOperations;