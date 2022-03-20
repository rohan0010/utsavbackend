'use strict';
//Schema for session database

const config = require('../config');
var mongoose;
if (config.sessionCaching === 'mongo') {
  mongoose = require('../connectionMem');
} else {
  mongoose = require('../connection');
}

const schema = mongoose.Schema;

const sessionSchema = new schema({
  sessionId: { type: String, unique: true, required: true },
  objectId: String,
  uuId: { type: String, required: true },
  userId: String,
  userEmail: String,
  tempEmail: String,
  username: String,
  mobile: String,
  role: String,
  registrationDate: Date,
  emailVerified: Boolean,
  temporaryMobile: String,
  mobile: String,

  userInfo: {
    firstName: String,
    lastName: String,
    area: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
  },
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
  createdAt: { type: Date, expires: '30d', default: Date.now },
});

const Session = mongoose.model(config.sessionCollection, sessionSchema);

module.exports = Session;
