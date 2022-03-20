"use strict";
require("dotenv").config();
const secrets = {
  COMPANY_NAME: "Ecommerce Generic",
  domain: 'http://139.59.13.212:1556',
  port: '8000',
  env: process.env.APP_ENV,
  dbUrl: process.env.DB_URL,
  dbName: process.env.DB_NAME,
  dbUrlMem: process.env.DB_MEM_URL,
  dbMemName: process.env.DB_MEM_NAME,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  S3_BUCKET: process.env.S3_BUCKET,
  AWS_REGION: process.env.AWS_REGION,
  clientOrigins: [
    "http://localhost:8800",
    "http://localhost:1556",
    "http://139.59.13.212:1556",
    "http://localhost:7700",
    "http://vanquish-admin.s3-website.ap-south-1.amazonaws.com"
  ],

  userCollection: "users",
  sessionCollection: "sessions",
  roleCollection: "roles",
  dbproducts: "products",
  dbvouchers: "vouchers",
  dbinfluencers:"influencers",
  dbOrders: "orders",
  dbcategory: "category",
  dbcatgry: "catgry",
  dbcashback:"cashback",
  dbbanner: "banner",
  dbcms:"cms",
  transactionCollection: "transactions",
  dbsubscribe:"subscribe",

  dbzip: "zip",
  dbvariant: "variants",
  jwtKey: process.env.JWT_KEY,
  jwtDuration: 86400, //expires in 24 hours
  defaultSessionDuration: 2 * 60 * 60,
  sessionType: "multi",
  sessionCaching: "none",

  superadminEmail: process.env.SU_EMAIL,
  defaultRole: "customer",

  SMTPS_URL: process.env.MAIL_HOST,
  SMTPS_EMAIL: process.env.MAIL_USEREMAIL,
  SMTPS_PASSWORD: process.env.MAIL_PASSWORD,

  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  VALID_TWILIO_NUMBER: process.env.VALID_TWILIO_NUMBER,

  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  CATEGORIES: ["protein", "gainer", "nitro"],
  SUB_CATEGORIES: ["protein", "gainer", "nitro"],
  SUB_CATEGORIES2: ["protein", "gainer", "nitro"],
  DELIVERY_CHARGES: 50,
  PAYMENT_OPTIONS: ["cod", "payu"],
  VALID_STATUS: ["ordered", "delivered", "received", "cancelled"],
  PAYU_KEY: "BMU23pxL",
  PAYU_SALT: "fs5xm66SuG",
  PAYU_TEST_URL: "https://test.payu.in/_payment",
  PAYU_LIVE_URL: "https://secure.payu.in/_payment",
  paytmMID:'IVNrxt82518286396827',
  merchantKey:'AJ!tUzN1oTt!1Gs!',
  furl:'https://alaromaleafs.com/cancelorder',
  surl:'https://alaromaleafs.com/successorder',
  callbackUrl:"https://api.alaromaleafs.com/transaction/callback",
  mobileCallbackUrl:"https://api.alaromaleafs.com/transaction/callback-mobile",
  //MLM part constants
  businessPointValuePercentage: 50,
  maxCreditAllowed: 5000,
  maxChildAllowed: 6,
  lastLevelFixedCutPercentage: 3
};
module.exports = secrets;
