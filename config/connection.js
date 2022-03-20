'use strict';

const mongoose = require("mongoose");

const config = require("./config") 
const user = encodeURIComponent('myUserAdmin');
const password = encodeURIComponent('superadmin');
const authMechanism = 'admin';

// Connection URL
// const url = `mongodb://${user}:${password}@localhost:27017/alaaromaleafs?authSource=${authMechanism}&w=1`;


// mongoose.connect(config.dbUrl );
mongoose.connect(config.dbUrl, function (err) {
    // Log Error
    if (err) {
        console.log('Could not connect to MongoDB!',err);
        process.exit();
    } else {
        console.error('Connected to MongoDB!');
        // Enabling mongoose debug mode if required
        //   mongoose.set('debug', config.db.debug);

        // Call callback FN
        //   if (cb) cb(db);
    }
})

mongoose.Promise = require('q').Promise;

module.exports = mongoose;
