/**
 * This router handles things related to the web browser experience...
 */
// This is the mock data we working with...
var jars = [
    {
        "shortCode" : "whatdoesittake",
        "displayName": "What Does It Take ",
        "description": "Contribute towards the creation of more shit.",
        "image": {
            "id": 2455357,
            "src": "/img/k.svg"
        },
        "jarSlots": [
            {
                // Allow for stats
                "uri": "kngako",
                "slot": {
                    "type": "patreon",
                    "name": "Patreon",
                    "callToAction": "become a patreon",
                    "scheme": "http://patreon.com/",
                    "hint": "YourPatreonCreatorUsername",
                    "image": {
                        "src": "/img/patreon_logo.svg"
                    }
                },
            },
            {
                // Allow for stats
                "uri": "kngako",
                "slot": {
                    "type": "paypal",
                    "name": "Paypal",
                    "callToAction": "tip me",
                    "scheme": "http://paypal.me/",
                    "hint": "YourPaypalMeUsername",
                    "image": {
                        "src": "/img/patreon_logo.svg"
                    }
                },
            },
            {
                // Allow for stats
                "uri": "kngako",
                "slot": {
                    "type": "cash",
                    "name": "cash",
                    "callToAction": "tip me",
                    "scheme": "http://cash.me/",
                    "hint": "YourPaypalMeUsername",
                    "image": {
                        "src": "/img/patreon_logo.svg"
                    }
                },
            }
        ],
    },
    {
        "shortCode" : "kngako",
        "displayName": "Kgothatso Ngako",
        "description": "Approach the author with your offering.",
        "image": {
            "id": 2455357,
            "src": "/img/k.svg"
        },
        "jarSlots": [
            {
                // Allow for stats
                "uri": "kngako",
                "slot": {
                    "type": "patreon",
                    "name": "Patreon",
                    "callToAction": "become a patreon",
                    "scheme": "http://patreon.com/",
                    "hint": "YourPatreonCreatorUsername",
                    "image": {
                        "src": "/img/patreon_logo.svg"
                    }
                },
            },
            {
                // Allow for stats
                "uri": "kngako",
                "slot": {
                    "type": "paypal",
                    "name": "Paypal",
                    "callToAction": "tip me",
                    "scheme": "http://paypal.me/",
                    "hint": "YourPaypalMeUsername",
                    "image": {
                        "src": "/img/patreon_logo.svg"
                    }
                },
            }
        ],
        
    }
];

var slots = [
    {
        "id":"462422356",
        "type": "patreon",
        "name": "Patreon",
        "callToAction": "become a patreon",
        "scheme": "http://patreon.com/",
        "hint": "Patreon username",
        "image": {
            "id":474634,
            "src": "/img/patreon_logo.svg"
        }
    },
    {
        "id":"46242767",
        "type": "paypal.me",
        "name": "Paypal.me",
        "callToAction": "tip me",
        "scheme": "http://paypal.me/",
        "hint": "paypal.me username",
        "image": {
            "id":4624276,
            "src": "/img/paypal.svg"
        }
    },
    {
        "id":"4624224",
        "type": "bitcoin",
        "name": "Bitcoin",
        "callToAction": "tip me",
        "scheme": "bitcoin:",
        "hint": "Bitcoin address",
        "address": "1EeBSsYNZn7C5BHpTbhfm93tnGPyAoTDCY",
        "image": {
            "id":236745,
            "src": "/img/bitcoin.svg"
        }
    },
    {
        "id":"462425424",
        "type": "litecoin",
        "name": "Litecoin",
        "callToAction": "tip me",
        "scheme": "litecoin:",
        "hint": "Litecoin address",
        "address": "LQKSHezcC1MgZJC6j6v8FKtLZKujEQn3RX",
        "image": {
            "id":4624,
            "src": "/img/litecoin.svg"
        }
    },
    {
        "id":"46223542",
        "type": "ethereum",
        "name": "Ethereum",
        "callToAction": "tip me",
        "scheme": "ethereum:",
        "hint": "Ethereum Address",
        "address": "0x6E9341cE50Cd1fCdf649E71f19976059943C0D62",
        "image": {
            "id":3627,
            "src": "/img/ethereum.svg"
        }
    }
]

module.exports = function (options) {
    var path = require('path');

    var express = options.express;
    var db = options.db;
    var passport = options.passport;
    // var email = options.email;

    var router = express.Router();

    router.route('/')
        .get(function(request, response, next) {
            response.render("home", {
                pageTitle: "Money Jar - Home"
            });
        });

    router.route('/admin/signup/')
        .get(function(request, response, next) {
            if(request.user){ // User is already logged in so don't go to matches again...
                response.redirect('/admin');
            } else {
                response.render("signup", {
                    pageTitle: "Money Jar - Signup"
                });
            }
        })
        .post(function(request, response, next){
            if(request.user){ // User is already logged in so don't go to matches again...
                // Let them now User already registered...
                response.render("signup", {
                    pageTitle: "Money Jar - Signup"
                });
            } else {
                // TODO: Validate user input...
                if(request.body.password !== request.body.confirmPassword) { // TODO: Might do this on the database object...
                    // TODO: user flash... passwords don't match
                    response.render("signup", {
                        pageTitle: "Money Jar - Signup"
                    });
                } else {
                    db.Role.findOne({
                        // TODO: Handle ordering business...
                        where: {
                            type: "user"
                        }
                    })
                    .then(role => {
                        // Now we can create the user account...
                        db.User.create({
                            email: request.body.username,
                            firstName: request.body.firstName,
                            lastName: request.body.lastName,
                            phoneNumber: request.body.phoneNumber,
                            password: request.body.password,
                            activitedOn: Date.now() // TODO: don't activate if not through invitation...
                        }, {
                            include: [
                                {
                                    association: db.User.UserRoles
                                }
                            ]
                        })
                        .then(user => {
                            console.log("Created User: " + JSON.stringify(user)); 
                        
                            // TODO: Think about the below redundancy... 
                            db.UserMembership.create({
                                userId: user.id,
                                membershipId: membership.id
                            }).then (userMembership => {
                                console.log("Created User membership: " + userMembership);
                            })
            
                            var userRoles = [];
                            userRoles.push({
                                userId: user.id,
                                roleId: role.id
                            });
                            db.UserRole.bulkCreate(userRoles)
                            .then(dbUserRoles => {
                                console.log("Created User Roles: "+ JSON.stringify(dbUserRoles));
                                // Assuming everything works... let's redirect this post to the login screen...
                                passport.authenticate('local')(request, response, () => {
                                    // TODO: Figure out what problems arises without saving session...
                                    response.redirect("/admin");
                                });

                                // Confirm email...
                                db.Confirmation.create({
                                    userId: user.id,
                                    sent: 0
                                }).then(confirmation => {
                                    email.sendConfirmationEmail(
                                        user.firstName, 
                                        confirmation.token, 
                                        user.email, 
                                        function (info) {
                                            // Confirmation email sent successfully...
                                            return confirmation.increment({
                                                'sent': 1
                                            })
                                        });
                                        // TODO: Add error callback to check what went wrong...
                                }).catch(error => {
                                    console.error("Confirmation fial: ", error);
                                });

                                // TODO: Add user to all other memberships they may have been invited too...
                            })
                        })
                        .catch(error => {
                            console.error("Hanlde error: ", error);
                        })
                    })
                    .catch(error => {
                        // TODO: Report error to user...
                        response.render("signup", {
                            pageTitle: "Money Jar - Signup"
                        });
                    });
                }
                
            }
        });

    router.route('/admin/confirmation/:confirmationToken')
        .get(function(request, response, next){
            db.Confirmation.findById(request.params.confirmationToken, {
                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'firstName', 'lastName']
                    }
                ]
            })
            .then(confirmation => {
                if(confirmation) {
                    confirmation.user.update({
                        emailConfirmedOn: new Date()
                    }).then(() => {

                        return confirmation.destroy();
                    }).then(() => {
                        response.render("confirmation-success", {
                            pageTitle: "Money Jar - Confirmation Success"
                        });
                        // response.redirect("/confirmation-success");
                    })
                    .catch(error => {
                        console.error("Error Confirmation: ", error);
                        // TODO: Show error info...
                        response.render("error", {
                            pageTitle: "Money Jar - Error"
                        });
                    });
                } else {
                    // TODO: Render confirmation error...
                    response.render("confirmation-failure", {
                        pageTitle: "Money Jar - Confirmation Failure"
                    });
                    // response.status(400).send("Match not found");
                }
            })
        });

    router.route('/admin/confirm-email/')
        .get(function(request, response, next){
            console.log("We should be here redirecting stuff...");
            if (request.user && request.user.emailConfirmedOn == null) {
                response.render("confirm-email", {
                    pageTitle: "Money Jar - Confirm email"
                });
            } else if(request.user){
                response.redirect('/admin');
            } else  {
                response.redirect('/admin/login');
            }
        });

    router.route('/admin/login')
        .get(function(request, response, next) {
            if(request.user){ // User is already logged in so don't go to matches again...
                response.redirect('/admin');
            } else {
                response.render("login", {
                    pageTitle: "Money Jar - Login"
                });
            }
        })
        .post(function(request, response, next) {
            if(request.user){ 
                // User is already logged in so don't go to matches again...
                response.redirect('/admin');
            } else {
                // Check arguments and handle the errors...
                passport.authenticate('local', (error, user, info) => {                
                    if(info) {
                        response.render("login", {
                            pageTitle: "Money Jar - Login",
                            data: info
                        });
                    }
                    if(user) {
                        request.logIn(user, function(err) {
                            if (err) { return next(err); }
                            return  response.redirect('/admin');
                        });  
                    }
                })(request, response, next);
            }
        });

    router.route('/admin/slot/:slotId')
        .get(function(request, response, next) {
            if(request.user && request.user.isAdmin()){
                db.Slot.findById(request.params.slotId)
                .then(slot => {
                    response.render("view-slot", {
                        pageTitle: "Money Jar - Slot",
                        slot: slot
                    });
                }).catch(error => {
                    response.render("error", {
                        pageTitle: "Money Jar - Error"
                    });
                })
                
            } else  {
                response.redirect('/admin');
            }
        })
        .post(function(request, response, next) {
            // TODO: Check if user is admin
            if(request.user && request.user.isAdmin()){
                // TODO: Edit a slot
                // TODO: Render edited slot...
                response.redirect("/admin/slot/" + request.param.slotId );
            } else  {
                response.redirect('/admin');
            }
            
        });

    router.route('/admin/slot/:slotId/edit')
        .get(function(request, response, next) {
            // TODO: Check if user is admin...
            if(request.user && request.user.isAdmin()){
                db.Slot.findById(request.params.slotId)
                .then(slot => {
                    response.render("edit-slot", {
                        pageTitle: "Money Jar - Slot",
                        slot: slot
                    });
                }).catch(error => {
                    response.render("error", {
                        pageTitle: "Money Jar - Error"
                    });
                })
                
            } else  {
                response.redirect('/admin');
            }
            
        })
        .post(function(request, response, next) {
            if(request.user && request.user.isAdmin()){
                // TODO: Edit a slot
                var slotId = request.params.slotId;
                db.Slot.update({
                    name: request.body.name,
                    callToAction: request.body.callToAction,
                    scheme: request.body.scheme,
                    type: request.body.type,
                    hint: request.body.hint
                }, {
                    where: {
                        id: slotId
                    }
                }).then((count, slots) => {
                    console.log("Count: ", count);
                    console.log("Afflickted: ", slots);
                    // This redirect will work even in error some input... 
                    // TODO: Check that this will work with hacky input... 
                    response.redirect("/admin/slot/" + slotId);
                }).catch(error => {
                    response.render("error", {
                        pageTitle: "Money Jar - Error"
                    });
                })
            } else  {
                response.redirect('/admin');
            }
            
        });

    
    router.route('/admin/slot/')
        .get(function(request, response, next) {
            if(request.user && request.user.isAdmin()){
                // TODO: Render Slot with ID...
                response.render("edit-slot", {
                    pageTitle: "Money Jar - Slot",
                    slot: {}
                });
            } else  {
                response.redirect('/admin');
            }
            
        })
        .post(function(request, response, next) {
            if(request.user && request.user.isAdmin()){
                // TODO: Create a slot
                db.Slot.create(
                    {
                        name: request.body.name,
                        callToAction: request.body.callToAction,
                        scheme: request.body.scheme,
                        type: request.body.type,
                        hint: request.body.hint
                    }
                ).then(slot => {
                    if(slot) {
                        console.log("Slot: ", slot);
                        response.redirect("/admin/slot/"+ slot.id);
                    } else {
                        console.log("Error: Failed to create slot");
                        response.render("error", {
                            pageTitle: "Money Jar - Error"
                        });
                    }
                }).catch(error => {
                    console.error("Slot Creation Error: ", error);
                    response.render("error", {
                        pageTitle: "Money Jar - Error"
                    });
                })
            } else  {
                response.redirect('/admin');
            }
            
        });

    router.route('/admin/jar/:shortCode')
        .get(function(request, response, next) {
            // TODO: Check if user is admin or owner of the jar...
            // TODO: Render Jar with ID...
            if(request.user && request.user.ownsJar(request.param.shortCode)){
                // TODO: get the jar...
                db.Jar.findById(
                    request.param.shortCode
                ).then(jar => {
                    response.render("view-jar", {
                        pageTitle: "Money Jar - Jar",
                        jar: jars[0]
                    });
                })
            } else  {
                response.redirect('/admin');
            }

            
        })
        .post(function(request, response, next) {
            // TODO: Edit this jar
            // TODO: Render edited jar...
            if(request.user && request.user.ownsJar(request.param.shortCode)){
                // TODO: get the jar...
                db.Jar.findById(
                    request.param.shortCode
                ).then(jar => {
                    response.render("view-jar", {
                        pageTitle: "Money Jar - Jar",
                        jar: jars[0]
                    });
                })
            } else  {
                response.redirect('/admin');
            }
            
        });
    
    router.route('/admin/jar/')
        .get(function(request, response, next) {
            // TODO: Check if user is authenticated
            if(request.user){
                response.render("edit-jar", {
                    pageTitle: "Money Jar - Jar",
                    jar: {}
                });
            } else  {
                response.redirect('/admin');
            }
            
        })
        .post(function(request, response, next) {
            // TODO: Check if user is authenticated
            if(request.user){
                // TODO: Create a jar
                // TODO: 
                var shortCode = "kngako";
                response.redirect("/admin/jar/" + shortCode + "/jar-slot");
            } else  {
                response.redirect('/admin');
            }
            
        });

    router.route('/admin/open/jar')
        .get(function(request, response, next) {
            if(request.user){
                response.render("edit-jar", {
                    pageTitle: "Deprecated Money Jar - Jar",
                    jar: {}
                });
            } else  {
                response.redirect('/admin');
            }
            
        })
        .post(function(request, response, next) {
            // TODO: Create a Jar
            if(request.user){
                // TODO: Redirect to Add a slot...
                var shortCode = "kngako"
                response.redirect("/admin/jar/" + shortCode +"/jar-slot");
            } else  {
                response.redirect('/admin');
            }
            
        });

    router.route('/admin/edit/jar/:shortCode/jar-slot/:slotId')
        .get(function(request, response, next) {
            // TODO: Check if user is owner of jar slot...
            if(request.user && request.user.ownsJar(request.param.shortCode)){
                response.render("edit-jar-slot", {
                    pageTitle: "Money Jar - Jar Slot",
                    heading: "Add new jar slot",
                    jar: jars[0],
                    jarSlot: jars[0].jarSlots[0]
                });
            } else {
                response.redirect("/admin");
            }
            
        })
        .post(function(request, response, next) {
            // TODO: Edit a Jar
            // TODO: Redirect to Add a slot...
            if(request.user && request.user.ownsJar(request.param.shortCode)){
                response.redirect("/admin/jar/" + request.param.shortCode + "/jar-slot/" + request.param.slotId);
            } else {
                response.redirect("/admin");
            }
        });

    router.route('/admin/jar/:shortCode/jar-slot/:jarSlotId')
        .get(function(request, response, next) {
            if(request.user && request.user.ownsJar(request.param.shortCode) && request.user.ownsJarSlot(request.param.shortCode)){
                response.render("edit-jar-slot", {
                    pageTitle: "Money Jar - Jar Slot",
                    heading: "Add new jar slot",
                    jar: jars[0],
                    slot: slots[0],
                    jarSlot: jars[0].jarSlots[0]
                });
            } else {
                response.redirect("/admin");
            }
        })
        .post(function(request, response, next) {
            // TODO: Create a Jar
            // TODO: Redirect to Add a slot...
            if(request.user && request.user.ownsJar(request.param.shortCode) && request.user.ownsJarSlot(request.param.jarSlotId)){
                if (request.query.complete != 'true')
                    response.redirect("/admin");
                else 
                    response.render("edit-jar-slot", {
                        pageTitle: "Money Jar - Jar Slot",
                        heading: "Add new jar slot",
                        jar: jars[0],
                        slot: slots[0],
                        jarSlot: jars[0].jarSlots[0]
                    });
            }
            
        });
    
    router.route('/admin/jar/:shortCode/jar-slot')
        .get(function(request, response, next) {
            // TODO: Check if user is authenticated
            // TODO: Remove already selected slots...
            if(request.user && request.user.ownsJar(request.param.shortCode))
            {
                response.render("select-jar-slot", {
                    pageTitle: "Money Jar - Jar Slot",
                    heading: "Select jar slot",
                    jar: jars[0],
                    slots: slots
                });
            } else {
                response.redirect("/admin");
            }
            
        })
        .post(function(request, response, next) {
            // TODO: Check if user is authenticated
            // TODO: Create a Jar Slot
            // TODO: Redirect to Add a slot...
            console.log("Params: ", request.params);
            console.log("Param: " , request.param);
            console.log("Body: ", request.body);
            console.log("Query: ", request.query);
            console.log("Request: ", request);
            response.redirect("/admin/jar/kngako/jar-slot/2452462");
        });

    // router.route('/admin/open/jar/:shortCode/jar-slot/plus')
    //     .post(function(request, response, next) {
    //         // TODO: Create a Jar Slot
    //         // TODO: Redirect to Add a slot...
    //         response.render("edit-jar-slot", {
    //             pageTitle: "Money Jar - Jar Slot",
    //             heading: "Add new jar slot",
    //             jar: jars[0],
    //             slot: slots[0],
    //             jarSlot: {}
    //         });
    //     });

    router.route('/admin/jar/:shortCode/edit')
        .get(function(request, response, next) {
            // TODO: Check if user is authenticated and owns jar
            // TODO: Render Jar with ID...
            if(request.user && request.user.ownsJar(request.param.shortCode))
            {
                response.render("edit-jar", {
                    pageTitle: "Money Jar - Jar",
                    jar: jars[0]
                });
            } else {
                response.redirect("/admin");
            }
        })
        .post(function(request, response, next) {
            if(request.user && request.user.ownsJar(request.param.shortCode))
            {
                // TODO: Edit the jar    
                response.redirect("/admin");
            } else {
                response.redirect("/admin/unauthorized");
            }
            
        });

    router.route('/admin/image/:imageId/edit')
        .get(function(request, response, next) {
            // TODO: Check if user is authenticated and owns image
            // TODO: Add image...
            if(request.user && request.user.ownsImage(request.param.imageId))
            {
                response.render("edit-image", {
                    pageTitle: "Money Jar - Image",
                    image: slots[0].image
                });
            } else {
                response.redirect("/admin");
            }
        })
        .post(function(request, response, next) {
            // TODO: Check if user is admin or owner of image...
            // TODO: Create a slot
            if(request.user && request.user.ownsImage(request.param.imageId))
            {
                // EDIT Jar...
            } else {
                response.render("unauthorized", {
                    pageTitle: "Money Jar - Unauthorized"
                });
            }
            
        });

    router.route('/admin/open-jar/')
        .get(function(request, response, next) {
            // TODO: Render Jar with ID...
            if(request.user){
                response.render("open-jar", {
                    pageTitle: "Money Jar - Jar",
                    jar: {}
                });
            } else  {
                response.redirect('/admin');
            }
            
        })
        .post(function(request, response, next) {
            // TODO: Create a slot
            // TODO: 
            response.redirect("/admin");
        });

    router.route('/admin')
        .get(function(request, response, next) { 
            if(request.user && request.user.isAdmin()) {
                // TODO: Renders Jars and slots...
                db.Slot.findAll()
                .then(slots => {
                    db.Jar.findAll(
                        {
                            where: {
                                userId: request.user.id
                            }
                        }
                    ).then(ujars => {
                        response.render("admin", {
                            pageTitle: "Money Jar - Admin",
                            slots: slots,
                            jars: ujars
                        });
                    }).catch(error=> {
                        console.error("Jar Error: ", error)
                        response.render("error", {
                            pageTitle: "Money Jar - Error",
                        });
                    })
                })
                .catch(error=> {
                    console.error("Jar Error: ", error)
                    response.render("error", {
                        pageTitle: "Money Jar - Error",
                    });
                })
            } else if(request.user){
                
                db.Jar.findAll(
                    {
                        where: {
                            userId: request.user.id
                        }
                    }
                ).then(ujars => {
                    response.render("admin", {
                        pageTitle: "Money Jar - Admin",
                        slots: null,
                        jars: ujars
                    });
                }).catch(error=> {
                    console.error("Jar Error: ", error)
                    response.render("error", {
                        pageTitle: "Money Jar - Error",
                    });
                })
                
            } else  {
                response.redirect('/admin/login');
            }           
            
        });

    router.route('/:shortCode')
        .get(function(request, response, next) {
            // TODO: Show avaible jar. 
            // TODO: Show claim jar if short code isn't in the system.
            response.render("money-jar", {
                pageTitle: "Money Jar - Jar",
                jar: jars[0]
            });
        });

        
    router.get('/admin/logout', function(request, response){
            if(request.user){
                request.logout();   
            } 
            response.redirect('/');
        });

    router.get('/admin/unauthorized', function(request, response){
            response.render("unauthorized", {
                pageTitle: "Money Jar - Unauthorized"
            });
        });

    // Last thing that should be done is serve static files... public first
    router.use(express.static('static')); 
    
    // router.use(function (request, response, next) {
    //     response.status(404).redirect("/missing");
    //         response.render("money-jar", {
    //             pageTitle: "Money Jar - Jar",
    //             jar: jars[0]
    //         });
    // })

    // router.use(function (request, response, next) {
    //     response.status(500).redirect("/error");
    // })
    return router;
};