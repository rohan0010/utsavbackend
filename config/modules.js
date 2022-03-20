'use strict';

//Ignore check rights and dont check token
const publicModule = {
  '/': [''],
  '/login/': ['login', 'loginAdmin'],
  '/signup/': ['register'],
  '/forgotpassword/': ['sendLink', 'passwordReset'],
  '/commonroutes/': [
    'activateEmail',
    'checkUsername',
    'loadProducts',
    'loadproductsbyslug',
    'loadUsers',
    'countUsers',
    'countProducts',
  ],
  '/admindash/': [
    'getProductData',
    'uploadpic',
    'getProductById',
    'getProductData',
  ],
  '/category/': [
    'getsubcategory',
    'getcategory',
    'getMegaMenu',
    'loadSortedCategory',
  ],
  '/social/': [
    'socialFacebook',
    'socialFacebookApp',
    'auth/facebook',
    'auth/facebook/callback',
    'socialGoogle',
    'socialGoogleApp',
    'auth/google',
    'auth/google/callback',
  ],
};

//Requires token and also rights
const authModules = {
  admin: {
    '/admindash/': [
      'registerAdmin',
      'updateProduct',
      'toggleVerify',
      'uploadpic',
      'pushArray',
      'orders',
      'order',
      'registerusers',
      'updateOrder',
      'removeProduct',
      'registerVendor',
      'updateProfileDataVendor',
      'updateBankDetailsVendor',
      'setNewPasswordVendor',
      'getProfileDataVendor',
      'toggle',
    ],
    '/profile/': ['updateProfileData'],
    '/incash/': ['getuser', 'incash', 'findincash', 'getallusers'],
  },
  vendor: {
    '/admindash/': [
      'updateProduct',
      'updateVendorOrder',

      'orders',
      'order',

      'updateOrder',
      'removeProduct',
    ],
  },
  user: {
    '/transaction/':['create-transaction'],

    '/userdash/': [
      'addToCart',
      'loadCart',
      'editReview',
      'removeFromCart',
      'addToBuyNow',
      'buyNow',
      'quickBuyPrice',
      'loadQuickBuy',
      'generateInvoice',
      'updateCart',
      'cartPrice',
      'addReview',
      'rateProduct',
      'likeProduct',
      'bookmarkProduct',
      'orderNow',
      'returnOrder',
      'cancelOrder',
      'stockcheck',
      'loadbookmarkProduct',
    ],

    '/profile/': ['updateProfileData', 'updateTime', 'verifyOTP2'],
    '/myorders/': ['loadMyOrders', 'myOrderById'],
    '/stats/': ['getOrders', 'getUserOrder'],
    '/paypal/': ['/api/redirect_url'],
    '/buynow/': ['/api/redirect_url'],

    // "/admindash/": ["getProductData","uploadpic","getProductById","getProductData"],
    '/incash/': ['incashuser', 'getuser'],
    '/refer/': ['generateReferralCode'],
  },
};

//Requires token but everyone has rights
const commonModule = {
  '/': ['webindex', 'sendActivationLink', 'logout', 'sendEmailActivationLink'],
  '/paypal/': ['/api/redirect_url'],
  '/buynow/': ['/api/redirect_url'],
  '/profile/': [
    'changeUsername',
    'updateProfileData',
    'updateBankDetails',
    'updateProfilePic',
    'updateMobile',
    'updateBankDetails',
    'getProfileData',
    'addAddress',
    'getAddressById',
    'UpdateAddress',
    'removeAddress',
    'getAddress',
    'verifyCode',
    'setNewPassword',
    'uploadPic',
    'verifyOTP2',
  ],
};

//System start rights module assignment to roles
const roles = {
  admin: ['admin', 'user'],
  vendor: ['vendor'],
  user: ['user'],
};

module.exports = {
  publicModule,
  authModules,
  commonModule,
  roles,
};
