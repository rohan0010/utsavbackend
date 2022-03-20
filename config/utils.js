'use strict';

const config = require('./config');
const Session = require('./schemas/sessionschema');
const logger = require('./logger');
var pdf = require('html-pdf');
const orderOps = require('../config/crudoperations/orders');

const { response } = require('..');

const utils = {
  fillSession: function (request, response, result, responseObject) {
    logger.debug('config utils fillSession');

    //data is freezed object so no issue till not adding any new property
    var userData = result;
    userData.password = undefined;
    userData.salt = undefined;
    userData.passwordTokenStamp = undefined;
    userData.emailActivationToken = undefined;
    userData.forgotPasswordToken = undefined;
    userData.mobileVerificationCode = undefined;
    userData.mobileTokenStamp = undefined;
    userData.social = undefined;
    // console.log('jwt4','error')

    const jwtOps = require('./jwt');

    jwtOps.fillJwtSession(request, userData, function (userData2) {
      if (userData2) {
        userData2.uuId = undefined;
        responseObject.userData = userData2;
        response.send(responseObject);
        if (responseObject.callback) {
          responseObject.callback(null, userData2);
        }
      }
    });
  },

  appSessionDestroy: function (id, response) {
    logger.debug('config utils appSessionDestroy');

    Session.find({ sessionId: id }).remove(function (error, result) {
      if (error) {
        logger.error(error);
        utils.response(response, 'fail');
      } else {
        logger.debug('crud result');
        utils.response(response, 'success');
      }
    });
  },

  sendMail: function (To, Subject, EmailText, Html_Body) {
    logger.debug('config utils sendMail');
    const nodeMailer = require('nodemailer');
    var URL =
      'smtps://' +
      config.SMTPS_EMAIL +
      ':' +
      config.SMTPS_PASSWORD +
      '@' +
      config.SMTPS_URL;
    var transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'utsavplastotech@gmail.com',
        pass: 'aayansh@2020',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    // setup e-mail data with unicode symbols
    var mailOptions = {
      from: 'utsavplastotech@gmail.com', // sender address
      to: To, // list of receivers
      subject: Subject, // Subject line
      text: EmailText, // plaintext body
      html: Html_Body, // html body
    };
    // var transporter = nodeMailer.createTransport(URL);
    // // setup e-mail data with unicode symbols
    // var mailOptions = {
    //     from: config.COMPANY_NAME + '<h=' + config.SMTPS_EMAIL + '>', // sender address
    //     to: To, // list of receivers
    //     subject: Subject, // Subject line
    //     text: EmailText, // plaintext body
    //     html: Html_Body // html body
    // };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        logger.error(error);
        console.log('Dd', error);
      }
      if (info != undefined) {
        console.log('Rohan', info);
        logger.info('Message sent: ' + info.response);
      } else {
        console.log('Rohan', info);
        logger.error('error sending mail');
      }
    });
  },

  randomStringGenerate: function (x) {
    logger.debug('config utils randomStringGenerate');
    const randomString = require('randomstring');
    return randomString.generate(x);
  },

  randomNumberString: function (length = 6) {
    return Math.random().toString().split('.')[1].substr(2, length);
  },

  randomNumberGenerate: function (min, max) {
    logger.debug('utils randomNumberGenerate');
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  sendSms: function (number, body) {
    logger.debug('config utils sendSms');
    // const twilio = require("twilio");
    // var accountSid = config.TWILIO_ACCOUNT_SID;
    // var authToken = config.TWILIO_AUTH_TOKEN;
    // const twilio = require("twilio");
    // var accountSid = "ACcfed10abddb4cd181a04e5b1e4283abe";

    // var authToken = "f7b14b289368778c42324b91c5930c1e";

    // var to = "+18647127508";

    // var client = new twilio.RestClient(accountSid, authToken);

    // client.messages.create({
    //     body: body,
    //     to: "+917042890193",  // Text this number
    //     from: to, // From a valid Twilio number
    // }, function (error, message) {
    //     if (error) {
    //         console.log("rj",error)
    //         logger.error(error);
    //     }
    //     else {
    //         console.log("sss",message)
    //         logger.info(message.sid);
    //     }
    // });
    //         var schtimestart='2020-10-03';
    //         var schstop='18:29:20'
    //         var msg912=require('msg91-sms');

    // msg912.sendOne('342735ADeN1rNE5f6d98d4P1',"+9188002282903","Oye After dekhi tune??",'ZIGAROO',4,'91',function(response){

    //   //Returns Message ID, If Sent Successfully or the appropriate Error Message
    //   console.log(response);
    //   });

    // msg912.scheduleOne('342735ADeN1rNE5f6d98d4P1',"+917042890193","Picchu Picchu Picchu",'ZIGAROO',4,'91',schtimestart,schstop,function(response){
    //   console.log("rohhaannn",response)
    // })

    const msg91 = require('msg91')('361330ADluy5BU60ad12f0P1', 'alaromaleafs', 4);
    msg91.send(number, body, function (error, response) {
      if (error) {
        logger.error(error);
      } else {
        logger.info(response);
      }
    });
  },

  createMail: function (userdata, type) {
    logger.debug('utils create mail', type, userdata);
    const emails = require('./emails');
    var that = this;
    var text = '';
    switch (type) {
      case 'verificationlink':
        text = 'Please verify your email by clicking ' + userdata.url;
        that.sendMail(
          userdata.email,
          emails.verification.subject,
          text,
          emails.verification.htmlBody
        );
        break;

      case 'forgotpassword':
        text = 'Set a new password by clicking ' + userdata.url;
        that.sendMail(
          userdata.email,
          emails.password.subject,
          text,
          emails.password.htmlBody
        );
        break;

      case 'signupadmin':
        var to = [emails.admin];
        text =
          'New ' +
          userdata.role +
          ' registered with email: ' +
          userdata.userEmail;
        that.sendMail(
          to,
          emails.signupAdmin.subject,
          text,
          emails.signupAdmin.htmlBody
        );
        break;
      case 'returnOrder':
        console.log('rohan', userdata);
        var to = [emails.admin, userdata.userEmail];

        text =
          `Order successfully Cancelled for order Id: 
           ${userdata.orderId}\n
          Reason: ${userdata.content}\n 
          Product Id: ${userdata.productId}\n
          Variant Id: ${userdata.variantId} \n
          Product Title ${userdata.title} \n
          Name:${ userdata.userInfo.firstName+userdata.userInfo.lastName} \n
          Mobile:${userdata.mobile}`
        that.sendMail(
          to,
         "CancelOrder",
          text,
          emails.returnOrder.htmlBody
        );
        break;
        case 'DeliveredOrder':
          console.log('rohan', userdata);
          var to = [emails.admin, userdata.userEmail];
           var html1000=''
           html1000 += ` <p>Order successfully Delivered for order Id ${userdata.orderId}</p>
           <p>Click On this link to download your invoice  <a href=${userdata.invoiceLink}> ${userdata.invoiceLink}</a> `;
          // text = 'Order successfully Delivered for order Id ' + userdata.orderId+"\n";
          // text=text+'Download Invoice by clicking on this link'
          that.sendMail(to, 'Delivered Order', userdata.text, "");
          break;
      case 'ShippedOrder':
        console.log('rohan', userdata);
        var to = [emails.admin, userdata.userEmail];

        text = userdata.text;
        that.sendMail(to, 'Shipped Order', text, "");
        break;
      case 'orderSuccessfull':
        var to = [emails.admin, userdata.useremail];
        var html = '';
        var html1=''
        // text = "Order return request for order Id " + userdata.orderId + " from " + userdata.useremail+" userId "+ userdata.userId;
        var result = userdata.result2;
        console.log('rohanjha', result.products);
        text = 'Your Order '+result.address.firstName+" "+result.address.lastName+" "+"OrderId:"+" " + result.orderId + ' placed successfully. \n';
        var products = userdata.products;
        var today = new Date();
        var dd = today.getDate();
        var sub=0
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) {
          dd = '0' + dd;
        }

        if (mm < 10) {
          mm = '0' + mm;
        }
        var qtytotal=0;
        var grosstotal=0;
        var disctotal=0;
        var taxtotal=0
        var ttotal=0
        var txsum=0
        today = dd + '-' + mm + '-' + yyyy;
        result.products.forEach((prdt, index) => {
          console.log(index);
          sub+=(prdt.price-prdt.tax)*prdt.quantity
          qtytotal+=prdt.quantity
          grosstotal+=prdt.price*prdt.quantity
          disctotal+= 
            ((prdt.price*prdt.quantity)*result.couponDiscount)/100
           
          txsum+=(((prdt.price*prdt.quantity)-(((prdt.price*prdt.quantity)*result.couponDiscount)/100)))/1.18
          taxtotal+=(((((prdt.price*prdt.quantity)-(((prdt.price*prdt.quantity)*result.couponDiscount)/100)))/1.18))*18/100
          ttotal+=(prdt.quantity * (prdt.price-(parseFloat(
            (prdt.price*result.couponDiscount)/100
           ).toFixed(2))))
          text =
            text +
            `Product ${index+1}: \n ProductTitle ${prdt.title}(${prdt.variant1.name}:${
              prdt.variant1.value
            }\n  Price:${prdt.price}\n Quantity ${prdt.quantity}\n`;

            html1+=`<tr> 
            <td align="left" width="20%" valign="top" style="padding:0rem 0.5rem 0rem 0.5rem;letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;" >
                <table border="0" cellspacing="0" cellpadding="0" width="100%">
                    <tr> 
                        <td align="left" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;" >
                        ${prdt.title}
                        </td>  
                    </tr>
                    <tr> 
                       
                    </tr> 
                </table>
            </td> 
            <td align="left" width="24%" valign="top" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;" >
                <table border="0" cellspacing="0" cellpadding="0" width="100%">
                    <tr> 
                        <td align="left" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial; font-weight: 550;" >
                        ${prdt.title}(${prdt.variant1.name}:${
                          prdt.variant1.value
                        })<br>
                        ₹ ${prdt.price}
                        </td>  
                    </tr>
                    <tr> 
                      
                    </tr> 
                    <tr> 
                      
                    </tr>
                    <tr> 
                     
                    </tr>  
                </table> 
            </td>
            <td align="center" width="30px" valign="top" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;font-weight: 550;" >
            ${prdt.quantity}
            </td>
            <td align="center" width="100px" valign="top" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;font-weight: 550;" >
            ${parseFloat(prdt.price*prdt.quantity).toFixed(2)}
            </td>
            <td align="center" width="75px" valign="top" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;font-weight: 550;" >
                                            -${parseFloat(
                                                  ((prdt.price*prdt.quantity)*result.couponDiscount)/100
                                                 ).toFixed(2)}
            </td>
            <td align="center" width="75px" valign="top" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;font-weight: 550;" >
              ${parseFloat((((prdt.price*prdt.quantity)-(((prdt.price*prdt.quantity)*result.couponDiscount)/100)))/1.18).toFixed(2)}
            </td>
            <td align="center" width="75px" valign="top" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;font-weight: 550;" >
            ${parseFloat((((((prdt.price*prdt.quantity)-(((prdt.price*prdt.quantity)*result.couponDiscount)/100)))/1.18))*18/100).toFixed(2)}
            </td>
           
            <td align="center" width="90px" valign="top" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;font-weight: 550;" >
            ${parseFloat(prdt.quantity * (prdt.price-(parseFloat(
              (prdt.price*result.couponDiscount)/100
             ).toFixed(2)))).toFixed(2)}
            </td>
        </tr> `
          html += `    <tr> 
                     <td width="100%" valign="top" align="left" style="padding:0 3.5rem;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;border-bottom:2px solid #e6e4e4;">
                       <table border="0" cellspacing="0" cellpadding="0" width="100%">
                         <tr> 
                         <td width="30%" align="left" style="letter-spacing: 0.1px;font-size:10px;line-height:22px;font-family:arial;" >
                         ${prdt.title}(${prdt.variant1.name}:${
            prdt.variant1.value
          }<br>
                          ${prdt.variant2.name}:${prdt.variant2.value})
                         </td>
                           <td width="15%" align="center" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;font-size:10px;line-height:22px;font-family:arial;" >
                           ${parseFloat(prdt.price-prdt.tax).toFixed(2)}
                           </td>
                           <td width="15%" align="center" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;font-size:10px;line-height:22px;font-family:arial;" >
                           ${parseFloat(prdt.tax).toFixed(2)}
                           </td>
                           <td width="15%" align="center" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;font-size:10px;line-height:22px;font-family:arial;" >
                           ${prdt.quantity}
                           </td>
                          
                           <td width="30%" align="right" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;font-size:10px;line-height:22px;font-family:arial;" >
                           ${parseFloat(prdt.quantity * (prdt.price-prdt.tax)).toFixed(2)}
                           </td>
                         </tr> 
                       </table>
                     </td> 
                   </tr>`;
        });
        text =
          text +
          `Shipping Address: \n TO:${result.address.firstName+" "+result.address.lastName} \n AREA:${result.address.area}\nCITY:${result.address.city}\nSTATE:${result.address.state}\n\n`;
          text = text + `Total Order Price is ${result.grandTotal}`;

      

        var htmlBody=`<!DOCTYPE html>
        <html xmlns="http://www.w3.org/1999/xhtml">
          <head>
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="padding:0; margin:0">
            <table width="800" cellspacing="0" cellpadding="0" bgcolor="#" style="margin:0 auto;">
              <tr>
                <td style="background:#fff; " width="100%" valign="top">
                  <table width="800" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td valign="top">
                        <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0.5rem 1.5rem 0rem 1.5rem;">
                            <tr> 
                              <td align="center" style="padding: 0 0.5rem;letter-spacing: 0.1px;line-height:22px;color:#000000;font-size:17px;font-family:arial;font-weight: 550;" >
                                Tax Invoice
                              </td>  
                            </tr> 
                        </table>
                        <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0rem 1rem 0rem 1rem;">
                            <tr> 
                                <td align="left" style="letter-spacing: 0.1px;line-height:22px;color:#000000;font-size:13px;font-family:arial;" >
                                  <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0.5rem 0.5rem 0.2rem 0.5rem;">
                                      <tr> 
                                        <td align="left" width="60%" style="letter-spacing: 0.1px;line-height:22px;color:#000000;font-size:13px;font-family:arial;" >
                                            <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                <tr> 
                                                  <td align="left" style="letter-spacing: 0.1px;font-family:arial;font-weight: 550;" >
                                                    Sold By: S E Herbal ,
                                                  </td>
                                                </tr> 
                                                <tr> 
                                                  <td align="left" style="letter-spacing: 0.1px;line-height:22px; font-size:11px;font-family:arial;" >
                                                    <i><strong>Ship-from Address: </strong>  K-149, Site-V,UPSIDC,Kasna, Greater Noida uttar pradesh 201308,India </i>
                                                  </td>
                                                </tr>
                                                <tr> 
                                                  <td align="left" style="letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                                    <strong>GSTIN - </strong> 09AEDFS0173D1Z9
                                                  </td>
                                                </tr> 
                                            </table>
                                        </td> 
                                        <td align="right" valign="top" width="33%" style="padding: 0 0.5rem;letter-spacing: 0.1px;line-height:22px;font-size:13px;font-family:arial;" >
                                            <table border="0" cellspacing="0" cellpadding="0" width="100%"> 
                                                <tr> 
                                                  
                                                </tr> 
                                            </table>
                                        </td>
                                      </tr>  
                                  </table>
                                </td>  
                              </tr>   
                        </table> 
                        <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0rem 1rem 0rem 1rem;">
                            <tr> 
                              <td align="left" width="60%" style="letter-spacing: 0.1px;line-height:22px;color:#000000;font-size:13px;font-family:arial;border-top:2px solid black;" >
                                <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0.5rem 0rem 0.5rem 0rem;">
                                    <tr> 
                                      <td align="left" valign="top" style="padding:0 0.5rem;letter-spacing: 0.1px;line-height:22px;color:#000000;font-size:13px;font-family:arial;" >
                                          <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                              <tr> 
                                                <td align="left" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;" >
                                                    <strong>Order ID:   ${result.orderId}</strong>
                                                </td>
                                              </tr> 
                                              <tr> 
                                                <td align="left" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;" >
                                                  <strong>Order Date: </strong>  ${today}
                                                </td>
                                              </tr>
                                              <tr> 
                                                <td align="left" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;" >
                                                  <strong>Invoice Date: </strong>  ${today}
                                                </td>
                                              </tr>
                                              <tr> 
                                                <td align="left" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;" >
                                                  <strong>PAN: </strong> AEDFS0173D
                                                </td>
                                              </tr>
                                              <tr> 
                                                <td align="left" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;" >
                                                </td>
                                              </tr>
                                          </table>
                                      </td> 
                                      <td align="left" width="27%" style="padding:0 0.5rem;letter-spacing: 0.1px;line-height:22px;color:#000000;font-size:13px;font-family:arial;" >
                                          <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                              <tr> 
                                                <td align="left" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;" >
                                                    <strong>Bill To</strong>
                                                </td>
                                              </tr>
                                              <tr> 
                                                <td align="left" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;" >
                                                    <strong> ${
                                                                                          result.billing_address.firstName +
                                                                                          ' ' +
                                                                                          result.billing_address.lastName
                                                                                        }</strong>
                                                </td>
                                              </tr> 
                                              <tr> 
                                                <td align="left" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;" >
                                                                                   ${result.billing_address.area},
                                                                                   ${result.billing_address.city},<br>
                                                                                   ${result.billing_address.state},${
                                                  result.billing_address.country
                                                },${result.billing_address.pincode}
                                                </td>
                                              </tr>
                                              <tr> 
                                                <td align="left" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;" >
                                                    Phone: <span>${ userdata.mobile}</span>
                                                </td>
                                              </tr> 
                                          </table>
                                      </td>
                                      <td align="left" width="27%" style="padding:0 0.5rem;letter-spacing: 0.1px;line-height:22px;color:#000000;font-size:13px;font-family:arial;" >
                                        <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                            <tr> 
                                              <td align="left" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;" >
                                                  <strong>Ship To</strong>
                                              </td>
                                            </tr>
                                            <tr> 
                                              <td align="left" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;" >
                                                  <strong> ${
                                                    result.address.firstName +
                                                    ' ' +
                                                    result.address.lastName
                                                  }</strong>
                                              </td>
                                            </tr> 
                                            <tr> 
                                              <td align="left" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;" >
                                              ${result.address.area},
                                              ${result.address.city},<br>
                                              ${result.address.state},${
             result.address.country
           },${result.address.pincode}
                                              </td>
                                            </tr>
                                            <tr> 
                                              <td align="left" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;" >
                                              Phone: <span>${ userdata.mobile}</span>
                                            </tr> 
                                        </table>
                                    </td>
                                    <td align="left" width="17%" valign="center" style="padding:0 0.5rem;letter-spacing: 0.1px;line-height:22px;color:#000000;font-size:13px;font-family:arial;" >
                                        <table border="0" cellspacing="0" cellpadding="0" width="100%">  
                                            <tr> 
                                              <td align="right" style="letter-spacing: 0.1px;line-height:22px; font-size:11px;font-family:arial;" >
                                               
                                              </td>
                                            </tr> 
                                        </table>
                                    </td>
                                    </tr>  
                                </table>
                              </td>  
                            </tr>  
                        </table>
                        <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0rem 1rem 0rem 1rem;">
                            <tr>
                                <td align="left" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;" >
                                    Total items: ${result.products.length}
                                </td>
                            </tr>
                            <tr> 
                              <td align="left" width="60%" style="letter-spacing: 0.1px;line-height:22px;color:#000000;font-size:13px;font-family:arial;border-top:2px solid black;" >
                                <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0.5rem 0rem 0.5rem 0rem;">
                                    <tr> 
                                        <td align="left" valign="top" style="padding:0 0.5rem;letter-spacing: 0.1px;line-height:22px;color:#000000;font-size:13px;font-family:arial;" >
                                            <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                <tr> 
                                                    <td align="left" width="20%" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;font-weight: 550;" >
                                                        Product 
                                                    </td> 
                                                    <td align="left" width="24%" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;font-weight: 550;" >
                                                        Title 
                                                    </td>
                                                    <td align="center" width="30px" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;font-weight: 550;" >
                                                        Qty 
                                                    </td>
                                                    <td align="center" width="100px" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;font-weight: 550;" >
                                                        Gross Amount ₹ 
                                                    </td>
                                                    <td align="center" width="75px" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;font-weight: 550;" >
                                                        Discount ₹ 
                                                    </td>
                                                    <td align="center" width="90px" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;font-weight: 550;" >
                                                        Taxable Value ₹ 
                                                    </td>
                                                    <td align="center" width="75px" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;font-weight: 550;" >
                                                        Tax ₹
                                                    </td>
                                                    <td align="center" width="90px" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;font-weight: 550;" >
                                                        Total ₹
                                                    </td>
                                                </tr> 
                                            </table>
                                        </td>  
                                    </tr>  
                                </table> 
                              </td>  
                            </tr> 
                            <tr> 
                                <td align="left" valign="top" style="letter-spacing: 0.1px;line-height:22px;color:#000000;font-size:13px;font-family:arial;border-top:2px solid black;" >
                                  <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0.5rem 0rem 0.5rem 0rem;">
                                                     ${html1}

                                  </table> 
                                </td>  
                            </tr>  
                        </table> 
                        <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0rem 1rem 0rem 1rem;">
                            <tr> 
                                <td align="left" width="20%" valign="top" style="letter-spacing: 0.1px;line-height:22px;color:#000000;font-size:13px;font-family:arial;" ></td>
                                <td align="left" width="80%" valign="top" style="letter-spacing: 0.1px;line-height:22px;color:#000000;font-size:13px;font-family:arial;border-top:2px solid black;" >
                                  <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0.5rem 0rem 0.5rem 0rem;">
                                    <tr>  
                                        <td align="left" valign="top" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;" >
                                            <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                <tr> 
                                                    <td align="center" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial; font-weight: 550;" >
                                                        Total
                                                    </td>  
                                                </tr>  
                                            </table> 
                                        </td>
                                        
                                        <td align="right" width="30px" valign="top" style="letter-spacing: 0.1px;line-height:22px;padding:0rem 0rem 0rem 9.2rem; font-size:13px;font-family:arial;font-weight: 550;" >
                                           ${qtytotal} 
                                        </td>
                                        <td align="left" width="100px" valign="top" style="letter-spacing: 0.1px;line-height:22px;padding:0rem 0rem 0rem 2.5rem; font-size:13px;font-family:arial;font-weight: 550;" >
                                        ${parseFloat(grosstotal).toFixed(
                                                                               2
                                                                             )}
                                        </td>
                                        
                                        <td align="left" width="75px" valign="top" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;font-weight: 550;" >
                                        -${parseFloat(disctotal).toFixed(
                                          2
                                        )}
                                        </td>
                                        <td align="left" width="90px" valign="top" style="letter-spacing: 0.1px;padding:0rem 0rem 0rem 0.8rem;line-height:22px; font-size:13px;font-family:arial;font-weight: 550;" >
                                        ${parseFloat(txsum).toFixed(2)}

                                      </td>
                                        <td align="left" width="75px" valign="top" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;font-weight: 550;" >
                                        ${parseFloat(taxtotal).toFixed(2)}
                                        </td>
                                      
                                        <td align="center" width="90px" valign="top" style="letter-spacing: 0.1px;line-height:22px; font-size:13px;font-family:arial;font-weight: 550;" >
                                        ${parseFloat(ttotal).toFixed(
                                          2
                                        )}
                                        </td>
                                    </tr> 
                                  </table> 
                                </td>  
                            </tr> 
                        </table>
                      
                        <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0rem 1rem 0rem 1rem;">
                            <tr>
                                <td align="left" width="65%" valign="top" style="letter-spacing: 0.1px;line-height:22px;color:#000000;font-size:13px;font-family:arial;border-top:2px solid black;" ></td>
                                <td align="right" width="35%" valign="top" style="letter-spacing: 0.1px;line-height:22px;color:#000000;font-size:13px;font-family:arial;border-top:2px solid black;" >
                                  <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0.5rem 0rem 0.5rem 0rem;">
                                    <tr>  
                                 
                                                                    
                                        <td align="right" valign="top" style="letter-spacing: 0.1px;line-height:22px; font-size:15px;font-family:arial;" >
                                            <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                <tr> 
                                                
                                                    <td align="right" style="letter-spacing: 0.1px;line-height:22px; font-size:17px;font-family:arial;" >
                                                        Grand Total
                                                    </td>  
                                                </tr>  
                                            </table> 
                                        </td> 
                                        <td align="right" valign="top" style="letter-spacing: 0.1px;line-height:22px; font-size:15px;font-family:arial;" >
                                            <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                <tr> 
                                                    <td align="right" style="letter-spacing: 0.1px;line-height:22px; font-size:17px;font-family:arial; font-weight: 550;" >
                                                        ₹ ${result.grandTotal.toFixed(2)}
                                                    </td>  
                                                </tr>  
                                            </table> 
                                        </td> 
                                    </tr> 
                                  </table> 
                                  <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0rem 0rem 0.5rem 0rem;">
                                  <tr>
                                  <td align="right" valign="top" style="letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                  <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                  <tr> 
                                  <td align="right" style="letter-spacing: 0.1px;line-height:22px; font-size:17px;font-family:arial; font-weight: 550;" >
                                     Delivery Charges ₹ ${result.deliveryCharges.toFixed(2)}
                                  </td>  
                              </tr>  
                                  </table> 
                              </td>   
                                  </tr>
                                    <tr>  
                                        <td align="right" valign="top" style="letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                            <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                <tr> 
                                                    <td align="right" style="padding:100px 1rem 0 2rem;letter-spacing: 0.1px;line-height:22px;font-size:14px;font-family:arial;" >
                                                        Authorized Signatory
                                                    </td>  
                                                </tr>  
                                            </table> 
                                        </td>   
                                    </tr> 
                                  </table>
                                </td>  
                            </tr> 
                        </table>
                        <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0rem 1rem 0rem 1rem;">
                            <tr> 
                                <td align="right" width="35%" valign="top" style="letter-spacing: 0.1px;line-height:22px;color:#000000;font-size:13px;font-family:arial;border-top:2px solid black;" > 
                                  <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0rem 0rem 0.5rem 0rem;">
                                    <tr>  
                                        <!-- <td align="right" valign="top" style="letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                            <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                <tr> 
                                                    <td align="right" style="padding: 100px 0.5rem 0 0.5rem;letter-spacing: 0.1px;line-height:22px;font-size:12px;font-family:arial;" >
                                                        <img src="https://www.theindianwire.com/wp-content/uploads/2018/10/amazon-flipkart.jpeg" alt="logo" style="max-width: 100px;height: auto;">
                                                    </td>  
                                                </tr>  
                                            </table> 
                                        </td>   -->
                                    </tr>  
                                  </table>
                                  <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0rem 0rem 0rem 0rem;">
                                    <tr>   
                                        <td align="left" valign="top" style="letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                            <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                <tr> 
                                                    <td align="left" style="letter-spacing: 0.1px;line-height:22px;font-size:12px;font-family:arial;" >
                                                        <strong>Returns Policy:</strong>
                                                        Once products are delivered to you and accepted as accurate and as per the original order, there is no refund or exchange possible. To return any items that are damaged or not as per your original order, Please contact customer service within 48 hours from the time of delivery along with images of the delivered product and their tags. All damaged items or items not as per your order that are to be returned must be accompanied by a copy of the original receipt, a return / exchange authorization number and in unopened, saleable condition, otherwise the same will not taken back. Postage and charges for return of these will not be refunded. Please note that we cannot offer exchanges or refunds on any sale any opened or used products. Please allow one to three weeks from the day you return your damaged package or an item not as per your order, for your refund request to be processed. You will be contacted once your return is complete.     </td>  
                                                </tr> 
                                                <tr> 
                                                    <td align="left" style="padding: 0.2rem 0 0.2rem 0;letter-spacing: 0.1px;line-height:22px;font-size:12px;font-family:arial;font-style: italic;" >
                                                        The goods sold as are intended for end user consumption and not for re-sale.                                          
                                                    </td>  
                                                </tr>
                                                <tr> 
                                                    <td align="left" style="padding: 0.2rem 0 0.2rem 0;letter-spacing: 0.1px;line-height:22px;font-size:12px;font-family:arial;font-style: italic;" >
                                                        Regd. office: <strong>: S E Herbal</strong> K-149, Site-V,UPSIDC,Kasna, Greater Noida uttar pradesh 201308,India                                       
                                                    </td>  
                                                </tr>  
                                            </table> 
                                        </td>   
                                    </tr>  
                                  </table>
                                </td>  
                            </tr> 
                        </table>
                        <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0rem 1rem 0rem 1rem;">
                            <tr>
                                <td align="left" width="35%" valign="top" style="letter-spacing: 0.1px;line-height:22px;color:#000000;font-size:13px;font-family:arial;font-weight: 550;" >Contact 
                                    S E Herbal: utsavplastotech@gmail.com</td>
                            </tr>
                            <tr> 
                              
                                    </tr>  
                                  </table>
                                </td>  
                            </tr> 
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>`
      
        console.log('Rohanjha', text);
        var options = { format: 'A3' };
        const name =
          result.orderId + Math.floor(Math.random() * 100 + 54) + '.pdf';
        pdf
          .create(htmlBody, options)
          .toFile('./public/Invoice' + '/invoice' + name, function (err, res) {
            if (err) return console.log(err);
            //   response.json('success',{url:'/ftp/Invoice/'+name});
            // response.json({ url: '/ftp/Invoice/invoice'+name , success: true, code: 200 });
            let url = '/ftp/Invoice/invoice' + name;
            orderOps.updateProperty(result.orderId, url, function () {});

            console.log(res); // { filename: '/app/businesscard.pdf' }
          });
          const twilio = require("twilio");
          var accountSid = "ACb0b9cc1b92409727583e3d354d405dad";
          var authToken = "1f381d653784842882a0f096677f1ac4";
  
          var client = new twilio.RestClient(accountSid, authToken);
  
          client.messages.create({
              body: text,
              to: userdata.mobile,  // Text this number
              from: "+1 201 817 4355", // From a valid Twilio number
          }, function (error, message) {
              if (error) {
                  logger.error(error);
              }
              else {
                  logger.info(message.sid);
              }
          });

        that.sendMail(to, emails.orderSuccessfull.subject, text, "");
        that.sendMail(emails.admin, emails.orderSuccessfull.subject, "",htmlBody);

        break;
      case 'orderinvoice':
        console.log('rjha', userdata[0].email, userdata[0].products);
        var to = userdata.useremail;
        var html = '';
        // text = "Order return request for order Id " + userdata.orderId + " from " + userdata.useremail+" userId "+ userdata.userId;
        var result = userdata.result2;
        console.log('rohanjha', result.products);
        text = 'Your Order ' + result.orderId + ' placed successfully. \n';
        var products = userdata.products;
        result.products.forEach((prdt, index) => {
          console.log(index);
          text =
            text +
            `PrdtTitle ${prdt.title} + Price:${prdt.price} + Quantity ${prdt.quantity}\n`;
          html += `    <tr> 
                       <td width="100%" valign="top" align="left" style="padding:0 3.5rem;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;border-bottom:2px solid #e6e4e4;">
                         <table border="0" cellspacing="0" cellpadding="0" width="100%">
                           <tr> 
                           <td width="30%" align="left" style="letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                           ${prdt.title}(${prdt.value})
                           </td>
                             <td width="15%" align="center" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                             $${prdt.price}
                             </td>
                            
                             <td width="15%" align="center" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                             ${prdt.quantity}
                             </td>
                            
                             <td width="30%" align="right" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                             $${prdt.quantity * prdt.price}
                             </td>
                           </tr> 
                         </table>
                       </td> 
                     </tr>`;
        });
        text =
          text +
          `Address: \n TO:${result.address.fullname} \n AREA:${result.address.area}\nCITY:${result.address.city}\nSTATE:${result.address.state}\nPINCODE:${result.address.pincode}\n\n`;

        text = text + `Total Order Price is ${result.grandTotal}`;
        var htmlBody = `<!DOCTYPE html>
                   <html xmlns="http://www.w3.org/1999/xhtml">
                     <head>
                         <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        
                     </head>
                     <body style="padding:0; margin:0">
                       <table width="600" cellspacing="0" cellpadding="0" bgcolor="#" style="margin:0 auto;">
                         <tr>
                           <td style="background:#fff; " width="100%" valign="top">
                             <table width="600" border="0" cellspacing="0" cellpadding="0">
                               <tr>
                                 <td valign="top" >
                                   <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:2.5rem 3.5rem 2rem 3.5rem;">
                                     <tr> 
                                       <td align="left" style="padding: 0 0.5rem;letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-size:15px;font-family:arial;font-weight: 550;" >
                                          MINI NEW YORK
                                       </td> 
                                     
                                     </tr> 
                                     <tr> 
                                       <td align="left" style="padding: 0 0.5rem;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;" >
                                         1561 Appleview Town<br>
                                         Bakers Street<br>
                                         Chicago, IL 60411
                                       </td> 
                                     
                                     </tr> 
                                   </table> 
                                   <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:2rem 3.5rem 2rem 3.5rem;background-color: #f9f9f9;">
                                     <tr> 
                                       <td width="60%" valign="top">
                                         <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                           <tr> 
                                             <td align="left" style="padding: 0 0.5rem 0.5rem 0.5rem;letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-size:15px;font-family:arial;font-weight: 550;" >
                                               Bill to:
                                             </td>
                                           </tr> 
                                           <tr> 
                                             <td align="left" style="padding: 0 0.5rem;letter-spacing: 0.1px;line-height:22px;color:gray;font-size:15px;font-family:arial;font-weight: 550;" >
                                             ${result.address.fullname}
                                             </td>
                                           </tr>
                                           <tr> 
                                             <td align="left" style="padding: 0 0.5rem;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;" >
                                             ${result.address.area}<br>
                                             ${result.address.city}<br>
                                             ${result.address.state},${result.address.pincode}
                                             </td>
                                           </tr> 
                                         </table>
                                       </td> 
                                       <td width="40%" valign="top">
                                         <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0.5rem 0.5rem 0 0;">
                                           <tr> 
                                             <td align="left" style="letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-family:arial;padding:0.2rem 0;" >
                                               Invoice Date
                                             </td>
                                             <td align="right" style="letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;padding:0.2rem 0;" >
                                               Apr 8, 2015
                                             </td>
                                           </tr> 
                                           <tr> 
                                             <td align="left" style="letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-family:arial;padding:0.2rem 0;" >
                                               Terms
                                             </td>
                                             <td align="right" style="letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;padding:0.2rem 0;" >
                                               30 days
                                             </td>
                                           </tr> 
                                           <tr> 
                                             <td align="left" style="letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-family:arial;padding:0.2rem 0;" >
                                               Due Date
                                             </td>
                                             <td align="right" style="letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;padding:0.2rem 0;" >
                                               May 8, 2015
                                             </td>
                                           </tr> 
                                         </table>
                                       </td> 
                                     </tr>
                                   </table>
                                   <table border="0" cellspacing="0" cellpadding="10" width="100%">
                                     <tr> 
                                       <td width="100%" valign="top" align="left" style="padding:0 3.5rem;letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-family:arial;border-bottom:2px solid #e6e4e4;">
                                         <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                           <tr> 
                                           <td width="30%" align="left" style="letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-family:arial;border-right:2px solid #e6e4e4;" >
                                           Product
                                          </td>
                                         
                                             <td width="15%" align="center" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-family:arial;border-right:2px solid #e6e4e4;" >
                                               Price
                                             </td>
                                          
                                             <td width="15%" align="right" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-family:arial;border-right:2px solid #e6e4e4;" >
                                               Quantity
                                             </td>
                                             <td width="30%" align="right" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-family:arial;" >
                                               Amount (In USD)
                                             </td>
                                           </tr> 
                                         </table>
                                       </td> 
                                     </tr>
                                   
                                 ${html}
                                 
                                   
                                   </table>
                                   <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                     <tr> 
                                       <td width="43%" valign="top" align="left" style="padding:0 0 0 3.5rem;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;">
                                         <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                           <tr> 
                                             <td width="10%" align="left" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                               thank you for your Business!
                                             </td>
                                           </tr> 
                                         </table>
                                       </td> 
                                       <td width="57%" valign="top" align="left">
                                         <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0 2.3rem 0 0;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;border-bottom:2px solid #e6e4e4;">
                                           <tr> 
                                             <td width="50%" align="left" style="padding: 1rem 1.8rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                               Subtotal
                                             </td>
                                             <td width="50%" align="right" style="padding: 1rem 1.8rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                             $${result.grandTotal}
                                             </td>
                                           </tr> 
                                         </table>
                                       
                                         <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0 2.3rem 0 0;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;">
                                           <tr> 
                                             <td width="50%" align="left" style="padding: 1rem 1.8rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                               Tax
                                             </td>
                                             <td width="50%" align="right" style="padding: 1rem 1.8rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                               $${result.totaltax}
                                             </td>
                                           </tr> 
                                         </table>
                                         <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0 2.3rem 0 0;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;">
                                           <tr> 
                                             <td width="50%" align="left" style="padding: 1rem 1.8rem;letter-spacing: 0.1px;background-color: #f66e3d;color:white;line-height:22px;font-family:arial;" >
                                               Tax
                                             </td>
                                             <td width="50%" align="right" style="padding: 1rem 1.8rem;letter-spacing: 0.1px;background-color: #f66e3d;color:white;line-height:22px;font-family:arial;" >
                                             $${result.totaltax}
                                             </td>
                                           </tr> 
                                         </table>
                                       </td>
                                     </tr>
                                   </table>
                                 
                                       </td>
                                     </tr>
                                   </table>
                                 </td>
                               </tr>
                             </table>
                           </td>
                         </tr>
                       </table>
                     </body>
                   </html>`;
        // that.sendSms("+917042890193",text)
        that.sendMail(to, emails.orderSuccessfull.subject, text, htmlBody);
        break;
      case 'paymentreceived':
        var to = data.uemail;

        text =
          text +
          `Amount:${data.amount} Product ${data.product} TransactionID ${data.txnid} Name ${data.name}`;

        that.sendMail(
          to,
          emails.paymentreceived.subject,
          text,
          emails.paymentreceived.htmlBody
        );
        break;
    }
  },

  response: function (response, type, message) {
    var message1 = '';
    switch (type) {
      case 'success':
        message1 = message || 'success';
        response.json({ message: message1, code: 200, success: true });
        break;
      case 'fail':
        message1 = message || 'Some error has occured, please try again later';
        response.json({ message: message1, code: 500, success: false });
        break;
      case 'unknown':
        message1 = message || 'Invalid Parameters';
        response.json({ message: message1, code: 400, success: false });
        break;
      case 'notFound':
        message1 = message || 'Not found';
        response.json({ message: message1, code: 404, success: false });
        break;
      case 'taken':
        message1 = message || 'Data already taken';
        response.json({ message: message1, code: 422, success: false });
        break;
      case 'unauthorized':
        message1 = message || 'Access denied';
        response.json({ message: message1, code: 401, success: false });
        break;
    }
  },
};

module.exports = utils;
