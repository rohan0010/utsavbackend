'use strict';
const logger = require("./logger");

const validate = {

    username: function (string) {
        logger.debug('validate username');
        if (!string || typeof(string)!="string") {
            return false;
        }
        var string = string.trim();
        var letters = /^[A-Za-z0-9._]+$/;
        if (string.length < 5 || string.length > 20 || string.match(letters) === null) {
            return false;
        }
        else {
            return true;
        }
    },
    password: function (string) {
        logger.debug('validate password');
        if (!string || typeof(string)!="string") {
            return false;
        }
        var string = string.trim();
        var letters = /^[a-z0-9]+$/;
        if (string.length != 32 || string.match(letters) === null) {
            return false;
        }
        else {
            return true;
        }
    },
    email: function (string) {
        logger.debug('validate email');
        if (!string || typeof(string)!="string") {
            return false;
        }
        var string = string.trim();
        var comValid=true;
        var atpos = string.indexOf("@");
        var dotpos = string.lastIndexOf(".");
        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= string.length) {
            comValid=false;
        }
        var letters = /^[A-Z0-9a-z!@#$%&*+-/=?^_`'{|}~]+$/;
        if (string.length < 5 || string.length > 50 || string.match(letters) === null || string.match("@") === null || comValid===false) {
            return false;
        }
        else {
            return true;
        }
    },
    mobile: function (string) {
        logger.debug('validate mobile');
        if (!string || typeof(string)!="string") {
            return false;
        }
        var string = string.trim();
        var letters = /^[0-9]+$/;
        if (string.length != 10 || string.match(letters) === null) {
            return false;
        }
        else {
            return true;
        }
    },
    number: function (string) {
        logger.debug('validate number');
        if (!string || typeof(string)!="string") {
            return false;
        }
        var string = string.trim();
        var letters = /^[0-9]+$/;
        if (string.length < 3 || string.length > 15 || string.match(letters) === null) {
            return false;
        }
        else {
            return true;
        }
    },
    string: function (string) {
        logger.debug('validate string');
        if (!string || typeof(string)!="string") {
            return false;
        }
        var string = string.trim();
        var letters = /^[A-Za-z0-9-/_',.:@ ]+$/;
        if (string.length < 2 || string.length > 100 || string.match(letters) === null) {
            return false;
        }
        else {
            return true;
        }
    },
    name: function (string) {
        logger.debug('validate name');
        if (!string || typeof(string)!="string") {
            return false;
        }
        var string = string.trim();
        var letters = /^[A-Za-z ]+$/;
        if (string.length < 3 || string.length > 30 || string.match(letters) === null) {
            return false;
        }
        else {
            return true;
        }
    },
    code: function (string) {
        logger.debug('validate code');
        if (!string || typeof(string)!="string") {
            return false;
        }
        var string = string.trim();
        var letters = /^[A-Za-z0-9+]+$/;
        if (string.length < 2 || string.length > 16 || string.match(letters) === null) {
            return false;
        }
        else {
            return true;
        }
    },
    id: function (string) {
        logger.debug('validate id');
        if (!string || typeof(string)!="string") {
            return false;
        }
        var string = string.trim();
        var letters = /^[A-Za-z0-9]+$/;
        if (string.length < 8 || string.length > 35 || string.match(letters) === null) {
            return false;
        }
        else {
            return true;
        }
    },
    longString: function (string) {
        logger.debug('validate longstring');
        if (!string || typeof(string)!="string") {
            return false;
        }
        var string = string.trim();
        var letters = /^[A-Za-z0-9-/_',.:+#&=%()^*!@$ ]+$/;
        if (string.length < 2 || string.length > 5000 || string.match(letters) === null) {
            return false;
        }
        else {
            return true;
        }
    },
    stringArray: function (array) {
        logger.debug('validate stringArray');
        var that = this;
        if (!array || array.length < 1 || array.length > 50) {
            return false;
        }
        var valid = true;
        for (var i = 0; i < array.length; i++) {
            valid = that.string(array[i]);
            if (valid != true) {
                break;
            }
        }
        return valid;
    },
    stringObject:function (obj){
        logger.debug('validate stringObject');
        var that = this;
        if(obj){
            var allProperty = {
                valid:true
            };
            Object.keys(obj).forEach(function (key) {
                var valid = that.string(obj[key]);
                if (valid != true) {
                    allProperty.valid = false;
                }
            });
            return allProperty.valid;
        }
        else{
            return false;
        }
    },
    complexString: function (string) {
        logger.debug('validate string');
        if (string === undefined) {
            return false;
        }
        var string = string.trim();
        var letters = /^[A-Za-z0-9-/_',.!@#$%&?:*()+=|\x22 ]+$/;
        if (string.length < 2 || string.length > 500 || string.match(letters) === null) {
            return false;
        }
        else {
            return true;
        }
    },

    voucher: function (string) {
        logger.debug('validate voucher');
        if (string === undefined) {
            return false;
        }
        var string = string.trim();
        var letters = /^[a-z0-9]+$/;
        if (string.length < 2 || string.length > 7 || string.match(letters) === null) {
            return false;
        }
        else {
            return true;
        }
    },
    date: function(date){
        if (Object.prototype.toString.call(date) === "[object Date]") {
            if (isNaN(date.getTime())) {  // d.valueOf() could also work
                return false;
            } else {
               return true;
            }
        } else {
            return false;
        }
    },
};

module.exports = validate;
