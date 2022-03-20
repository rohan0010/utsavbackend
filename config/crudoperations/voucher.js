"use strict";

const Voucher = require("../schemas/voucherschema");
const logger = require("../logger");
const utils = require("../utils");

const dbOperations = {
  create: function(voucher, callback) {
    logger.debug("crud voucher create");
    var Query = {
      voucherId: voucher.voucherId,
      discount: voucher.discount,
      expired: voucher.expired,
      voucherDate:voucher.voucherDate,
      expiryDate:voucher.expiryDate
    };
    Voucher.create(Query, function(error, result) {
      if (error) {
        logger.debug(error);
        callback(error, null);
      } else {
        callback(null, result);
      }
    });
  },

  checkVoucher: function(voucherId, callback) {
    logger.debug("crud voucher checkVoucher");
    Voucher.findOne({ voucherId: voucherId }, function(error, result) {
      if (error) {
        logger.debug(error);
        callback(error, null);
      } else {
        callback(null, result);
      }
    });
  },

  update: function(voucher, callback) {
    logger.debug("crud voucher update");
    var Query = {
      discount: voucher.discount,
      expired: voucher.expired,
      voucherDate:voucher.voucherDate,
      expiryDate:voucher.expiryDate
    };
    Voucher.findOneAndUpdate(
      { voucherId: voucher.voucherId },
      {
        $set: Query
      },
      { new: true },
      function(error, result) {
        if (error) {
          logger.error(error);
          callback(error, null);
        } else {
          callback(null, result);
        }
      }
    );
  },

  deleteVoucher: function(voucherId, callback) {
    Voucher.findOne({ voucherId: voucherId }).remove(function(error, result) {
      if (error) {
        logger.debug(error);
     
        callback(error, null);
      } else {
        logger.debug("crud result");
       
        callback(null, result);
      }
    });
  },

  countVouchers: function(request, response, userData) {
    logger.debug("crud voucher loadVouchers");
    console.log("LOAD VOUCHERS");
    var type = request.body.type || "search";
    var filters = request.body.filters || {};
    var fields = request.body.fields || "min";

    var Query = {};

    try {
      request.body.hasFilters = false;
      Object.keys(filters).forEach(function(key) {
        //only checks whether atleast a single filter exists or not
        if (filters[key] != "") {
          request.body.hasFilters = true;
        }
      });

      if (request.body.hasFilters === true) {
        Object.keys(filters).forEach(function(key) {
          if (filters[key]) {
            filters[key] = filters[key].replace(/ /g, "");
            Query[key] = { $regex: filters[key], $options: "$i" };
          }
        });
      }
    } catch (error) {
      logger.error(error);
    }

    var Fields = {
      _id: false
    };
    if (fields === "max") {
      Fields = {
        _id: false
      };
    } else if (
      fields === "super" &&
      userData &&
      config.higherOrderRoles.indexOf(userData.role) > -1
    ) {
      Fields = {};
    }
    console.log("query", Query);
    Voucher.find(Query, Fields).exec(function(error, result) {
      if (error) {
        logger.error(error);
      } else {
        logger.debug("crud result");
        if (result.length < 1) {
          response.json({ message: "Not found", code: 404, success: false });
        } else {
          var count =result.length
          response.json({ vouchers: { count }, code: 200, success: true });
        }
      }
    });
  },
  /////Load Vouchers
  loadVouchers: function(request, response, userData) {
    logger.debug("crud voucher loadVouchers");
    console.log("LOAD VOUCHERS");
    var type = request.body.type || "search";
    var filters = request.body.filters || {};
    var fields = request.body.fields || "min";

    var Query = {};

    try {
      request.body.hasFilters = false;
      Object.keys(filters).forEach(function(key) {
        //only checks whether atleast a single filter exists or not
        if (filters[key] != "") {
          request.body.hasFilters = true;
        }
      });

      if (request.body.hasFilters === true) {
        Object.keys(filters).forEach(function(key) {
          if (filters[key]) {
            filters[key] = filters[key].replace(/ /g, "");
            Query[key] = { $regex: filters[key], $options: "$i" };
          }
        });
      }
    } catch (error) {
      logger.error(error);
    }

    var Fields = {
      _id: false
    };
    if (fields === "max") {
      Fields = {
        _id: false
      };
    } else if (
      fields === "super" &&
      userData &&
      config.higherOrderRoles.indexOf(userData.role) > -1
    ) {
      Fields = {};
    }
    if(request.body.voucherDate)
    {
      Query.voucherDate =  { $lte: new Date()};
    }
    if(request.body.expiryDate)
    {
      Query.expiryDate =  { $gte: new Date()};
    }
    console.log("query", Query);
    Voucher.find(Query, Fields).exec(function(error, result) {
      if (error) {
        logger.error(error);
      } else {
        logger.debug("crud result");
        if (result.length < 1) {
          response.json({ message: "Not found", code: 404, success: false });
        } else {
          response.json({ vouchers: { result }, code: 200, success: true });
        }
      }
    });
  }
};

module.exports = dbOperations;
