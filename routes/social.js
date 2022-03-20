'use strict';

///Routing for Oauth calls

const express = require('express');

const app = require("../index");
const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
app.use(passport.initialize());

const router = express.Router();

const dbOperations = require("../config/crudoperations/commonoperations");
const secrets = require("../config/config");
const logger = require("../config/logger");

/////////////////////Facebook

var signinFacebook = function (request, accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        console.log('profile--->',profile)
        passport.serializeUser(function (user, done) {
            done(null, user);
        });

        passport.deserializeUser(function (user, done) {
            done(null, user);
        });

        const validate = require('../config/validate');
        
        var validEmail = validate.email(request.query.state);
        var email;
        if (profile._json.email) {
            email = profile._json.email;
            request.body.verified = true;
        }
        else if (validEmail) {
            email = request.query.state;
            request.body.verified = false;
        }
        
        if (!email || !accessToken) {
            return done(null, { "email": "false" });
        }
        else {
            logger.debug('routes social fb');
            request.body.Email = email.toLowerCase();
            request.body.firstName = profile._json.first_name;
            request.body.middleName = profile._json.middle_name;
            request.body.lastName = profile._json.last_name;
            request.body.socialId = profile._json.id;
            request.body.profilePic = profile.photos[0].value || '';
            request.body.accessToken = accessToken;
            request.body.Social = "facebook";
            request.body.appCall = (request.query.state === 'true');
            var response = {
                send: function () {
                    return;
                }
            };
            dbOperations.socialSignin(request, response, done);
        }
    })
}

passport.use(new FacebookStrategy({
    passReqToCallback: true,
    clientID: secrets.FACEBOOK_CLIENT_ID,  // AppId
    clientSecret: secrets.FACEBOOK_CLIENT_SECRET,  // AppSecret
    callbackURL: secrets.reqUrl + "/social/auth/facebook/callback",
    profileFields: ['id', 'email', 'name']
}, signinFacebook));


router.get('/social-facebook', function (req, res, next) {

    passport.authenticate(
        'facebook', {
            scope: 'email',
            state: req.query.state
        }
    )(req, res, next);
});

router.get('/social-facebook-app', function (req, res, next) {

    req.query.appCall = true;
    passport.authenticate(
        'facebook', {
            scope: 'email',
            state: req.query.role
        }
    )(req, res, next);
});

//////Token Based

passport.use( new FacebookTokenStrategy({
    passReqToCallback: true,
    clientID: '319018306010196',
    clientSecret: '5f7adbd6dc40f1b8aff7795793e39717',
    // callbackURL: secrets.reqUrl + "/social/auth/facebook/callback",
    profileFields: ['id', 'email', 'name']
}, signinFacebook));


router.post('/auth/facebook', passport.authenticate('facebook-token', { scope: ['email'] }),function (req,res) {
    res.send(req.user);
});

///////Callback

router.get('/auth/facebook/callback', function (request, response) {
    passport.authenticate('facebook', function (req, res) {
        if (res && res.sessionId) {
            response.redirect('/?sid=' + res.sessionId);
        }
        else if (res && res.email) {
            response.redirect('/?email=false');
        }
        else {
            response.redirect('/');
        }
    })(request, response);
});


////////////Google 

var signinGoogle = function (request, accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
                console.log('update--->')

        passport.serializeUser(function (user, done) {
            done(null, user);
        });

        passport.deserializeUser(function (user, done) {
            done(null, user);
        });

        const validate = require('../config/validate');

        var validEmail = validate.email(request.query.state);

        console.log('profile====>',profile);

        var email;
        if (profile.emails[0].value) {
            email = profile.emails[0].value;
            request.body.verified = true;
        }
        else if (validEmail) {
            email = request.query.state;
            request.body.verified = false;
        }

        if(profile._json.picture){
            request.body.profilePic = profile.picture;
        }
        console.log('update--->')
        if (!email || !accessToken) {
            return done(null, { "email": "false" });
        }
        else {
            // console.log(profile._json);
            logger.debug('routes social google');
            request.body.Email = email.toLowerCase();
            request.body.profilePic = profile._json.picture || '';
            // console.log(request.body);
            request.body.firstName = profile._json.given_name;
            request.body.middleName = profile._json.middle_name;
            request.body.lastName = profile._json.family_name;
            request.body.socialId = profile.id;
            request.body.accessToken = accessToken;
            request.body.Social = "google";
            request.body.appCall = (request.query.state === 'true');
            var response = {
                send: function () {
                    return;
                }
            };
            console.log('singupp====>')
            dbOperations.socialSignin(request, response, done);
        }
    })
}



passport.use(new GoogleStrategy({
    clientID: secrets.GOOGLE_CLIENT_ID,
    clientSecret: secrets.GOOGLE_CLIENT_SECRET,
    callbackURL: secrets.reqUrl + "/social/auth/google/callback",
    passReqToCallback: true,
}, signinGoogle));


router.get('/social-google', function (req, res, next) {

    passport.authenticate(
        'google', {
            state: req.query.state,
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ]
        }
    )(req, res, next);
});

router.get('/social-google-app', function (req, res, next) {

    req.query.appCall = true;
    passport.authenticate(
        'google', {
            state: req.query.appCall,
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ]
        }
    )(req, res, next);
});

/////Token based

// passport.use(
//       new GoogleTokenStrategy(
//         {
//             clientID: secrets.GOOGLE_CLIENT_ID,
//             clientSecret: secrets.GOOGLE_CLIENT_SECRET,
//         },
//         function(accessToken, refreshToken, profile, done) {
//
//             // console.log(accessToken, refreshToken, profile, done)
//             return done(null, profile);
//
//           User.findOrCreate({ googleId: profile.id }, function(err, user) {
//             return done(err, user);
//           });
//         }
//       )
//     );

    // app.use('/auth/google', passport.authenticate('google-token'));
//
passport.use(new GoogleTokenStrategy({
    clientID: secrets.GOOGLE_CLIENT_ID,
    clientSecret: secrets.GOOGLE_CLIENT_SECRET,
    passReqToCallback: true,

}, signinGoogle));

router.post('/auth/google', passport.authenticate('google-token'),function (req,res) {
    console.log('response----->',res)
    res.send(req.user);
});



/////Callback

router.get('/auth/google/callback', function (request, response) {
    passport.authenticate('google', function (req, res) {
        if (res && res.sessionId) {
            response.redirect('/?sid=' + res.sessionId);
        }
        else if (res && res.email) {
            response.redirect('/?email=false');
        }
        else {
            response.redirect('/');
        }
    })(request, response);
});


router.post('/verify-sid', function (request, response) {
    logger.debug('routes social verifySid');

    dbOperations.verifySid(request.body.sid, request.userData.userId);

});



module.exports = router;