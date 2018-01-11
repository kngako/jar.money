/**
 * This router handles things related to the web browser experience...
 */
module.exports = function (options) {
    var path = require('path');

    var express = options.express;
    var db = options.db;
    // var passport = options.passport;
    var email = options.email;

    var router = express.Router();

    router.get('/hotlinebling', function(request, response) {
        response.json({ message: 'Can only mean one thing' });   
    });

    router.get('/resend-confirmation', function(request, response) {
        if(request.user) {
            // TODO: Resend confirmation email...
            if(request.user.emailConfirmedOn != null) {
                response.status(500).send("You are already confirmed.");
            } else {
                db.Confirmation.findOne({
                    where: {
                        userId: request.user.id
                    },
                    include: [
                        {
                            model: db.User,
                            attributes: ['id', 'email', 'firstName', 'lastName']
                        }
                    ]
                }).then(confirmation => {
                    if(confirmation) {
                        if(confirmation.sent > config.get("email.maxConfirmationEmails")) {
                            response.status(500).send("We have sent all the confirmation emails we could :(");
                        } else {

                            email.sendConfirmationEmail(
                                confirmation.user.firstName, 
                                confirmation.token, 
                                confirmation.user.email, 
                                function (info) {
                                    // Confirmation email sent successfully...
                                    return confirmation.increment({
                                        'sent': 1
                                    })
                                }, function(error){
                                    console.error("Failed to resend confirmation: " + error);
                                    // TODO: Log errors...
                                    //response.status(500).send("Having technical difficulities.");
                                } );

                            response.json({ message: 'Confirmation will be resent... check email.' });   
                                
                        }
                    } else {
                        response.status(500).send("Please re-register with a different email because korruption...");
                    }
                })
            }
            
        } else {
            response.status(401).send("You don't have the cred to be in these streets.");
        }
        
    });
    
    return router;
};