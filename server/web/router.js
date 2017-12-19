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

    router.route('/slot/:slotId')
        .get(function(request, response, next) {
            // TODO: Render Slot with ID...
            slot = {

            }
            response.render("slot", {
                pageTitle: "Money Jar - Slot",
                slot: slot
            });
        })
        .post(function(request, response, next) {
            // TODO: Edit a slot
            // TODO: Render edited slot...
            response.render("slot", {
                pageTitle: "Money Jar - Slot"
            });
        });

    
    router.route('/slot/')
        .get(function(request, response, next) {
            // TODO: Render Slot with ID...
            var slot = {

            }
            response.render("slot", {
                pageTitle: "Money Jar - Slot",
                slot: slot
            });
        })
        .post(function(request, response, next) {
            // TODO: Create a slot
            // TODO: 
            response.redirect("/admin");
        });

    router.route('/jar/:jarId')
        .get(function(request, response, next) {
            // TODO: Render Jar with ID...
            var jar = {
                "shortCode" : "kngako",
                "displayName": "Kgothatso Ngako",
                "description": "Contribute towards the creation of more shit.",
                "image": {
                    "src": "img/k.svg"
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
                                "src": "img/patreon_logo.svg"
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
                                "src": "img/patreon_logo.svg"
                            }
                        },
                    }
                ],
                "slots": [
                    {
                        "type": "patreon",
                        "name": "Patreon",
                        "callToAction": "become a patreon",
                        "link": "http://patreon.com/kngako",
                        "image": {
                            "src": "img/patreon_logo.svg"
                        }
                    },
                    {
                        "type": "paypal.me",
                        "name": "Paypal.me",
                        "callToAction": "tip me",
                        "link": "http://paypal.me/kngako",
                        "image": {
                            "src": "img/paypal.svg"
                        }
                    },
                    {
                        "type": "payfast",
                        "name": "Payfast",
                        "callToAction": "pay me",
                        "link": "https://www.payfast.co.za/eng/process/payment?p=26npruaf2mc2453gh0h0h194k3",
                        "image": {
                            "src": "img/payfast.svg"
                        }
                    },
                    {
                        "type": "bitcoin",
                        "name": "Bitcoin",
                        "callToAction": "tip me",
                        "link": "bitcoin:1EeBSsYNZn7C5BHpTbhfm93tnGPyAoTDCY",
                        "address": "1EeBSsYNZn7C5BHpTbhfm93tnGPyAoTDCY",
                        "image": {
                            "src": "img/bitcoin.svg"
                        }
                    },
                    {
                        "type": "litecoin",
                        "name": "Litecoin",
                        "callToAction": "tip me",
                        "link": "litecoin:LQKSHezcC1MgZJC6j6v8FKtLZKujEQn3RX",
                        "address": "LQKSHezcC1MgZJC6j6v8FKtLZKujEQn3RX",
                        "image": {
                            "src": "img/litecoin.svg"
                        }
                    },
                    {
                        "type": "ethereum",
                        "name": "Ethereum",
                        "callToAction": "tip me",
                        "link": "ethereum:0x6E9341cE50Cd1fCdf649E71f19976059943C0D62",
                        "address": "0x6E9341cE50Cd1fCdf649E71f19976059943C0D62",
                        "image": {
                            "src": "img/ethereum.svg"
                        }
                    }
                ]
            };
            response.render("jar", {
                pageTitle: "Money Jar - Jar",
                jar: jar
            });
        })
        .post(function(request, response, next) {
            // TODO: Edit this jar
            // TODO: Render edited jar...
            response.render("jar", {
                pageTitle: "Money Jar - Jar"
            });
        });
    
    router.route('/jar/')
        .get(function(request, response, next) {
            // TODO: Render Jar with ID...
            var jar = {};
            response.render("jar", {
                pageTitle: "Money Jar - Jar",
                jar: jar
            });
        })
        .post(function(request, response, next) {
            // TODO: Create a slot
            // TODO: 
            response.redirect("/admin");
        });

    router.route('/open-jar/')
        .get(function(request, response, next) {
            // TODO: Render Jar with ID...
            var jar = {};
            response.render("open-jar", {
                pageTitle: "Money Jar - Jar",
                jar: jar
            });
        })
        .post(function(request, response, next) {
            // TODO: Create a slot
            // TODO: 
            response.redirect("/admin");
        });

    router.route('/admin')
        .get(function(request, response, next) {
            var slots = [
                {
                    "id": "1345131",
                    "type": "patreon",
                    "name": "Patreon",
                    "callToAction": "become a patreon",
                    "scheme": "http://patreon.com/",
                    "hint": "YourPatreonCreatorUsername",
                    "image": {
                        "src": "img/patreon_logo.svg"
                    }
                },
                {
                    "id": "13421131",
                    "type": "paypal",
                    "name": "Paypal",
                    "callToAction": "tip me",
                    "scheme": "http://paypal.me/",
                    "hint": "YourPaypalMeUsername",
                    "image": {
                        "src": "img/patreon_logo.svg"
                    }
                }
            ];
    
            var jars = [
                {
                    "shortCode" : "kngako",
                    "displayName": "Kgothatso Ngako",
                    "description": "Contribute towards the creation of more shit.",
                    "img": {
                        "src": "img/k.svg"
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
                                    "src": "img/patreon_logo.svg"
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
                                    "src": "img/patreon_logo.svg"
                                }
                            },
                        }
                    ],
                }
            ];
            response.render("admin", {
                pageTitle: "Money Jar - Admin",
                slots: slots,
                jars: jars
            });
        });

    router.route('/:jarId')
        .get(function(request, response, next) {
            // TODO: Search for jar jar and render it in the results
            var jar = {
                "displayName": "Kgothatso Ngako",
                "description": "Contribute towards the creation of more shit.",
                "image": {
                    "src": "img/k.svg"
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
                                "src": "img/patreon_logo.svg"
                            }
                        },
                    },
                    {
                        // Allow for stats
                        "uri": "kngako",
                        "slot": {
                            "type": "paypal",
                            "name": "Paypal",
                            "callToAction": "tip",
                            "scheme": "http://paypal.me/",
                            "hint": "YourPaypalMeUsername",
                            "image": {
                                "src": "img/patreon_logo.svg"
                            }
                        },
                    }
                ],
                "slots": [
                    {
                        "type": "patreon",
                        "name": "Patreon",
                        "callToAction": "become a patreon",
                        "link": "http://patreon.com/kngako",
                        "image": {
                            "src": "img/patreon_logo.svg"
                        }
                    },
                    {
                        "type": "paypal.me",
                        "name": "Paypal.me",
                        "callToAction": "tip me",
                        "link": "http://paypal.me/kngako",
                        "image": {
                            "src": "img/paypal.svg"
                        }
                    },
                    {
                        "type": "payfast",
                        "name": "Payfast",
                        "callToAction": "pay me",
                        "link": "https://www.payfast.co.za/eng/process/payment?p=26npruaf2mc2453gh0h0h194k3",
                        "image": {
                            "src": "img/payfast.svg"
                        }
                    },
                    {
                        "type": "bitcoin",
                        "name": "Bitcoin",
                        "callToAction": "tip me",
                        "link": "bitcoin:1EeBSsYNZn7C5BHpTbhfm93tnGPyAoTDCY",
                        "address": "1EeBSsYNZn7C5BHpTbhfm93tnGPyAoTDCY",
                        "image": {
                            "src": "img/bitcoin.svg"
                        }
                    },
                    {
                        "type": "litecoin",
                        "name": "Litecoin",
                        "callToAction": "tip me",
                        "link": "litecoin:LQKSHezcC1MgZJC6j6v8FKtLZKujEQn3RX",
                        "address": "LQKSHezcC1MgZJC6j6v8FKtLZKujEQn3RX",
                        "image": {
                            "src": "img/litecoin.svg"
                        }
                    },
                    {
                        "type": "ethereum",
                        "name": "Ethereum",
                        "callToAction": "tip me",
                        "link": "ethereum:0x6E9341cE50Cd1fCdf649E71f19976059943C0D62",
                        "address": "0x6E9341cE50Cd1fCdf649E71f19976059943C0D62",
                        "image": {
                            "src": "img/ethereum.svg"
                        }
                    }
                ]
            };
            response.render("money-jar", {
                pageTitle: "Money Jar - Jar",
                jar: jar
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