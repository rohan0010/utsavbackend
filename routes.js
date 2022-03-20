let app = require('./index');

const index = require('./routes/index');
const roles = require('./routes/roles');
const commonroutes = require('./routes/commonroutes');
const signup = require('./routes/signup');
const login = require('./routes/login');
const profile = require('./routes/profile');
const paypal = require('./routes/paypal');
const buynow = require('./routes/buynow');
const zip = require('./routes/zip');
const banner = require('./routes/banner');
const cms = require('./routes/cms');
const refer=require("./routes/refer")

const subscribe = require('./routes/subscribe');

const forgotpassword = require('./routes/forgotpassword');
const social = require('./routes/social');


const admindash =require('./routes/admindash');
const userdash =require('./routes/userdash');
const voucher =require('./routes/voucher');
const myorders = require('./routes/myorders');
const paymentgateway =require('./routes/paymentgateway');
const stats =require('./routes/stats');
const category=require('./routes/category')
const incash=require('./routes/incash')
const cashback=require('./routes/cashback')
const influencer=require('./routes/influencer')
const variants=require('./routes/variants')
const transaction=require('./routes/transaction')

app.use('/', index);
app.use('/roles', roles);
app.use('/commonroutes', commonroutes);
app.use('/signup', signup);
app.use('/login', login);
app.use('/profile', profile);
app.use('/incash',incash);
app.use('/forgotpassword', forgotpassword);
app.use('/social', social);
app.use('/category',category)
app.use('/variant',variants)
app.use("/refer",refer)

app.use('*', index);


app.use('/admindash',admindash);
app.use('/zip',zip);
app.use('/cms',cms);

app.use('/userdash',userdash);
app.use('/voucher',voucher);
app.use('/influencer',influencer);

app.use('/myorders',myorders);
app.use('/stats',stats);
app.use('/cashback',cashback);

app.use('/paypal',paypal)
app.use('/buynow',buynow)
app.use('/banner',banner)
app.use('/transaction',transaction)

app.use('/paymentgateway',paymentgateway.router);
app.use('/subscribe',subscribe);
