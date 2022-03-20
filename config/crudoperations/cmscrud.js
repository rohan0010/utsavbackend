'use strict';

const cms = require('../schemas/cms');
const logger = require('../logger');
const utils = require('../utils');
const app = require('../..');
const { response } = require('express');
var slug = require('slug');
var slugify = require('slugify');
const dbOperations = {
  updateabout: function (obj, response) {
    var Query = {
      html: obj.html,
    };
    cms.update(
      {
        cmsId: obj.cmsid,
      },
      {
        $set: Query,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          response.json({ message: 'success', success: true, code: 200 });
          logger.debug('crud result' + result);
        }
      }
    );
  },

  createabout: function (obj, response) {
    var apple = {};
    apple.cmsId = obj.cmsid;
    apple.html = obj.html;

    cms.create(apple, function (error, result) {
      if (error) {
        logger.error(error);

        utils.response(response, 'fail');
      } else {
        logger.debug('crud result' + result);
        console.log(result);
        response.json({ success: true, message: 'success', code: 200 });
      }
    });
  },

  getcms: function (request, response) {
    cms.findOne(
      {
        cmsId: request.cmsid,
      },
      function (error, result) {
        if (error) {
          utils.response(response, 'fail');
          logger.error(error, null);
        } else {
          logger.debug('crud result' + result);
          //    callback(result);
          let html = '';
          if (result) {
            html = result.html;
          }

          response.send({
            html,
            code: 200,
            success: true,
          });
          //   response.send(result)
        }
      }
    );
  },

  findabout: function (id, callback) {
    cms.findOne(
      {
        cmsId: id,
      },
      function (error, result) {
        if (error) {
          console.log('sss', error);
          logger.error(error, null);
        } else {
          console.log('sss', result);
          logger.debug('crud result' + result);
          callback(result);
        }
      }
    );
  },
};

module.exports = dbOperations;
