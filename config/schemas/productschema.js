'use strict';

const mongoose = require('../connection');
const config = require('../config');
const schema = mongoose.Schema;

const productSchema = new schema({
  productId: { type: String, unique: true, required: true },
  title: String,
  subtext: String,
  description: String,
  category: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: config.dbcatgry },
    categoryid: { type: String },
  },
  subCategory: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: config.dbcatgry },
    categoryid: { type: String },
  },
  slug: String,
  seoTitle: String,
  seoDescription: String,
  productVideo: String,
  postedByName: String,
  postedByEmail: String,
  codAvailable: Boolean,
  imageUrls: [String],
  deliveryCharges: Number,
  maxAmount: Number,
  pincode: [String],
  additionalInformation: {
    Weight: String,
    Dimensions: String,
    Materials: String,
    OtherInfo: String,
  },
  specs: [
    {
      name: String,
      value: String,
      _id: { id: false },
    },
  ],
  price:String,
  variants: [
    {
      variantId: String,
      variant1: {
        name: String,
        value: String,
      },
      variant2: {
        name: String,
        value: String,
      },
      skucode: String,
      tax: Number,
      price: Number,
      mrp: Number,
      stock: Number,
    },
  ],
  tax: { type: Number },
  createdBy: {
    userInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: config.userCollection,
    },
    userId: { type: String },
  },

  // ratings: [{
  //     userId: String,
  //     rating: Number,
  //     _id : {id:false}
  // }],
  averageRating: Number,
  ratingSum: Number,
  reviewCount: Number,
  isActive: { type: Boolean, default: false },
  // ratingOut: Number,
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: config.userCollection,
      },
      rating: Number,
      review: String,
      reviewId: String,
      productImage: String,
      reviewedOn: Date,
      isPublished: Boolean,
      _id: { id: false },
    },
  ],
  likedBy: [String],
  bookmarkedBy: [String],
  numberOfSells: Number,
  postDate: Date,
  lastUpdatedBy: String,
});

const Products = mongoose.model(config.dbproducts, productSchema);

module.exports = Products;
