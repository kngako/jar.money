/**
 * This router handles things related to the web browser experience...
 */
module.exports = function (options) {
    var path = require('path');

    var express = options.express;
    var db = options.db;
    // var passport = options.passport;
    // var email = options.email;

    var router = express.Router();

    router.route('/')
        .get(function(request, response, next) {
            response.render("home", {
                pageTitle: "Money Jar - Home"
            });
        });

    router.route('/:jar')
        .get(function(request, response, next) {
            response.render("money-jar", {
                pageTitle: "Money Jar - Jar"
            });
        });   

    // Last thing that should be done is serve static files... public first
    router.use(express.static('static')); 
    
    // router.use(function (request, response, next) {
    //     response.status(404).redirect("/missing");
    // })

    // router.use(function (request, response, next) {
    //     response.status(500).redirect("/error");
    // })
    return router;
};