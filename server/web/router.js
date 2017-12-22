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
        "image": {
            "src": "/img/patreon_logo.svg"
        }
    },
    {
        "id":"46242767",
        "type": "paypal.me",
        "name": "Paypal.me",
        "callToAction": "tip me",
        "scheme": "http://paypal.me/",
        "image": {
            "src": "/img/paypal.svg"
        }
    },
    {
        "id":"4624672",
        "type": "payfast",
        "name": "Payfast",
        "callToAction": "pay me",
        "scheme": "https://www.payfast.co.za/eng/process/payment?p=26npruaf2mc2453gh0h0h194k3",
        "image": {
            "src": "/img/payfast.svg"
        }
    },
    {
        "id":"4624224",
        "type": "bitcoin",
        "name": "Bitcoin",
        "callToAction": "tip me",
        "scheme": "bitcoin:",
        "address": "1EeBSsYNZn7C5BHpTbhfm93tnGPyAoTDCY",
        "image": {
            "src": "/img/bitcoin.svg"
        }
    },
    {
        "id":"462425424",
        "type": "litecoin",
        "name": "Litecoin",
        "callToAction": "tip me",
        "scheme": "litecoin:",
        "address": "LQKSHezcC1MgZJC6j6v8FKtLZKujEQn3RX",
        "image": {
            "src": "/img/litecoin.svg"
        }
    },
    {
        "id":"46223542",
        "type": "ethereum",
        "name": "Ethereum",
        "callToAction": "tip me",
        "scheme": "ethereum:",
        "address": "0x6E9341cE50Cd1fCdf649E71f19976059943C0D62",
        "image": {
            "src": "/img/ethereum.svg"
        }
    }
]

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

    router.route('/login')
        .get(function(request, response, next) {
            response.render("login", {
                pageTitle: "Money Jar - Login"
            });
        })
        .post(function(request, response, next) {
            // TODO: Login user using passport...
            // TODO: See if there is a redirect parameter and redirect to it...
            response.redirect("/admin");
        });

    router.route('/admin/slot/:slotId')
        .get(function(request, response, next) {
            // TODO: Render Slot with ID...

            response.render("slot", {
                pageTitle: "Money Jar - Slot",
                slot: slots[0]
            });
        })
        .post(function(request, response, next) {
            // TODO: Edit a slot
            // TODO: Render edited slot...
            response.render("slot", {
                pageTitle: "Money Jar - Slot"
            });
        });

    
    router.route('/admin/slot/')
        .get(function(request, response, next) {
            // TODO: Render Slot with ID...

            response.render("edit-slot", {
                pageTitle: "Money Jar - Slot",
                slot: {}
            });
        })
        .post(function(request, response, next) {
            // TODO: Create a slot
            // TODO: 
            response.redirect("/admin");
        });

    router.route('/admin/jar/:shortCode')
        .get(function(request, response, next) {
            // TODO: Render Jar with ID...
            
            response.render("view-jar", {
                pageTitle: "Money Jar - Jar",
                jar: jars[0]
            });
        })
        .post(function(request, response, next) {
            // TODO: Edit this jar
            // TODO: Render edited jar...
            response.render("view-jar", {
                pageTitle: "Money Jar - Jar"
            });
        });
    
    router.route('/admin/jar/')
        .get(function(request, response, next) {
            // TODO: Render Jar with ID...
            response.redirect("/admin");
        })
        .post(function(request, response, next) {
            // TODO: Create a slot
            // TODO: 
            response.redirect("/admin");
        });

    router.route('/admin/open/jar')
        .get(function(request, response, next) {
            response.render("edit-jar", {
                pageTitle: "Money Jar - Jar",
                jar: {}
            });
        })
        .post(function(request, response, next) {
            // TODO: Create a Jar
            // TODO: Redirect to Add a slot...
            response.redirect("/admin/jar/kngako/jar-slot");
        });

    router.route('/admin/edit/jar/:shortCode/jar-slot/:slotId')
        .get(function(request, response, next) {
            response.render("edit-jar-slot", {
                pageTitle: "Money Jar - Jar Slot",
                heading: "Add new jar slot",
                jar: jars[0],
                jarSlot: jars[0].jarSlots[0]
            });
        })
        .post(function(request, response, next) {
            // TODO: Create a Jar
            // TODO: Redirect to Add a slot...
            response.redirect("/admin");
        });

    router.route('/admin/jar/:shortCode/jar-slot/:jarSlotId')
        .get(function(request, response, next) {
            response.render("edit-jar-slot", {
                pageTitle: "Money Jar - Jar Slot",
                heading: "Add new jar slot",
                jar: jars[0],
                slot: slots[0],
                jarSlot: jars[0].jarSlots[0]
            });
        })
        .post(function(request, response, next) {
            // TODO: Create a Jar
            // TODO: Redirect to Add a slot...
            console.log("Params: ", request.params);
            console.log("Param: " , request.params);
            console.log("Body: ", request.body);
            console.log("Query: ", request.query);
            if (request.query.complete != 'true')
                response.redirect("/admin");
            else 
                response.render("edit-jar-slot", {
                    pageTitle: "Money Jar - Jar Slot",
                    heading: "Add new jar slot",
                    jar: jars[0],
                    slot: slots[0],
                    jarSlot: {}
                });
        });
    
    router.route('/admin/jar/:shortCode/jar-slot')
        .get(function(request, response, next) {
            // TODO: Remove already selected slots...
            response.render("select-jar-slot", {
                pageTitle: "Money Jar - Jar Slot",
                heading: "Select jar slot",
                jar: jars[0],
                slots: slots
            });
        })
        .post(function(request, response, next) {
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
            // TODO: Render Jar with ID...
            response.render("edit-jar", {
                pageTitle: "Money Jar - Jar",
                jar: jars[0]
            });
        })
        .post(function(request, response, next) {
            // TODO: Create a slot
            // TODO: 
            response.redirect("/admin");
        });

    router.route('/admin/open-jar/')
        .get(function(request, response, next) {
            // TODO: Render Jar with ID...
            response.render("open-jar", {
                pageTitle: "Money Jar - Jar",
                jar: {}
            });
        })
        .post(function(request, response, next) {
            // TODO: Create a slot
            // TODO: 
            response.redirect("/admin");
        });

    router.route('/admin')
        .get(function(request, response, next) {            
            response.render("admin", {
                pageTitle: "Money Jar - Admin",
                slots: slots,
                jars: jars
            });
        });

    router.route('/:shortCode')
        .get(function(request, response, next) {
            // TODO: Search for jar and render it in the results
            // var jar = {
            //     "displayName": "Kgothatso Ngako",
            //     "description": "Contribute towards the creation of more shit.",
            //     "image": {
            //         "src": "/img/k.svg"
            //     },
            //     "jarSlots": [
            //         {
            //             // Allow for stats
            //             "uri": "kngako",
            //             "slot": {
            //                 "type": "patreon",
            //                 "name": "Patreon",
            //                 "callToAction": "become a patreon",
            //                 "scheme": "http://patreon.com/",
            //                 "hint": "YourPatreonCreatorUsername",
            //                 "image": {
            //                     "src": "/img/patreon_logo.svg"
            //                 }
            //             },
            //         },
            //         {
            //             // Allow for stats
            //             "uri": "kngako",
            //             "slot": {
            //                 "type": "paypal",
            //                 "name": "Paypal",
            //                 "callToAction": "tip",
            //                 "scheme": "http://paypal.me/",
            //                 "hint": "YourPaypalMeUsername",
            //                 "image": {
            //                     "src": "/img/patreon_logo.svg"
            //                 }
            //             },
            //         }
            //     ],
            //     "slots": [
            //         {
            //             "type": "patreon",
            //             "name": "Patreon",
            //             "callToAction": "become a patreon",
            //             "link": "http://patreon.com/kngako",
            //             "image": {
            //                 "src": "/img/patreon_logo.svg"
            //             }
            //         },
            //         {
            //             "type": "paypal.me",
            //             "name": "Paypal.me",
            //             "callToAction": "tip me",
            //             "link": "http://paypal.me/kngako",
            //             "image": {
            //                 "src": "/img/paypal.svg"
            //             }
            //         },
            //         {
            //             "type": "payfast",
            //             "name": "Payfast",
            //             "callToAction": "pay me",
            //             "link": "https://www.payfast.co.za/eng/process/payment?p=26npruaf2mc2453gh0h0h194k3",
            //             "image": {
            //                 "src": "/img/payfast.svg"
            //             }
            //         },
            //         {
            //             "type": "bitcoin",
            //             "name": "Bitcoin",
            //             "callToAction": "tip me",
            //             "link": "bitcoin:1EeBSsYNZn7C5BHpTbhfm93tnGPyAoTDCY",
            //             "address": "1EeBSsYNZn7C5BHpTbhfm93tnGPyAoTDCY",
            //             "image": {
            //                 "src": "/img/bitcoin.svg"
            //             }
            //         },
            //         {
            //             "type": "litecoin",
            //             "name": "Litecoin",
            //             "callToAction": "tip me",
            //             "link": "litecoin:LQKSHezcC1MgZJC6j6v8FKtLZKujEQn3RX",
            //             "address": "LQKSHezcC1MgZJC6j6v8FKtLZKujEQn3RX",
            //             "image": {
            //                 "src": "/img/litecoin.svg"
            //             }
            //         },
            //         {
            //             "type": "ethereum",
            //             "name": "Ethereum",
            //             "callToAction": "tip me",
            //             "link": "ethereum:0x6E9341cE50Cd1fCdf649E71f19976059943C0D62",
            //             "address": "0x6E9341cE50Cd1fCdf649E71f19976059943C0D62",
            //             "image": {
            //                 "src": "/img/ethereum.svg"
            //             }
            //         }
            //     ]
            // };
            response.render("money-jar", {
                pageTitle: "Money Jar - Jar",
                jar: jars[0]
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