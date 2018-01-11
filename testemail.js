/* eslint no-console: 0 */

'use strict';

var config = require("config")
var email = require("./email.js")({
    config: config
})

console.log("Let us do the things: " + config.get("email.testEmail") );
email.sendEmail({
    to: "<" + config.get("email.testEmail") + ">",
    subject: "This mailer stuff works like a charm",
    html: "<p>Thanks <a href='https://kngako.com'>Kgothatso</a></p>"
});

email.close();