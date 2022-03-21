'use strict';

const emails = {
    admin: "codingrohan835@gmail.com",

    verification: {
        subject: "Verify your Email",
        htmlBody: ""
    },
    password: {
        subject: "Reset your Password",
        htmlBody: ""
    },
    signupAdmin: {
        subject: "New user registered",
        htmlBody: ""
    },
    returnOrder: {
        subject:"Return Order",
        htmlBody:""
    },
    orderSuccessfull:{
        subject:"Order Success",
        htmlBody:`<!DOCTYPE html>
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
                               ZYLKAR CORPORATION
                            </td> 
                            <td align="right" style="padding: 0 0.5rem;letter-spacing: 0.1px;line-height:22px;color:#f66e3d;;font-size:large;font-family:arial;font-weight: 600;" >
                              INVOICE
                            </td>
                          </tr> 
                          <tr> 
                            <td align="left" style="padding: 0 0.5rem;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;" >
                              1561 Appleview Town<br>
                              Bakers Street<br>
                              Chicago, IL 60411
                            </td> 
                            <td align="right" style="padding: 0 0.5rem 2rem 0.5rem;letter-spacing: 0.1px;line-height:0;font-family:arial;color:gray;" >
                              #00121
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
                                    Alistair Burke
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
                                  <td width="10%" align="left" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-family:arial;border-right:2px solid #e6e4e4;" >
                                    ID
                                  </td>
                                  <td width="30%" align="left" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-family:arial;border-right:2px solid #e6e4e4;" >
                                    Work Description
                                  </td>
                                  <td width="15%" align="center" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-family:arial;border-right:2px solid #e6e4e4;" >
                                    Hours
                                  </td>
                                  <td width="15%" align="right" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-family:arial;border-right:2px solid #e6e4e4;" >
                                    Rate
                                  </td>
                                  <td width="30%" align="right" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-family:arial;" >
                                    Amount (In USD)
                                  </td>
                                </tr> 
                              </table>
                            </td> 
                          </tr>
                          <tr> 
                            <td width="100%" valign="top" align="left" style="padding:0 3.5rem;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;border-bottom:2px solid #e6e4e4;">
                              <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                <tr> 
                                  <td width="10%" align="left" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                    1
                                  </td>
                                  <td width="30%" align="left" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                    Construction Work
                                  </td>
                                  <td width="15%" align="center" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                    5
                                  </td>
                                  <td width="15%" align="right" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                    $50
                                  </td>
                                  <td width="30%" align="right" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                    $250.00
                                  </td>
                                </tr> 
                              </table>
                            </td> 
                          </tr>
                          <tr> 
                            <td width="100%" valign="top" align="left" style="padding:0 3.5rem;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;border-bottom:2px solid #e6e4e4;">
                              <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                <tr> 
                                  <td width="10%" align="left" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                    2
                                  </td>
                                  <td width="30%" align="left" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                    Archtect Planning
                                  </td>
                                  <td width="15%" align="center" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                    5
                                  </td>
                                  <td width="15%" align="right" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                    $100
                                  </td>
                                  <td width="30%" align="right" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                    $500.00
                                  </td>
                                </tr> 
                              </table>
                            </td> 
                          </tr>
                          <tr> 
                            <td width="100%" valign="top" align="left" style="padding:0 3.5rem;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;border-bottom:2px solid #e6e4e4;">
                              <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                <tr> 
                                  <td width="10%" align="left" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                    3
                                  </td>
                                  <td width="30%" align="left" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                    Painting
                                  </td>
                                  <td width="15%" align="center" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                    5
                                  </td>
                                  <td width="15%" align="right" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                    $1000
                                  </td>
                                  <td width="30%" align="right" style="padding: 1rem 0.5rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                    $5000.00
                                  </td>
                                </tr> 
                              </table>
                            </td> 
                          </tr>
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
                                    $5750.00
                                  </td>
                                </tr> 
                              </table>
                              <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0 2.3rem 0 0;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;border-bottom:2px solid #e6e4e4;">
                                <tr> 
                                  <td width="50%" align="left" style="padding: 1rem 1.8rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                    Tax Rate
                                  </td>
                                  <td width="50%" align="right" style="padding: 1rem 1.8rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                    5.00%
                                  </td>
                                </tr> 
                              </table>
                              <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0 2.3rem 0 0;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;">
                                <tr> 
                                  <td width="50%" align="left" style="padding: 1rem 1.8rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                    Tax
                                  </td>
                                  <td width="50%" align="right" style="padding: 1rem 1.8rem;letter-spacing: 0.1px;line-height:22px;font-family:arial;" >
                                    $287.50
                                  </td>
                                </tr> 
                              </table>
                              <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:0 2.3rem 0 0;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;">
                                <tr> 
                                  <td width="50%" align="left" style="padding: 1rem 1.8rem;letter-spacing: 0.1px;background-color: #f66e3d;color:white;line-height:22px;font-family:arial;" >
                                    Tax
                                  </td>
                                  <td width="50%" align="right" style="padding: 1rem 1.8rem;letter-spacing: 0.1px;background-color: #f66e3d;color:white;line-height:22px;font-family:arial;" >
                                    $287.50
                                  </td>
                                </tr> 
                              </table>
                            </td>
                          </tr>
                        </table>
                        <table border="0" cellspacing="0" cellpadding="0" width="100%" style="padding:2rem 3.5rem 2rem 3.5rem;">
                          <tr> 
                            <td width="100%" valign="top">
                              <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                <tr> 
                                  <td align="left" style="padding: 0 0.5rem 0.5rem 0.5rem;letter-spacing: 0.1px;line-height:22px;color:#f66e3d;font-family:arial;" >
                                    Payment Options
                                  </td>
                                </tr>
                                <tr> 
                                  <td align="left" style="padding: 0 0.5rem;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;" >
                                    Bank Account: 7102381318419, Bank of Chicago
                                  </td>
                                </tr>
                                <tr> 
                                  <td align="left" style="padding: 0 0.5rem;letter-spacing: 0.1px;line-height:22px;color:gray;font-family:arial;" >
                                    Pay Pal email address: payments@zylkarcorp.com
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
        </html>
                            
               `
                  
    },
    paymentreceived:{
        subject:"payment Success",
        htmlBody:""
    }
};

module.exports = emails;