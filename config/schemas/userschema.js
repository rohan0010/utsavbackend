'use strict';

const mongoose = require('../connection');
const config = require('../config');
const schema = mongoose.Schema;

const userSchema = new schema({
  userId: { type: String, unique: true, required: true },
  userEmail: { type: String },
  tempEmail: String,
  username: { type: String, unique: true },
  password: String,
  mobile: { type: String, unique: true, sparse: true },
  temporaryMobile: String,
  salt: String,
  userInfo: {
    firstName: String,
    lastName: String,
    mobile: String,
    profilePic: String,
    bankAccountDetails: {
      ifscCode: String,
      bankAccountNumber: String,
      bankName: String,
    },
  },
  Addresses: [
    {
      addressId: String,
      firstName: String,
      lastName: String,
      area: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },
  ],
  emailVerified: Boolean,
  banned: Boolean,
  emailActivationToken: String,
  forgotPasswordToken: String,
  passwordTokenStamp: Date,
  ReferralCode: String,
  usedBy: [String],
  isScheduledMessage: Boolean,
  scheduledTime: String,
  createdBy: {
    userInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: config.userCollection,
    },
    userId: { type: String },
  },
  mobileVerificationCode: String,
  mobileTokenStamp: Date,
  role: String,
  credits: { type: Number, default: 0 },
  registrationDate: Date,
  social: [
    {
      connection: String,
      sId: String,
      accessToken: String,
    },
  ],

  buynow: [
    {
      _id: { type: String, unique: true, sparse: true },
      productName: String,
      productImage: String,
      slug:String,
      productId: String,
      variantId: String,
      codAvailable: Boolean,
      variant1: {
        name: String,
        value: String,
      },
      skucode: String,
      variant2: {
        name: String,
        value: String,
      },
      price: Number,
      mrp: Number,
      addedOn: { type: Date, default: Date.now() },
      quantity: { type: Number, default: 1 },
    },
  ],
  cart: [
    {
      _id: { type: String, unique: true, sparse: true },
      productName: String,
      productImage: String,
      slug:String,
      productId: String,
      variantId: String,
      codAvailable: Boolean,

      variant1: {
        name: String,
        value: String,
      },
      skucode: String,
      variant2: {
        name: String,
        value: String,
      },
      price: Number,
      mrp: Number,
      addedOn: { type: Date, default: Date.now() },
      quantity: { type: Number, default: 1 },
    },
  ],
  gstNumber: String,
  panNumber: String,
  companyAddress: {
    area: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
  },
  companyName: String,
  contactPerson: String,
  favourites: [String],
});

const User = mongoose.model(config.userCollection, userSchema);

module.exports = User;
