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

    router.get('/hotlinebling', function(request, response) {
        response.json({ message: 'Can only mean one thing' });   
    });
    
    return router;
};