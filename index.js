'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mfavicon = require('express-favicon');
const authenticator = require('./config/session');
const RateLimit = require('express-rate-limit');
const serveIndex = require('serve-index');
const app = express();
const schedular = require('./config/schedular');

const config = require('./config/config');
const init = require('./config/init');

app.use(cors());
app.use(function (request, response, next) {
  response.header('Access-Control-Allow-Origin', '*');
  response.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, x-csrf-token, Accept, Authorization'
  );

  next();
});

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

//Limit request per IP

// app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

// var limiter = new RateLimit({
//   windowMs: 24 * 60 * 60 * 1000, // 24 hours/ 1 day
//   max: 500, // limit each IP to 500 requests per windowMs
//   delayAfter: 250, // begin slowing down responses after the 250th request
//   delayMs: 200, // disable delaying - full speed until the max limit is reached
//   handler: function (req, res, next) {
//     res.format({
//       json: function () {
//         res.status(401).json({ message: 'Too many requests, please try again later.', code: 401, success: false });
//       }
//     });
//   }
// });

// //  apply to all requests
// app.use(limiter);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(
  '/ftp',
  express.static('public'),
  serveIndex('public', { icons: true })
);
app.use(mfavicon(__dirname + '/public/favicon.icon'));

require('crashreporter').configure({
  outDir: './logs', // default to cwd
  exitOnCrash: true, // if you want that crash reporter exit(1) for you, default to true,
  maxCrashFile: 100, // older files will be removed up, default 5 files are kept
  // mailEnabled: true,
  // mailTransportName: 'SMTP',
  // mailTransportConfig: {
  //     service: 'Gmail',
  //     auth: {
  //         user: "yourmail@gmail.com",
  //         pass: "yourpass"
  //     }
  // },
  // mailSubject: 'advanced.js crashreporter test',
  // mailFrom: 'crashreporter <yourmail@gmail.com>',
  // mailTo: 'yourmail@gmail.com'
});

app.use(authenticator.jwtSession);

module.exports = app;

let routes = require('./routes');

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (config.env !== 'production') {
  //Error handler //comment in production
  const vm = require('vm');
  const logger2 = require('./config/logger');
  const Debug = vm.runInDebugContext('Debug'); // Obtain Debug object

  Debug.setListener((type, _, e) => {
    // listen for all debug events
    if (type == Debug.DebugEvent.Exception) {
      logger2.error(e.exception().stack); // e is an event object
    }
  });

  Debug.setBreakOnException(); // this is required for Exception event to fire
}
// else {
//   console.log("Production mode enabled");
//   // error handler
//   app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     //   res.render('error');
//   });
// }

init.superAdmin();
init.defaultRoleAssignment();
// schedular.scheduleMessages();

const { celebrate, Joi, errors } = require('celebrate');
app.use(errors());

module.exports = app;

app.listen(config.port, function () {
  console.log(`Server listening at port ${config.port}`);
});
