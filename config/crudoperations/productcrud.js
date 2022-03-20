'use strict';

const Products = require('../schemas/productschema');
const utils = require('../utils');
const logger = require('../logger');
const User = require('../schemas/userschema');
const Zip = require('../schemas/zipcodeschema');

const slug = require('slug');

const dbOperations = {
  /////Load Products
  loadProducts: function (request, response, userData) {
    logger.debug('crud productcrud loadProducts');

    var type = request.body.type || 'search';
    var filters = request.body.filters || {};
    var sortBy = request.body.sortBy || {};
    var limit = request.body.limit;
    var count = request.body.count || 0;
    var fields = request.body.fields || 'min';

    var Query = {};
    // var SortQuery = { showPriority: -1 };
    var SortQuery = {};
    if (
      sortBy.type === 'postDate' &&
      (sortBy.order === 1 || sortBy.order === -1)
    ) {
      SortQuery[sortBy.type] = sortBy.order;
    }
    if (
      sortBy.type === 'numberOfSells' &&
      (sortBy.order === 1 || sortBy.order === -1)
    ) {
      SortQuery[sortBy.type] = sortBy.order;
    }
    if (
      sortBy.type === 'title' &&
      (sortBy.order === 1 || sortBy.order === -1)
    ) {
      SortQuery[sortBy.type] = sortBy.order;
    }
    if (
      sortBy.type === 'price' &&
      (sortBy.order === 1 || sortBy.order === -1)
    ) {
      SortQuery[sortBy.type] = sortBy.order;
    }
    if (userData && userData.role !== 'admin') {
      Query['verified'] = { $ne: false };
    }

    if ((userData && type === 'bookmarkedBy') || type === 'likedBy') {
      Query[type] = userData.userId;
    } else if (type === 'search') {
      request.body.hasFilters = false;
      Object.keys(filters).forEach(function (key) {
        //only checks whether atleast a single filter exists or not
        if (filters[key] != '') {
          request.body.hasFilters = true;
        }
      });

      if (request.body.hasFilters === true) {
        Object.keys(filters).forEach(function (key) {
          if (filters[key] && key === 'search') {
            var regex = { $regex: filters[key], $options: '$i' };
            Query['$or'] = [
              { subtext: regex },
              { description: regex },
              { type: regex },
              { subType: regex },
              { 'specs.name': regex },
              { 'specs.value': regex },
              { 'variants.value': regex },
              { pincode: regex },
              { productId: regex },
              { active: regex },
              { 'variants.variantName': regex },
            ];
          } else if (filters[key] && key === 'range') {
            Object.keys(filters.range).forEach(function (rkey) {
              if (
                filters.range[rkey].min >= 0 &&
                filters.range[rkey].max >= 0
              ) {
                Query[rkey] = {
                  $gte: filters.range[rkey].min,
                  $lte: filters.range[rkey].max,
                };
                console.log('rjha', Query);
              }
            });
          } else if (filters[key]) {
            filters[key] = filters[key];
            Query[key] = { $regex: filters[key], $options: '$i' };
            console.log('rj', key);
          }
        });
      }
    }

    var Fields = {
      _id: false,
      productId: true,
      title: true,
      subtext: true,
      isActive: true,
      type: true,
      subType: true,
      subType2: true,
      pincode: true,
      slug: true,
      seoTitle: true,
      seoDescription: true,
      variantType: true,
      variants: true,
      postedByName: true,
      imageUrls: true,
      reviews:true,
      ratingSum: true,
      ratingOut: true,
      postDate: true,
      averageRating: true,
      codAvailable: true,
      variants: true,
      bookmarkedBy: true,
      reviewCount: true,
      likedBy: true,
      category: true,
      subCategory: true,
      price:true,
      tax: true,
      numberOfSells: true,
    };
    if (fields === 'max') {
      Fields = {
        _id: false,
        verified: false,
        verifiedBy: false,
        bookmarkedBy: false,
        likedBy: false,
        ratings: false,
        showPriority: false,
      };
    } else if (
      fields === 'super' &&
      userData.userEmail &&
      userData.role === 'admin'
    ) {
      Fields = {};
    }

    if (request.body.variant1 || request.body.variant2) {
      if (!request.body.variant1) {
        request.body.variant1 = [];
      }
      if (!request.body.variant2) {
        request.body.variant2 = [];
      }
      Query['$or'] = [
        { 'variants.variant1.value': { $in: request.body.variant1 } },
        { 'variants.variant2.value': { $in: request.body.variant2 } },
      ];
      // Query.variants.variant1.value={"$in":request.body.variant1}
    }
    if (request.body.isActive != undefined) {
      Query['isActive'] = request.body.isActive;
    }
        console.log("rohnjha",Query,SortQuery)
    Products.find(Query, Fields)
      .sort(SortQuery)
      .skip(count)
      .limit(limit)
      .populate('category.id')
      .populate('subCategory.id')
      .exec(function (error, result) {
        if (error) {
          logger.error(error);
        } else {
          logger.debug('crud result' + result);
          if (result.length < 1) {
            response.json({ message: 'none' });
          } else {
            var ten = result;
            for (var i = 0; i < ten.length; i++) {
              ten[i].likedBy[0] = ten[i].likedBy.length;
            }
            response.send(ten);
          }
        }
      });
  },

  countProducts: function (request, response, userData) {
    logger.debug('crud productcrud loadProducts');

    logger.debug('crud productcrud loadProducts');

    var type = request.body.type || 'search';
    var filters = request.body.filters || {};
    var sortBy = request.body.sortBy || {};
    var limit = request.body.limit;
    var count = request.body.count || 0;
    var fields = request.body.fields || 'min';

    var Query = {};
    // var SortQuery = { showPriority: -1 };
    var SortQuery = {};
    if (
      sortBy.type === 'postDate' &&
      (sortBy.order === 1 || sortBy.order === -1)
    ) {
      SortQuery[sortBy.type] = sortBy.order;
    }
    if (
      sortBy.type === 'numberOfSells' &&
      (sortBy.order === 1 || sortBy.order === -1)
    ) {
      SortQuery[sortBy.type] = sortBy.order;
    }
    if (
      sortBy.type === 'title' &&
      (sortBy.order === 1 || sortBy.order === -1)
    ) {
      SortQuery[sortBy.type] = sortBy.order;
    }
    if (
      sortBy.type === 'price' &&
      (sortBy.order === 1 || sortBy.order === -1)
    ) {
      SortQuery[sortBy.type] = sortBy.order;
    }
    if (userData && userData.role !== 'admin') {
      Query['verified'] = { $ne: false };
    }

    if ((userData && type === 'bookmarkedBy') || type === 'likedBy') {
      Query[type] = userData.userId;
    } else if (type === 'search') {
      request.body.hasFilters = false;
      Object.keys(filters).forEach(function (key) {
        //only checks whether atleast a single filter exists or not
        if (filters[key] != '') {
          request.body.hasFilters = true;
        }
      });

      if (request.body.hasFilters === true) {
        Object.keys(filters).forEach(function (key) {
          if (filters[key] && key === 'search') {
            var regex = { $regex: filters[key], $options: '$i' };
            Query['$or'] = [
              { subtext: regex },
              { description: regex },
              { type: regex },
              { subType: regex },
              { 'specs.name': regex },
              { 'specs.value': regex },
              { 'variants.value': regex },
              { pincode: regex },
              { productId: regex },
              { active: regex },
              { 'variants.variantName': regex },
            ];
          } else if (filters[key] && key === 'range') {
            Object.keys(filters.range).forEach(function (rkey) {
              if (
                filters.range[rkey].min >= 0 &&
                filters.range[rkey].max >= 0
              ) {
                Query[rkey] = {
                  $gte: filters.range[rkey].min,
                  $lte: filters.range[rkey].max,
                };
                console.log('rjha', Query);
              }
            });
          } else if (filters[key]) {
            filters[key] = filters[key];
            Query[key] = { $regex: filters[key], $options: '$i' };
            console.log('rj', key);
          }
        });
      }
    }

    var Fields = {
      _id: false,
      productId: true,
      title: true,
      subtext: true,
      isActive: true,
      type: true,
      subType: true,
      subType2: true,
      pincode: true,
      slug: true,
      seoTitle: true,
      seoDescription: true,
      variantType: true,
      variants: true,
      postedByName: true,
      imageUrls: true,
      ratingSum: true,
      ratingOut: true,
      postDate: true,
      averageRating: true,
      price:true,
      codAvailable: true,
      variants: true,
      bookmarkedBy: true,
      reviewCount: true,
      likedBy: true,
      category: true,
      subCategory: true,
      tax: true,
      numberOfSells: true,
    };
    if (fields === 'max') {
      Fields = {
        _id: false,
        verified: false,
        verifiedBy: false,
        bookmarkedBy: false,
        likedBy: false,
        ratings: false,
        showPriority: false,
      };
    } else if (
      fields === 'super' &&
      userData.userEmail &&
      userData.role === 'admin'
    ) {
      Fields = {};
    }

    if (request.body.variant1 || request.body.variant2) {
      if (!request.body.variant1) {
        request.body.variant1 = [];
      }
      if (!request.body.variant2) {
        request.body.variant2 = [];
      }
      Query['$or'] = [
        { 'variants.variant1.value': { $in: request.body.variant1 } },
        { 'variants.variant2.value': { $in: request.body.variant2 } },
      ];
      // Query.variants.variant1.value={"$in":request.body.variant1}
    }
    if (request.body.isActive != undefined) {
      Query['isActive'] = request.body.isActive;
    }
    Products.find(Query, Fields)
      .sort(SortQuery)
      .populate('category.id')
      .populate('subCategory.id')
      .exec(function (error, result) {
        if (error) {
          logger.error(error);
        } else {
          logger.debug('crud result' + result);
          if (result.length < 1) {
            response.json({ message: 'none' });
          } else {
            var ten = result.length;
            for (var i = 0; i < ten.length; i++) {
              ten[i].likedBy[0] = ten[i].likedBy.length;
            }
            response.json({ message: 'success', productCount: ten });

            // response.send(ten);
          }
        }
      });
  }, countProducts1: function (request, response, userData) {
    logger.debug('crud productcrud loadProducts');

    logger.debug('crud productcrud loadProducts');

    var type = request.body.type || 'search';
    var filters = request.body.filters || {};
    var sortBy = request.body.sortBy || {};
    var limit = request.body.limit;
    var count = request.body.count || 0;
    var fields = request.body.fields || 'min';

    var Query = {};
    // var SortQuery = { showPriority: -1 };
    var SortQuery = {};
    if (
      sortBy.type === 'postDate' &&
      (sortBy.order === 1 || sortBy.order === -1)
    ) {
      SortQuery[sortBy.type] = sortBy.order;
    }
    if (
      sortBy.type === 'numberOfSells' &&
      (sortBy.order === 1 || sortBy.order === -1)
    ) {
      SortQuery[sortBy.type] = sortBy.order;
    }
    if (
      sortBy.type === 'title' &&
      (sortBy.order === 1 || sortBy.order === -1)
    ) {
      SortQuery[sortBy.type] = sortBy.order;
    }
    if (
      sortBy.type === 'variants.price' &&
      (sortBy.order === 1 || sortBy.order === -1)
    ) {
      SortQuery[sortBy.type] = sortBy.order;
    }
    if (userData && userData.role !== 'admin') {
      Query['verified'] = { $ne: false };
    }

    if ((userData && type === 'bookmarkedBy') || type === 'likedBy') {
      Query[type] = userData.userId;
    } else if (type === 'search') {
      request.body.hasFilters = false;
      Object.keys(filters).forEach(function (key) {
        //only checks whether atleast a single filter exists or not
        if (filters[key] != '') {
          request.body.hasFilters = true;
        }
      });

      if (request.body.hasFilters === true) {
        Object.keys(filters).forEach(function (key) {
          if (filters[key] && key === 'search') {
            var regex = { $regex: filters[key], $options: '$i' };
            Query['$or'] = [
              { subtext: regex },
              { description: regex },
              { type: regex },
              { subType: regex },
              { 'specs.name': regex },
              { 'specs.value': regex },
              { 'variants.value': regex },
              { pincode: regex },
              { productId: regex },
              { active: regex },
              { 'variants.variantName': regex },
            ];
          } else if (filters[key] && key === 'range') {
            Object.keys(filters.range).forEach(function (rkey) {
              if (
                filters.range[rkey].min >= 0 &&
                filters.range[rkey].max >= 0
              ) {
                Query[rkey] = {
                  $gte: filters.range[rkey].min,
                  $lte: filters.range[rkey].max,
                };
                console.log('rjha', Query);
              }
            });
          } else if (filters[key]) {
            filters[key] = filters[key];
            Query[key] = { $regex: filters[key], $options: '$i' };
            console.log('rj', key);
          }
        });
      }
    }

    var Fields = {
      _id: false,
      productId: true,
      title: true,
      subtext: true,
      isActive: true,
      type: true,
      subType: true,
      subType2: true,
      pincode: true,
      slug: true,
      seoTitle: true,
      seoDescription: true,
      variantType: true,
      variants: true,
      postedByName: true,
      imageUrls: true,
      ratingSum: true,
      ratingOut: true,
      postDate: true,
      averageRating: true,
      codAvailable: true,
      variants: true,
      bookmarkedBy: true,
      reviewCount: true,
      likedBy: true,
      category: true,
      subCategory: true,
      tax: true,
      numberOfSells: true,
    };
    if (fields === 'max') {
      Fields = {
        _id: false,
        verified: false,
        verifiedBy: false,
        bookmarkedBy: false,
        likedBy: false,
        ratings: false,
        showPriority: false,
      };
    } else if (
      fields === 'super' &&
      userData.userEmail &&
      userData.role === 'admin'
    ) {
      Fields = {};
    }

    if (request.body.variant1 || request.body.variant2) {
      if (!request.body.variant1) {
        request.body.variant1 = [];
      }
      if (!request.body.variant2) {
        request.body.variant2 = [];
      }
      Query['$or'] = [
        { 'variants.variant1.value': { $in: request.body.variant1 } },
        { 'variants.variant2.value': { $in: request.body.variant2 } },
      ];
      // Query.variants.variant1.value={"$in":request.body.variant1}
    }
    if (request.body.isActive != undefined) {
      Query['isActive'] = request.body.isActive;
    }
    Products.find(Query, Fields)
      .sort(SortQuery)
      .populate('category.id')
      .populate('subCategory.id')
      .exec(function (error, result) {
        if (error) {
          logger.error(error);
        } else {
          logger.debug('crud result' + result);
          if (result.length < 1) {
            response.json({ message: 'none' });
          } else {
            var ten = result.length;
            let similar=[]
            let values = Array.apply(null, Array(10)).map(function() { return Math.floor(Math.random() *ten % ten); })
            let uniqueItems = [...new Set(values)]

            console.log("values",values,ten)
        
                  for(var j=0;j<uniqueItems.length;j++)
                  {
                    similar.push(result[uniqueItems[j]])
                  }
            
            // for (var i = 0; i < ten.length; i++) {
            //   ten[i].likedBy[0] = ten[i].likedBy.length;
            // }
            response.json({ message: 'success', product: similar });

            // response.send(ten);
          }
        }
      });
  },

  ////post new product
  createProduct: function (response, obj, userData) {
    logger.debug('crud productcrud createProduct');
    var productObj = {};
    productObj.productId = utils.randomStringGenerate(32);

    productObj.title = obj.title.toLowerCase().trim();
    productObj.slug =
      slug(obj.title).toString() + Math.floor(Math.random() * 100 + 54);
    productObj.subtext = obj.subtext;
    productObj.codAvailable = obj.codAvailable;
    productObj.productVideo = obj.productVideo;

    productObj.pincode = obj.pincode;
    productObj.description = obj.description;
    productObj.category = obj.category;
    productObj.additionalInformation = obj.additionalInformation;
    productObj.subCategory = obj.subCategory;
    productObj.isActive = obj.active;
    productObj.deliveryCharges = obj.deliveryCharges;
    productObj.maxAmount = obj.maxAmount;
    // productObj.slug = obj.slug;
    productObj.seoTitle = obj.seoTitle;
    productObj.seoDescription = obj.seoDescription;

    productObj.variants = obj.variants;
    productObj.price=obj.variants[0].price+obj.variants[0].tax
    let data = {
      userInfo: userData.objectId,
      userId: userData.userId,
    };
    productObj.createdBy = data;

    if (userData.userInfo && userData.userInfo.fullname) {
      productObj.postedByName = userData.userInfo.fullname;
    } else {
      productObj.postedByName = userData.username;
    }

    productObj.postedByEmail = userData.userEmail;

    productObj.tax = obj.tax;
    productObj.numberOfSells = 0;
    productObj.postDate = new Date();

    productObj.ratingSum = 0;
    productObj.ratingOut = 0;

    var that = this;
    if (obj.tax) {
      productObj.tax = obj.tax;
    }

    Products.create(productObj, function (error, result) {
      if (error) {
        logger.error(error);

        utils.response(response, 'fail');
      } else {
        logger.debug('crud result' + result);

        response.json({ message: 'success', productId: productObj.productId });
      }
    });
  },

  addproducttopincode: function (zipcode, productid, response) {
    Zip.findOne(
      {
        zipCode: zipcode,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
        } else {
          logger.debug('crud result' + result);
          if (result != null) {
            var prdtarr = Array.from(result.productId).concat([productid]);
            var Query = {
              productId: prdtarr,
            };
            Zip.update(
              { zipCode: zipcode },

              { $addToSet: { productId: productid } },
              function (error, result) {
                if (error) {
                  logger.debug(error);
                } else {
                  // response.json({ message: "success" });
                }
              }
            );
          } else {
            let obj = {};
            obj.zipCode = zipcode;
            obj.zipId = utils.randomStringGenerate(8);
            obj.productId = [productid];
            Zip.create(obj),
              function (error, result) {
                if (error) {
                } else {
                  // response.json({ message: "success" });
                }
              };
          }
        }
      }
    );
  },
  removepincode: function (zipcode, productid, response) {
    Zip.update(
      { zipCode: zipcode },

      { $pull: { productId: productid } },
      function (error, result) {
        if (error) {
          logger.debug(error);
        } else {
          // response.json({ message: "success" });
        }
      }
    );
  },
  findzip: function (zipcode, response) {
    Zip.findOne(
      {
        zipCode: zipcode,
      },
      function (error, result) {
        if (error) {
          logger.debug(error);
        } else {
          if (result == null) {
            response.json({
              code: 404,
              success: false,
              message: 'this-zipcode-is-not-added-for-any-product',
            });
          } else {
            let product = result.productId;
            response.send({
              product,
              code: 200,
              success: true,
            });
          }
        }
      }
    );
  },
  findZipOnSpecificProduct: function (request, response) {
    Zip.find(
      {
        productId: request.body.productId,
      },
      {
        zipCode: true,
      },
      function (error, result) {
        if (error) {
          logger.debug(error);
        } else {
          var zip_arr = [];
          for (var i = 0; i < result.length; i++) {
            zip_arr.push(result[i].zipCode);
          }
          let product = zip_arr;
          response.send({
            zip_arr,
            code: 200,
            success: true,
          });
        }
      }
    );
  },

  ///////returns product data on passing
  getProductData: function (id, callback) {
    logger.debug('crud productcrud getStoreData');
    // Products.findOne({productId:id})
    // .populate("category.id")
    // .populate("subCategory.id")
    // .exec(function (error, result) {
    //     if (error) {
    //         logger.error(error);
    //         callback(error,null);
    //     }
    //     else {
    //         logger.debug('crud result' + result);
    //      console.log("d",result)
    //          callback(null,result);
    //     }

    // });
    Products.findOne(
      {
        productId: id,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
        } else {
          logger.debug('crud result' + result);
          callback(result);
        }
      }
    );
  },
  findProductById: function (id, response) {
    logger.debug('crud productcrud getStoreData');
    Products.findOne({ productId: id })
      .populate('category.id')
      .populate('subCategory.id')
      .exec(function (error, result) {
        if (error) {
          logger.error(error);

          utils.response(response, 'fail');
        } else {
          logger.debug('crud result' + result);
          response.send({
            result,
            code: 200,
            success: true,
          });
        }
      });
  },
  getAllProducts: function (id, response) {
    logger.debug('crud productcrud getStoreData');
    Products.find({})
      .populate('category.id')
      .populate('subCategory.id')
      .exec(function (error, result) {
        if (error) {
          logger.error(error);

          utils.response(response, 'fail');
        } else {
          logger.debug('crud result' + result);
          response.send({
            result,
            code: 200,
            success: true,
          });
        }
      });
  },
  countAllProducts: function (id, response) {
    logger.debug('crud productcrud getStoreData');
    Products.find({})
      .populate('category.id')
      .populate('subCategory.id')
      .exec(function (error, result) {
        if (error) {
          logger.error(error);
          console.log('rjj', error);
          utils.response(response, 'fail');
        } else {
          logger.debug('crud result' + result);
          var count = result.length;
          response.send({
            count,
            code: 200,
            success: true,
          });
        }
      });
  },
  loadproductsbyslug: function (slug, callback) {
    logger.debug('crud productcrud getStoreData');

    Products.findOne({
      slug: slug,
    })
      .populate('category.id')
      .populate('subCategory.id')
      .exec(function (error, result) {
        if (error) {
          logger.error(error);
          console.log('rjj', error);
        } else {
          logger.debug('crud result' + result);
          callback(result);
        }
      });
  },
  loadBookmark: function (response, userData, callback) {
    User.findOne(
      {
        userId: userData.userId,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
        } else {
          logger.debug('crud result' + result);

          Products.find({ bookmarkedBy: userData.userId })
            .populate('category.id')
            .populate('subCategory.id')
            .exec(function (error, result) {
              if (error) {
                logger.error(error);
                console.log('rjj', error);
                utils.response(response, 'fail');
              } else {
                logger.debug('crud result' + result);
                response.send({
                  result,
                  code: 200,
                  success: true,
                });
              }
            });
          //   Products.find(
          //     {
          //       bookmarkedBy: userData.userEmail
          //     }  .populate("category.id")
          //     .populate("subCategory.id"),

          //     function(error, result) {
          //       if (error) {

          //         logger.error(error);
          //         callback(error, null);
          //       } else {

          //         response.send(result);
          //       }
          //     }
          //   );
        }
      }
    );
  },

  loadReviews: function (productId, response) {
    Products.findOne({ productId: productId })
      .populate('reviews.userId')

      .exec(function (error, result) {
        if (error) {
          logger.error(error);
          console.log('rjj', error);
          utils.response(response, 'fail');
        } else {
          logger.debug('crud result' + result);
          var reviews = result.reviews;
          response.send({
            reviews,
            code: 200,
            success: true,
          });
        }
      });
  },
  pushToArray: function (storeid, field, target, callback) {
    logger.debug('crud productcrud pushToArray');

    var Query = {};
    Query[field] = target;
    Products.update(
      {
        storeId: storeid,
      },
      {
        $push: Query,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
        } else {
          logger.debug('crud result' + result);
          callback();
        }
      }
    );
  },

  updateProperty: function (productid, Query, callback) {
    logger.debug('crud productcrud updateProperty');

    Products.update(
      {
        productId: productid,
      },
      {
        $set: Query,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
        } else {
          logger.debug('crud result' + result);
          callback();
        }
      }
    );
  },

  ////////Update product data
  updateProduct: function (response, obj, userData) {
    logger.debug('crud productcrud updateproduct');
    var Query = {
      title: obj.title.toLowerCase().trim(),
      subtext: obj.subtext,
      description: obj.description,
      category: obj.category,
      subCategory: obj.subCategory,

      additionalInformation: obj.additionalInformation,
      // maxAmount:obj.maxAmount,
      // deliveryCharges:obj.deliveryCharges,
      seoTitle: obj.seoTitle,
      seoDescription: obj.seoDescription,
      isActive: obj.active,
      // variantType : obj.variantType,
      variants: obj.variants,
      price:obj.variants[0].price+obj.variants[0].tax,
      lastUpdatedBy: userData.userEmail,
      codAvailable: obj.codAvailable,
      productVideo: obj.productVideo,

      tax: obj.tax,
    };
    Products.update(
      {
        productId: obj.productId,
      },
      {
        $set: Query,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
        } else {
          logger.debug('crud result' + result);
          response.json({ message: 'success' });
        }
      }
    );
  },

  /////Add user review
  addReview: function (request, response, userData) {
    logger.debug('productcrud addReview');
    var review = {
      reviewId: utils.randomStringGenerate(6),
      rating: request.body.rating,
      review: request.body.review,
      isPublished: false,
      userId: userData.objectId,
      reviewedOn: Date.now(),
      productImage: request.body.productImage,
    };
    Products.update(
      {
        productId: request.body.productId,
      },
      {
        $push: {
          reviews: review,
        },
      },
      function (error, result) {
        if (error) {
          logger.error(error);
        } else {
          logger.debug('crud result' + result);
          Products.findOne(
            {
              // productId:request.body.productId , variants: {$elemMatch: {id:request.body.variantId}}
              productId: request.body.productId,
            },
            function (error, result) {
              if (error) {
                console.log('error', error);
                logger.debug(error);
                callback(error, null);
              } else {
                console.log('nkngdnkjdnkj', result);
                if (result.reviewCount == undefined) {
                  var Query = {
                    reviewCount: 1,
                    ratingSum: request.body.rating,
                    averageRating: request.body.rating,
                  };
                } else {
                  var Query = {
                    reviewCount: result.reviewCount + 1,
                    ratingSum: result.ratingSum + request.body.rating,
                    averageRating:
                      (result.ratingSum + request.body.rating) /
                      (result.reviewCount + 1),
                  };
                }
                Products.update(
                  {
                    productId: request.body.productId,
                  },
                  {
                    $set: Query,
                  },
                  function (error, result) {
                    if (error) {
                      logger.error(error);
                    } else {
                      logger.debug('crud result' + result);
                      response.json({ message: 'success' });
                    }
                  }
                );
                // callback(null, result);
              }
            }
          );
          // response.json({ "message": "success" });
        }
      }
    );
  },
  editReview: function (request, response, userData) {
    Products.update(
      {
        productId: request.body.productId,
        reviews: {
          $elemMatch: {
            reviewId: request.body.reviewId,
          },
        },
      },
      { $set: { 'reviews.$.isPublished': true } },
      function (error, result) {
        if (error) {
          logger.debug(error);
          callback(error, null);
        } else {
          response.json({ message: 'success' });
        }
      }
    );
  },
  deleteReview: function (request, response, userData) {
    logger.debug('productcrud deleteReview');

    Products.findOne(
      {
        productId: request.body.productId,
        reviews: {
          $elemMatch: {
            reviewId: request.body.reviewId,
          },
        },
      },

      function (error, result) {
        if (error) {
          logger.error(error);
          callback(error, null);
        } else {
          console.log('ssss', result);
          var ratingIndex = result.reviews.findIndex(
            (x) => x.reviewId === request.body.reviewId
          );
          console.log(result.reviews[ratingIndex].rating);
          var ratingSum = result.ratingSum - result.reviews[ratingIndex].rating;
          var reviewCount = result.reviewCount - 1;
          var averageRating = ratingSum / reviewCount;
          console.log('ssssss', averageRating);
          Products.update(
            {
              productId: request.body.productId,
            },
            {
              $pull: {
                reviews: {
                  reviewId: request.body.reviewId,
                },
              },
            },
            function (error, result) {
              if (error) {
                logger.debug(error);
                callback(error, null);
              } else {
                Products.update(
                  {
                    productId: request.body.productId,
                  },
                  {
                    $set: {
                      ratingSum: ratingSum,
                      averageRating: averageRating,
                      reviewCount: reviewCount,
                    },
                  },
                  function (error, result) {
                    if (error) {
                      logger.error(error);
                    } else {
                      logger.debug('crud result' + result);
                      response.json({ message: 'success' });
                    }
                  }
                );
                // response.json({ message: "success" });
              }
            }
          );

          // response.send(result);
        }
      }
    );
  },

  getReviewById: function (request, response) {
    var review = [];
    Products.findOne(
      {
        productId: request.body.productId,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
          utils.response(response, 'fail');
        } else {
          for (var i = 0; i < result.reviews.length; i++) {
            if (result.reviews[i].reviewId == request.body.reviewId) {
              review.push(result.reviews[i]);
            }
          }
          response.send({
            review,
            code: 200,
            success: true,
          });
        }
      }
    );
  },
  ///////Add product to cart

  findProduct: function (request, callback) {
    logger.debug('crud productcrud findProduct');

    console.log(request.body.variantId);
    Products.findOne(
      {
        // productId:request.body.productId , variants: {$elemMatch: {id:request.body.variantId}}
        productId: request.body.productId,
        'variants.variantId': request.body.variantId,
      },
      function (error, result) {
        if (error) {
          console.log('error', error);
          logger.debug(error);
          callback(error, null);
        } else {
          console.log('nkngdnkjdnkj', result);
          callback(null, result);
        }
      }
    );
  },

  ///////Rate Product
  rateProduct: function (request, response, userData) {
    logger.debug('crud productcrud rateProduct');
    var outOf = 5;
    Products.findOneAndUpdate(
      {
        productId: request.body.productId,
      },
      {
        $pull: {
          ratings: {
            userId: userData.userId,
          },
        },
      },
      function (error, result) {
        if (error) {
          logger.error(error);
        } else {
          if (result === null) {
            response.json({ message: 'idfail' });
          } else {
            var oldRatingIndex = result.ratings.findIndex(
              (x) => x.userId === userData.userId
            );
            var Query = {};
            var inc = 0;

            if (oldRatingIndex === -1) {
              inc = request.body.rating;
              Query = {
                ratingSum: inc,
                ratingOut: outOf,
              };
            } else {
              var oldRating = result.ratings[oldRatingIndex];
              inc = request.body.rating - oldRating.rating;
              Query = {
                ratingSum: inc,
              };
            }

            Products.findOneAndUpdate(
              {
                productId: request.body.productId,
              },
              {
                $push: {
                  ratings: {
                    userId: userData.userId,
                    rating: request.body.rating,
                  },
                },
                $inc: Query,
              },
              function (error, result) {
                if (error) {
                  logger.error(error);
                } else {
                  response.json({ message: 'success' });
                }
              }
            );
          }
        }
      }
    );
  },

  likeProduct: function (productId, response, userData) {
    logger.debug('crud productcrud likeProduct');
    Products.find(
      {
        productId: productId,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
        } else {
          logger.debug('crud result' + result);
          if (result.length > 1) {
            logger.error('Multiple products for same id', productId);
          }
          if (result[0].likedBy.indexOf(userData.userEmail) === -1) {
            Products.update(
              {
                productId: productId,
              },
              {
                $push: { likedBy: userData.userEmail },
              },
              function (error, result) {
                if (error) {
                  logger.error(error);
                } else {
                  logger.debug('crud result' + result);
                  response.json({ message: 'liked' });
                }
              }
            );
          } else {
            Products.update(
              {
                productId: productId,
              },
              {
                $pull: { likedBy: userData.userEmail },
              },
              function (error, result) {
                if (error) {
                  logger.error(error);
                } else {
                  logger.debug('crud result' + result);
                  response.json({ message: 'unliked' });
                }
              }
            );
          }
        }
      }
    );
  },

  bookmarkProduct: function (productId, response, userData) {
    logger.debug('crud productcrud bookmarkProduct');
    Products.find(
      {
        productId: productId,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
        } else {
          logger.debug('crud result' + result);
          if (result.length > 1) {
            logger.error('Multiple products for same id', productId);
          }
          if (result[0].bookmarkedBy.indexOf(userData.userId) === -1) {
            Products.update(
              {
                productId: productId,
              },
              {
                $push: { bookmarkedBy: userData.userId },
              },
              function (error, result) {
                if (error) {
                  logger.error(error);
                } else {
                  logger.debug('crud result' + result);
                  response.json({ message: 'bookmarked' });
                }
              }
            );
          } else {
            Products.update(
              {
                productId: productId,
              },
              {
                $pull: { bookmarkedBy: userData.userId },
              },
              function (error, result) {
                if (error) {
                  logger.error(error);
                } else {
                  logger.debug('crud result' + result);
                  response.json({ message: 'unbookmarked' });
                }
              }
            );
          }
        }
      }
    );
  },

  /////get products by id
  getProductsByIds: function (ids, callback) {
    logger.debug('crud products getProductsByIds');

    Products.find(
      {
        productId: { $in: ids },
      },
      {
        productId: true,
        variants: true,
        tax: true,
        title: true,
        deliveryCharges: true,
        createdBy: true,
        maxAmount: true,
        imageUrls: true,
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

  increementProperty: function (productid, Query, callback) {
    logger.debug('crud productcrud increementProperty');

    Products.update(
      {
        productId: productid,
      },
      {
        $inc: Query,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
        } else {
          logger.debug('crud result' + result);
          callback();
        }
      }
    );
  },

  increementProperty2: function (productid, variantId, Query, callback) {
    logger.debug('crud productcrud increementProperty2');

    Products.update(
      {
        productId: productid,
        'variants.variantId': variantId,
      },
      {
        $inc: Query,
      },
      function (error, result) {
        if (error) {
          logger.error(error);
        } else {
          logger.debug('crud result' + result);
          callback();
        }
      }
    );
  },

  checkSlug: function (slug, callback) {
    logger.debug('crud productcrud checkSlug');

    Products.findOne(
      {
        slug: slug,
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

  ////////load cart
  loadCart: function (userdata, callback) {
    var cartData = [];
    if (userdata.cart) {
      cartData = userdata.cart.map((ele) => {
        return ele.productId;
      });
    }

    Products.find(
      { productId: { $in: cartData } },
      {
        productId: true,
        title: true,
        description: true,
        price: true,
        tax: true,
        imageUrls: true,
        stock: true,
      },
      function (error, result) {
        if (error) {
          callback(error, null);
        } else {
          var products = [];
          for (var i = 0; i < cartData.length; i++) {
            var productIndex = result.findIndex(
              (x) => x.productId === userdata.cart[i].productId
            );
            console.log(productIndex);
            if (productIndex > -1) {
              var product = result[productIndex].toObject();
              product.quantity = userdata.cart[i].quantity;
              product.variantId = userdata.cart[i].variantId;
              product.variant1 = userdata.cart[i].variant1;
              product.variant2 = userdata.cart[i].variant2;
              product.price = userdata.cart[i].price;
              product.mrp = userdata.cart[i].mrp;
              product.codAvailable = userdata.cart[i].codAvailable;
              product.slug=userdata.cart[i].slug
              products.push(product);
            }
            console.log(products);
          }
          callback(null, products);
        }
      }
    );
  },

  loadquickBuy: function (userdata, callback) {
    var cartData = [];
    if (userdata.buynow) {
      cartData = userdata.buynow.map((ele) => {
        return ele.productId;
      });
    }

    Products.find(
      { productId: { $in: cartData } },
      {
        productId: true,
        title: true,
        description: true,
        price: true,
        tax: true,
        imageUrls: true,
        stock: true,
      },
      function (error, result) {
        if (error) {
          callback(error, null);
        } else {
          var products = [];
          for (var i = 0; i < cartData.length; i++) {
            var productIndex = result.findIndex(
              (x) => x.productId === userdata.buynow[i].productId
            );
            console.log(productIndex);
            if (productIndex > -1) {
              var product = result[productIndex].toObject();
              product.quantity = userdata.buynow[i].quantity;
              product.variantId = userdata.buynow[i].variantId;
              product.variant1 = userdata.buynow[i].variant1;
              product.variant2 = userdata.buynow[i].variant2;
              product.price = userdata.buynow[i].price;
              product.mrp = userdata.buynow[i].mrp;
              product.codAvailable = userdata.buynow[i].codAvailable;
              product.slug=userdata.buynow[i].slug;
              products.push(product);
            }
            console.log(products);
          }
          callback(null, products);
        }
      }
    );
  },

  deleteProduct: function (productId, callback) {
    logger.debug('crud role deleteRole');
    Products.find({
      productId: productId,
    }).remove(function (error, result) {
      if (error) {
        logger.debug(error);
        callback(error, null);
      } else {
        logger.debug('crud result');
        callback(null, result);
      }
    });
  },
  deleteUser: function (userId, callback) {
    logger.debug('crud role deleteRole');
    User.find({
      userId: userId,
    }).remove(function (error, result) {
      if (error) {
        logger.debug(error);
        callback(error, null);
      } else {
        logger.debug('crud result');
        callback(null, result);
      }
    });
  },
  loadCategory: function (obj, callback) {
    Products.find({
      type: productId,
    }),
      function (error, result) {
        if (error) {
          logger.debug(error);
          callback(error, null);
        } else {
          logger.debug('crud result');
          callback(null, result);
        }
      };
  },
  toggleActive: function (productId, callback) {
    Products.findOne(
      {
        productId: productId,
      },
      (err, product) => {
        if (err) {
          logger.error(err);
          callback(err, null);
        } else {
          console.log(1);
          let active = !product.isActive;
          Products.update(
            {
              productId: productId,
            },
            {
              $set: { isActive: active },
            },
            (err1, res) => {
              if (err1) {
                console.log(err1);
                logger.error(err1);
                callback(err1, null);
              } else {
                callback(null, `product active status: ${active}`);
              }
            }
          );
        }
      }
    );
  },
};

module.exports = dbOperations;
