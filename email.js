/* eslint no-console: 0 */

'use strict';

module.exports = function (options) {
    var config = options.config;
    var email = {};

    var nodemailer = require('nodemailer');
    
    var transporter = nodemailer.createTransport(
        {
            service: 'Gmail',
            auth: {
                type: 'OAuth2',
                user: config.get("email.adminEmail"),
                clientId: config.get("email.clientId"),
                clientSecret: config.get("email.clientSecret"),
                refreshToken: config.get("email.refreshToken"),
                accessToken: config.get("email.accessToken"),
                expires: 12345
            }
        },
        {
            // default message fields
    
            // sender info
            from: 'Money Jar <' + config.get("email.adminEmail") + '>',
            // headers: {
            //     'X-Laziness-level': 1000 // just an example header, no need to use this
            // }
        }
    );
    console.log('SMTP Configured');
    
    email.sendEmail = function (email, successCallback, failureCallback) {
        if(email.to == null || email.subject == null || email.html == null) {
            console.error("Can't send: ", email);
            return false;
        }
        // Create a SMTP transporter object
        var message = {
            // Comma separated list of recipients
            to: email.to,
            subject: email.subject, //
            html: email.html
        };
        
        console.log('Sending Mail');
        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.log('Error occurred: ', error.message);
                if(failureCallback)
                    failureCallback(error);
                return;
            }
            console.log('Message sent successfully!');
            console.log('Server responded with "%s"', info.response);
            if(successCallback) {
                successCallback(info);
            }
        });
    }
    
    email.sendConfirmationEmail = function(name, confirmationToken, to, successCallback, failureCallback) {
        var url = config.get("server.domain") + "/admin/confirmation/" + confirmationToken;
        email.sendEmail({
            to: "<" + to + ">",
            subject: "Money Jar Confirmation",
            html: "<p>Hi " + name+ ",</p><p>Thanks for signing up to the money jar. Please confirm your email for us by clicking this <a href='" + url + "'>link</a></p>"
            + "<p>If link isn't clickable add the following to your browser url bar: <a href='" + url + "'>" 
            + url +"</a></p>"
            + "<p>If you didn't signup then ignore this email.</p>"
            + "<br><p>e-regards</p><p>Money Jar Admin</p>"
        }, successCallback, failureCallback);
    }
    email.close = function () {
        transporter.close();
    }
    return email;
};


