'use strict';

//Ignore check rights and dont check token
const publicModule = {
    '/': [''],
    '/login/': ['login'],
    '/signup/': ['register'],
    '/forgotpassword/': ['sendLink', 'passwordReset'],
    '/commonroutes/': ['activateEmail', 'checkUsername'],
    '/social/': ['socialFacebook', 'socialFacebookApp', 'auth/facebook', 'auth/facebook/callback', 'socialGoogle', 'socialGoogleApp', 'auth/google', 'auth/google/callback'],
    '/products/':['increement','load','load-by-id','load-similar-products', 'load-seller-products', 'load-nearby-products','load-by-slug','load-similar-by-slug','load-business-products', 'load-user-products', 'download-excel', 'load-multiple-products', 'load-product-reviews'],
    '/business/': ['load','load-by-id','load-business-by-slug', "get-business-followers"],
};
    
//Requires token and also rights
const authModules = {
   
    admin: {
        '/products/': ['verify'],
    },
    products:{
        '/products/': ['increement','load','load-by-id','load-similar-products', 'load-seller-products', 'load-nearby-products','load-by-slug','load-similar-by-slug','load-business-products', 'load-user-products', 'download-excel', 'load-multiple-products'],
        
    },
    business:{
        '/business/': ['load','load-by-id','load-business-by-slug', "get-business-followers",'post-business', 'update-business', 'toggle', 'update-mobile', 'verify-code', 'rate', 'add-review'],
    }
};

//Requires token but everyone has rights
const commonModule = {
    '/': ['webindex', 'logout'],
    '/profile/': ['changeUsername', 'updateProfileData', 'setNewPassword']
};



//System start rights module assignment to roles
const roles={
    admin:["admin","products","business"],
    user:["products","business"],
    manager:["admin"]
};

module.exports = {
    publicModule,authModules,commonModule,roles
}