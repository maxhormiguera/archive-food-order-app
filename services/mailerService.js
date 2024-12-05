const express = require('express');
var nodemailer = require('nodemailer');
var Promise = require('bluebird');

var hf = require('../js/helperFunctions.js');

var mailerService = function () {

    let transporter = false;
    let mailOptions = {};
    
    mailOptions.from = '"FoodApp"';

    transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: 'jayela@meditab.com',
            clientId: '607175003857-ts0reb6d1j2qead470thkurkm6jleirq.apps.googleusercontent.com',
            clientSecret: 'tmWFpiLOmmOtf9Ztwaycjj9w',
            refreshToken: '1//04oAtxcm3vW7TCgYIARAAGAQSNwF-L9IrXKnnfYdBQd7g2Q1uw9yNWPWNmVJ0T8GbsrY5KPcDWOnw5xtYlDZ2JTJ_YC1rjDBfOAk',
            expires: 1484314697598
        },
        tls: {rejectUnauthorized: false}
    });

    function testEmail(req, res) {

        // setup email data with unicode symbols
        mailOptions = {from: '"FoodApp"',
            to: 'kenneths@meditab.com',
            subject: 'This is a test.', // Subject line
            text: 'Hello this is a Test...', // plain text body
            html: '<div style="margin: 0; padding: 10px 10px 10px 10px;"><table width="700px" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: 700px;" class="background"><tr><td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;background-color:#EAEAEA;"><br><br><br><table align="center" bgcolor="#FFFFFF" border="0" cellpadding="0" cellspacing="0" style="width: 600px;margin-top:15px;margin-bottom:20px;box-shadow: 0px 0px 15px 1px #808080;"><tbody><tr style="width: 600px;height: 50px;"><td> <a href="http://www.medvision-solutions.com/"><img src="https://s5.postimg.org/wppmzrm07/Email_1-12.png" width="600px"></a></td></tr><tr style="width: 600px;height: 240px;"><td style="background:url(\'https://s5.postimg.org/nys9gcyef/Email_1-03.png\');background-size:603px auto;"></td></tr><tr><td style="width: 600px; text-align: left; height: 64px;padding: 10px 65px 5px 65px;"><span style="font-size: 12pt; font-family: Helvetica, Tahoma, sans-serif;color:#2D2C2C;text-align:left;"><br><p style="line-height: 30px"> <b style="color:#4F86C6">QuickCap </b> provides you a total solution for your Managed Care Software. Our <b>‘All-Inclusive Software’</b> manages:<br><br> <img src="https://s5.postimg.org/wob3slusn/EMAIL_1_-_icons-04.png" width="110px"> <img src="https://s5.postimg.org/4n1nsnew3/EMAIL_1_-_icons-05.png" width="110px"> <img src="https://s5.postimg.org/8zvlxby8z/EMAIL_1_-_icons-06.png" width="110px"> <img src="https://s5.postimg.org/451wz1zxf/EMAIL_1_-_icons-07.png" width="110px"> <img src="https://s5.postimg.org/b6zul93j7/EMAIL_1_-_icons-08.png" width="110px"> <img src="https://s5.postimg.org/672edaxwj/EMAIL_1_-_icons-09.png" width="110px"> <img src="https://s5.postimg.org/4yeiro5yb/Email_1_-_icons-10.png" width="110px"> <img src="https://s5.postimg.org/fwps9uujn/Email_1-11.png" width="110px"> <br><br><center>If you want the best, give us a call.<br><br> <a href="http://www.medvision-solutions.com/"><img src="https://s5.postimg.org/r437vplbb/Email_1_-_button-14.png" width="230px";></a></center> <br><br> </span></tr></td><tr><td align="center" style="background-color:#4F86C6; padding: 25px 75px 25px 75px;color:#FFFFFF"><p style="font-weight: 100;font-size:14px;font-family:Helvetica, Tahoma, sans-serif;color:#FFFFFF;text-decoration: none;line-height: 20px"> Medvision • 3233 N. Arlington Heights Rd., Suite 307 Arlington Heights, IL 60004 • Email us at <a href="#" style="color:#FFFFFF">info@quickcap.net</a> • Call us at 847 222 1006 • Visit our website at <a href="http://www.medvision-solutions.com/" style="color:#FFFFFF;"><b>medvision-solutions.com</b></a></p></td></tr></tbody></table><br></tr></td></table></div>'
            
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            // create a promise version of this
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                console.log('Message sent: %s', info.messageId);
                res.json(info);
            }
        });
    };

    function setSubject(subject) {
        mailOptions.subject = subject;
        return mailOptions;
    }

    function setTextBody(textBody) {
        mailOptions.text = textBody;
        return mailOptions;
    }

    function setHTMLBody(htmlBody) {
        mailOptions.html = htmlBody;
        return mailOptions;
    }

    function setRecepient(recepient) {
        mailOptions.to = recepient;
        return mailOptions;
    }

    function setCC(cc) {
        mailOptions.cc = cc;
        return mailOptions;
    }

    function setBCC(bcc) {
        mailOptions.bcc = bcc;
        return mailOptions;
    }

    function setAttachments(attachments){
        mailOptions.attachments = attachments;
        return mailOptions;
    }

    function setMultiRecepients(recepientsArray) {
        // i validate pa tagsa2 una i join?
        // nya kung naay sayop na usa return og error. nya dili ma daun ang join.
        mailOptions.to = recepientsArray.join(', ');
        return mailOptions;
    }

    function setMailOptions(mailOptionsObj) {
        // kung mag butang gali og value na dili string dili siya ma save.
        if (mailOptionsObj.propIsString(mailOptionsObj, 'to')) {
            mailOptions.to = mailOptionsObj.to;
        }
        if (mailOptionsObj.propIsString(mailOptionsObj, 'subject')) {
            mailOptions.subject = mailOptionsObj.subject;
        }
        if (mailOptionsObj.propIsString(mailOptionsObj, 'text')) {
            mailOptions.text = mailOptionsObj.text;
        }
        if (mailOptionsObj.propIsString(mailOptionsObj, 'html')) {
            mailOptions.html = mailOptionsObj.html;
        }
        if (mailOptionsObj.propIsString(mailOptionsObj, 'attachments')) {
            mailOptions.attachments = mailOptionsObj.attachments;
        }
        //ang ubang properties na walay apil sa valid kay way gamit

        return mailOptions;
    }

    function getMailOptions() {
        return mailOptions;
    }

    function sendMail() {
        console.log('asdasdasdasd')
        if (mailOptionsIsValid()) {
            console.log('Valid email');
            transporter.sendMail(mailOptions, (error, info) => {
                // create a promise version of this
                if (error) {
                    console.log(error);
                    return false;
                } else {
                    console.log('Message sent: %s', info.messageId);
                    console.log(info);
                    // res.json(info);
                }
            });
        } else {
            console.log('Invalid email');
            return false;
        }

        return new Promise(function (resolve, reject) {
            resolve("mailer temporarily disabled");
            // if (mailOptionsIsValid()) {
            //     console.log('valid ang email');
            //     transporter.sendMail(mailOptions, (error, info) => {
            //         // create a promise version of this
            //         if (error) {
            //             console.log('send mail error');
            //             reject(error);
            //         } else {
            //             console.log('Message sent: %s', info.messageId);
            //             resolve(info);
            //         }
            //     });
            // } else {
            //     console.log('invalid ang email');
            //     reject({
            //         valid: false
            //     });
            // }
        })
    }


    function pushMail() {
        if (mailOptionsIsValid()) {
            console.log('Valid email');
            transporter.pushMail(mailOptions, (error, info) => {
                // create a promise version of this
                if (error) {
                    console.log(error);
                    return false;
                } else {
                    console.log('Message sent: %s', info.messageId);
                    console.log(info);
                    // res.json(info);
                }
            });
        } else {
            console.log('Invalid email');
            return false;
        }

        return new Promise(function (resolve, reject) {
            resolve("mailer temporarily disabled");
            // if (mailOptionsIsValid()) {
            //     console.log('valid ang email');
            //     transporter.pushMail(mailOptions, (error, info) => {
            //         // create a promise version of this
            //         if (error) {
            //             console.log('send mail error');
            //             reject(error);
            //         } else {
            //             console.log('Message sent: %s', info.messageId);
            //             resolve(info);
            //         }
            //     });
            // } else {
            //     console.log('invalid ang email');
            //     reject({
            //         valid: false
            //     });
            // }
        })
    }

    // helper functions

    function mailOptionsIsValid() {
        var valid = false;

        if (hf.propIsString(mailOptions, 'from') && mailOptions.from != '') {
            if (hf.propIsString(mailOptions, 'to') && mailOptions.to != '') {
                if (hf.propIsString(mailOptions, 'subject') && mailOptions.subject != '') {
                    if (hf.propIsString(mailOptions, 'text') && mailOptions.text != '') valid = true;
                    if (hf.propIsString(mailOptions, 'html') && mailOptions.html != '') valid = true;
                }
            }
        }
        
        return valid;
    }

    return {
        setSubject: setSubject,
        setTextBody: setTextBody,
        setHTMLBody: setHTMLBody,
        setRecepient: setRecepient,
        setCC: setCC,
        setBCC: setBCC,
        setAttachments: setAttachments,
        setMultiRecepients: setMultiRecepients,
        setMailOptions: setMailOptions,
        getMailOptions: getMailOptions,
        sendMail: sendMail,
        pushMail: pushMail
    }
}

module.exports = mailerService();