/**
 * This router handles things related to the web browser experience...
 */
// This is the mock data we working with...

module.exports = function (options) {
    var path = require('path');
    var multer  = require('multer');
    var mime = require('mime');
    
    var storage = multer.diskStorage({
        destination: function (request, file, cb) {
            cb(null, 'files/')
        },
        filename: function (request, file, cb) {
            // TODO: Error handling...
            cb(null, file.fieldname + '-' + Date.now() + "." + mime.getExtension(file.mimetype))
        }
    });
    var imageUploads = multer({ 
        storage: storage,
        fileFilter: function (request, file, cb) {
            if (request.user && file.mimetype && file.mimetype.toLowerCase().startsWith("image/")) {
                cb(null, true);
            } else if (request.user) {
                // return cb(null, false)
                return cb(new Error('Only images are allowed')); // Skips this upload...
            } else {
                return cb(new Error('Not authorizedx    '));
            }
            
        }
    });

    var express = options.express;
    var db = options.db;
    var passport = options.passport;
    var email = options.email;

    const pug = require('pug');
    
    // TODO: Compile all the pug views 
    const signupPage = pug.compileFile('views/signup.pug');

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
                // TODO: Might wanna load the user from params/body...
                console.log("We are gere...")
                response.send(signupPage({
                    pageTitle: "Money Jar - Signup",
                    errorMessage: null,
                    subErrorMessage: null,
                    user: {}
                }))
            }
        })
        .post(function(request, response, next){
            var tmpUser = {
                email: request.body.username,
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                phoneNumber: request.body.phoneNumber,
                password: request.body.password,
                activitedOn: Date.now() // TODO: don't activate if not through invitation...
            }
            console.log("Trying to save: ", tmpUser);
            if(request.user){ // User is already logged in so don't go to matches again...
                // Let them now User already registered...
                response.redirect("/admin");
            } else {
                // TODO: Validate user input...
                if((request.body.password !== request.body.confirmPassword) || request.body.password.length == 0) { // TODO: Might do this on the database object...
                    // TODO: user flash... passwords don't match
                    response.send(signupPage({
                        pageTitle: "Money Jar - Signup",
                        errorMessage: "passwords don't match",
                        subErrorMessage: null,
                        user: tmpUser
                    }));
                } else {
                    db.Role.findOne({
                        // TODO: Handle ordering business...
                        where: {
                            type: "user"
                        }
                    })
                    .then(role => {
                        // Now we can create the user account...
                        db.User.create(tmpUser, {
                            include: [
                                {
                                    association: db.User.UserRoles
                                }
                            ]
                        })
                        .then(user => {
                            console.log("Created User: " + JSON.stringify(user)); 
                        
                            // TODO: Think about the below redundancy... 
            
                            var userRoles = [];
                            userRoles.push({
                                userId: user.id,
                                roleId: role.id
                            });
                            db.UserRole.bulkCreate(userRoles)
                            .then(dbUserRoles => {
                                console.log("Created User Roles: "+ JSON.stringify(dbUserRoles));
                                // Show user a confirmation page...
                                response.render("confirm-email", {
                                    pageTitle: "Money Jar - Confirm email"
                                });
                                // Confirm email...
                                db.Confirmation.create({
                                    userId: user.id,
                                    sent: 0
                                }).then(confirmation => {
                                    // TODO: Bring back email features... 
                                    email.sendConfirmationEmail(
                                        user.firstName, 
                                        confirmation.token, 
                                        user.email, 
                                        function (info) {
                                            // Confirmation email sent successfully...
                                            return confirmation.increment({
                                                'sent': 1
                                            });
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
                            var errorMessage = "Failed to create user";
                            if(error.errors[0].type) {
                                // TODO: replace "." with " "
                                errorMessage = "invalid " + error.errors[0].path
                                subErrorMessage = error.errors[0].message
                            }
                            response.send(signupPage({
                                pageTitle: "Money Jar - Signup",
                                errorMessage: errorMessage,
                                subErrorMessage: subErrorMessage,
                                user: tmpUser
                            }));
                        })
                    })
                    .catch(error => {
                        // TODO: Report error to user...
                        response.render("error", {
                            pageTitle: "Money Jar - Signup ERROR"
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
                db.Slot.findById(
                    request.params.slotId,
                    {
                        include: [
                            {
                                association: db.Slot.Image
                            }
                        ]
                    }
                )
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
                response.redirect("/admin/slot/" + request.params.slotId );
            } else  {
                response.redirect('/admin');
            }
            
        });

    router.route('/admin/slot/:slotId/edit')
        .get(function(request, response, next) {
            // TODO: Check if user is admin...
            if(request.user && request.user.isAdmin()){
                db.Slot.findById(request.params.slotId,
                    {
                        include: [
                            {
                                association: db.Slot.Image
                            }
                        ]
                    }
                )
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

    
    router.route('/admin/slot')
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
        .post(imageUploads.single('image'), function(request, response, next) {
            console.log("************Image: ", request.file);
            if(request.file) {
                var tmpFile = request.file;
                if(request.user && request.user.isAdmin()){
                    // TODO: Copy tmpFile to files directory...
                    db.Image.create(
                        {
                            src: request.file.path
                        }
                    ).then(image => {
                        // TODO: Remove tmpFile from system...
                        db.Slot.create(
                            {
                                imageId: image.id,
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
                            // TODO: Creatation 
                            console.error("Slot Creation Error: ", error);
                            response.render("error", {
                                pageTitle: "Money Jar - Error"
                            });
                        })
                    }).catch(error => {
                        // TODO: Creatation 
                        console.error("Slot Creation Error: ", error);
                        response.render("error", {
                            pageTitle: "Money Jar - Error"
                        });
                    })
                    
                } else  {
                    response.redirect('/admin');
                }
            } else {
                response.render("error", {
                    pageTitle: "Money Jar - Upload Error"
                });
            }
            
            
        });

    router.route('/admin/jar/:shortCode')
        .get(function(request, response, next) {
            // TODO: Check if user is admin or owner of the jar...
            // TODO: Render Jar with ID...
            if(request.user && request.user.ownsJar(request.params.shortCode)){
                // TODO: get the jar...
                db.Jar.findOne(
                    {
                        where: {
                            shortCode: request.params.shortCode
                        },
                        include: [
                            {
                                association: db.Jar.JarSlots,
                                include: [
                                    {
                                        association: db.JarSlot.Slot
                                    },
                                    {
                                        association: db.JarSlot.Clicks
                                    }
                                ]
                            }
                        ]
                    }
                ).then(jar => {
                    console.log("Jar Found: ", jar)
                    if(jar) {
                        response.render("view-jar", {
                            pageTitle: "Money Jar - Jar",
                            jar: jar
                        });
                    } else {
                        response.render("error", {
                            pageTitle: "Money Jar - Error"
                        });
                    }
                    
                }).catch(error => {
                    // TODO: Creatation 
                    console.error("Slot Creation Error: ", error);
                    response.render("error", {
                        pageTitle: "Money Jar - Error"
                    });
                })
            } else  {
                response.redirect('/admin');
            }

            
        })
        
    
    router.route('/admin/jar/')
        .get(function(request, response, next) {
            // TODO: Check if user is authenticated
            if(request.user){
                response.render("edit-jar", {
                    pageTitle: "Money Jar - Jar",
                    errorMessage: null,
                    subErrorMessage: null,
                    jar: {}
                });
            } else  {
                response.redirect('/admin');
            }
        })
        .post(imageUploads.single('image'), function(request, response, next) {
            // TODO: Create a Jar
            var tmpJar = {
                shortCode: request.body.shortCode,
                displayName: request.body.displayName,
                description: request.body.description
            };
            console.log("Trying to save: ", tmpJar);
            if(request.user){
                // TODO: Redirect to Add a jar...
                if(request.file) {
                    db.Image.create(
                        {
                            src: request.file.path
                        }
                    ).then(image => {
                        db.Jar.create(
                            {
                                imageId: image.id,
                                shortCode: request.body.shortCode,
                                displayName: request.body.displayName,
                                description: request.body.description,
                                userId: request.user.id
                            }
                        ).then(jar => {
                            if(jar) {
                                // Success... set up jar slots...
                                response.redirect("/admin/jar/" + jar.shortCode +"/jar-slot");
                            } else {
                                console.error("Error: Failed to create slot");
                                response.render("error", {
                                    pageTitle: "Money Jar - Error"
                                });
                            }
                        }).catch(error => {
                            var errorMessage = "Failed to create jar";
                            
                            if(error.errors[0]) {
                                if(error.errors[0].path == "shortCode") {
                                    errorMessage = "shortCode not available";
                                    subErrorMessage = null;
                                } else {
                                    // TODO: replace "." with " "
                                    errorMessage = "invalid " + error.errors[0].path
                                    subErrorMessage = error.errors[0].message
                                }
                                
                            }
                            response.render("edit-jar", {
                                pageTitle: "Money Jar - Jar",
                                errorMessage: errorMessage,
                                subErrorMessage: subErrorMessage,
                                jar: tmpJar
                            });
                        })
                    }).catch(error => {
                        console.error("Error: ", error);
                        response.render("error", {
                            pageTitle: "Money Jar - Upload Error"
                        });
                    });
                } else {
                    response.render("edit-jar", {
                        pageTitle: "Money Jar - Jar",
                        errorMessage: "Please provide an image",
                        subErrorMessage: null,
                        jar: tmpJar
                    });
                }
            } else  {
                response.redirect('/admin');
            }            
        });

    router.route('/admin/jar/:shortCode/jar-slot/:jarSlotId')
        .get(function(request, response, next) {
            if(request.user && request.user.ownsJar(request.params.shortCode) && request.user.ownsJarSlot(request.params.shortCode)){
                db.JarSlot.findById(
                    request.params.jarSlotId,
                    {
                        where: {
                            jarId: request.params.shortCode
                        },
                        include: [
                            {
                                association: db.JarSlot.Jar,
                            },
                            {
                                association: db.JarSlot.Slot,
                                include: [
                                    {
                                        association: db.Slot.Image
                                    }
                                ]
                            }
                        ]
                    }
                ).then(jarSlot => {
                    if(jarSlot) {
                        response.render("edit-jar-slot", {
                            pageTitle: "Money Jar - Jar Slot",
                            heading: "Add new jar slot",
                            jarSlot: jarSlot
                        });
                    } else {
                        response.render("error", {
                            pageTitle: "Money Jar - Error"
                        });
                    }
                }).catch(error => {
                    console.error("Error: ", error);
                    response.render("error", {
                        pageTitle: "Money Jar - Error"
                    });
                })
            } else {
                response.redirect("/admin");
            }
        })
        .post(function(request, response, next) {
            // TODO: Create a Jar
            // TODO: Redirect to Add a slot...
            if(request.user && request.user.ownsJar(request.params.shortCode) && request.user.ownsJarSlot(request.params.jarSlotId)){
                var shortCode = request.params.shortCode;
                db.JarSlot.update(
                    {
                        uri: request.body.uri,
                        // order: request.body.order
                    },
                    {
                        where: {
                            id: request.params.jarSlotId,
                        }
                    }
                ).then(success => {
                    if(success[0]) {
                        if (request.query.complete != 'true')
                            response.redirect("/admin/jar/" + shortCode);
                        else 
                            response.redirect("/admin/jar/" + shortCode +"/jar-slot");
                    } else {
                        console.error("Error: Failed to create slot");
                        response.render("error", {
                            pageTitle: "Money Jar - Error"
                        });
                    }
                }).catch(error => {
                    console.error("Error: ", error);
                    response.render("error", {
                        pageTitle: "Money Jar - Error"
                    });
                })

            } else {
                response.redirect("/admin");
            }
            
        });
    
    router.route('/admin/jar/:shortCode/jar-slot')
        .get(function(request, response, next) {
            // TODO: Check if user is authenticated
            // TODO: Remove already selected slots...
            if(request.user && request.user.ownsJar(request.params.shortCode))
            {
                db.Slot.findAll(
                    {
                        include: [
                            {
                                association: db.Slot.Image
                            }
                        ]
                    }
                )
                .then(slots => {
                    db.Jar.findOne(
                        {
                            where: {
                                shortCode: request.params.shortCode
                            },
                            include: [
                                {
                                    association: db.Jar.JarSlots,
                                    include: [
                                        {
                                            association: db.JarSlot.Slot
                                        }
                                    ]
                                }
                            ]
                        }
                    ).then(jar => {
                        if(jar) {
                            var avaibleSlots = slots.filter(slot => {
                                for(var i in jar.jar_slots) {
                                    var jarSlot = jar.jar_slots[i];
                                    if(jarSlot.slot.id == slot.id)
                                        return false;
                                }
                                return true;
                            });

                            response.render("select-jar-slot", {
                                pageTitle: "Money Jar - Jar Slot",
                                heading: "Select jar slot",
                                jar: jar,
                                slots: avaibleSlots
                            });
                        } else {
                            console.error("Failed to find jar");
                            response.render("error", {
                                pageTitle: "Money Jar - Error"
                            });
                        }
                    })
                    .catch(error => {
                        console.error("Select Jar Error: ", error);
                        response.render("error", {
                            pageTitle: "Money Jar - Error"
                        });
                    })
                })
                .catch(error => {
                    console.error("Select Jar Slot (Slot) Error: ", error);
                    response.render("error", {
                        pageTitle: "Money Jar - Error"
                    });
                })
                
            } else {
                response.redirect("/admin");
            }
            
        })
        .post(function(request, response, next) {
            if(request.user && request.user.ownsJar(request.params.shortCode))
            {
                console.log("Jar Slot: ", request.body);
                var shortCode = request.params.shortCode;

                db.Jar.findOne(
                    {
                        where: {
                            shortCode: shortCode
                        }
                    }
                ).then(jar => {
                    db.Slot.findById(request.body.slot)
                    .then(slot => {
                        db.JarSlot.create(
                            {
                                order: 0, // TODO: Remove this...
                                uri: "", // TODO: Remove this...
                                slotId: slot.id,
                                jarId: jar.id
                            }
                        ).then(jarSlot => {
                            if(jarSlot) {
                                response.redirect("/admin/jar/" + shortCode + "/jar-slot/" + jarSlot.id);
                            } else {
                                console.error("Create Jar Slot Error: ", error);
                                response.render("error", {
                                    pageTitle: "Money Jar - Failed to Create Jar Slot"
                                });
                            }
                        });
                    })
                    .catch(error => {
                        console.error("Select Jar Slot (Slot) Error: ", error);
                        response.render("error", {
                            pageTitle: "Money Jar - Error"
                        });
                    })
                })
                .catch(error => {
                    console.error("Select Jar Slot (Slot) Error: ", error);
                    response.render("error", {
                        pageTitle: "Money Jar - Error"
                    });
                })             
            } else {
                response.redirect("/admin");
            }            
        });

    router.route('/admin/jar/:shortCode/edit')
        .get(function(request, response, next) {
            // TODO: Check if user is authenticated and owns jar
            // TODO: Render Jar with ID...
            if(request.user && request.user.ownsJar(request.params.shortCode))
            {
                db.Jar.findOne(
                    {
                        where: {
                            shortCode: request.params.shortCode
                        },
                        include: [
                            {
                                association: db.Jar.Image
                            }
                        ]
                    }
                ).then(jar => {
                    response.render("edit-jar", {
                        pageTitle: "Money Jar - Jar",
                        errorMessage: null,
                        subErrorMessage: null,
                        jar: jar
                    });
                }).catch(error => {
                    console.error("Edit Jar Error: ", error);
                    response.render("error", {
                        pageTitle: "Money Jar - Error"
                    });
                })
                
            } else {
                response.redirect("/admin");
            }
        })
        .post(imageUploads.single('image'), function(request, response, next) {
            // TODO: Edit this jar
            // TODO: Render edited jar...
            console.log("************Image: ", request.file);

            if(request.file) {
                if(request.user && request.user.ownsJar(request.params.shortCode)){
                    // TODO: get the jar...
                    var shortCode = request.params.shortCode;
                    db.Jar.update(
                        {
                            displayName: request.body.displayName,
                            description: request.body.description
                        },
                        {
                            where: {
                                shortCode: shortCode
                            }
                        }
                    ).then(success => {
                        if(success) {
                            // Success... set up jar slots...
                            response.redirect("/admin/jar/" + shortCode +"/jar-slot");
                        } else {
                            console.error("Error: Failed to create slot");
                            response.render("error", {
                                pageTitle: "Money Jar - Error"
                            });
                        }
                    }).catch(error => {
                        console.error("Error: ", error);
                        response.render("error", {
                            pageTitle: "Money Jar - Error"
                        });
                    })
                } else  {
                    response.redirect('/admin');
                }
            } else {
                response.render("error", {
                    pageTitle: "Money Jar - Upload Error"
                });
            }
            
        });

    router.route('/admin/image/:imageId/edit')
        .get(function(request, response, next) {
            // TODO: Check if user is authenticated and owns image
            // TODO: Add image...
            if(request.user && request.user.ownsImage(request.params.imageId))
            {
                db.Image.findById(request.params.imageId)
                .then(image => {
                    response.render("edit-image", {
                        pageTitle: "Money Jar - Image",
                        image: image
                    });
                }).catch(error => {
                    console.error("Error: ", error);
                    response.render("error", {
                        pageTitle: "Money Jar - Image Change Error"
                    });
                })
                
            } else {
                response.redirect("/admin");
            }
        })
        .post(imageUploads.single('image'), function(request, response, next) {
            if(request.file) {
                if(request.user && request.user.ownsImage(request.params.imageId))
                {
                    var imageId = request.params.imageId;
                    db.Image.update(
                        {
                            src: request.file.path
                        },
                        {
                            where: {
                                id: imageId
                            }
                        }
                    ).then(image => {
                        // TODO: communicate successful upload to user...
                        // TODO: Delete old image...
                        response.redirect("/admin");
                    })
                    // EDIT Jar...
                } else {
                    response.render("unauthorized", {
                        pageTitle: "Money Jar - Unauthorized"
                    });
                }
            } else {
                response.render("error", {
                    pageTitle: "Money Jar - Image Change Error"
                });
            }
        });
    
    router.route('/admin/image/:imageId')
        .get(function(request, response, next) {
            db.Image.findById(request.params.imageId)
            .then(image => {
                if(image) {
                    // show image...
                    var filePath = path.resolve(image.src);
                    // response.type(mime.getType(filePath));
                    response.sendFile(filePath);
                } else {  
                    // TODO: Tell user something is wrong...  
                    next();
                }
            })
        });

    router.route('/admin')
        .get(function(request, response, next) { 
            if(request.user && request.user.isAdmin() ) {
                // TODO: Renders Jars and slots...
                db.Slot.findAll()
                .then(slots => {
                    db.Jar.findAll(
                        {
                            where: {
                                userId: request.user.id
                            },
                            include: [
                                {
                                    association: db.Jar.JarSlots
                                }
                            ]
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
                    console.error("Slot Errors: ", error)
                    response.render("error", {
                        pageTitle: "Money Jar - Error",
                    });
                })
            } else if(request.user){
                // TODO: create a function to write this code...
                db.Jar.findAll(
                    {
                        where: {
                            userId: request.user.id
                        },
                        include: [
                            {
                                association: db.Jar.JarSlots
                            }
                        ]
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

    router.route('/:shortCode/')
        .get(function(request, response, next) {
            // TODO: Show avaible jar. 
            // TODO: Show claim jar if short code isn't in the system.
            var shortCode = request.params.shortCode;
            db.Jar.findOne(
                {
                    where: {
                        shortCode: request.params.shortCode
                    },
                    include: [
                        {
                            association: db.Jar.Image,
                        },
                        {
                            association: db.Jar.JarSlots,
                            include: [
                                {
                                    association: db.JarSlot.Slot,
                                    include: [
                                        {
                                            association: db.Slot.Image
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ).then(jar => {
                if(jar) {
                    response.render("money-jar", {
                        pageTitle: "Money Jar - Jar",
                        jar: jar
                    });
                } else {
                    response.render("non-existent-money-jar", {
                        pageTitle: "Money Jar - Jar",
                        shortCode: shortCode
                    });
                }
                
            })
            
        });

    router.route('/:shortCode/:jarSlotId/')
        .get((request, response, next) => {
            var shortCode = request.params.shortCode;
            var ipAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

            // TODO: Get more express oriented IP info...
            // app.enable('trust proxy')
            // var ip = request.ip || request.ips;
            db.JarSlot.findById(
                request.params.jarSlotId,
                {
                    include: [
                        {
                            association: db.JarSlot.Slot
                        }
                    ]
                }
            )
            .then(jarSlot => {
                if(jarSlot) {
                    response.redirect(jarSlot.slot.scheme + jarSlot.uri);
                    // TODO: Create a click entity...
                    db.Click.create(
                        {
                            // TODO: Populate
                            ipAddress: ipAddress,
                            jarSlotId: jarSlot.id
                        }
                    ).then(()=>{
                        // Click stored...
                    });
                } else {
                    next();
                    // TODO: Handle errors...
                }
                
            }).catch(error => {
                // TODO: Might wanna make it redirect to he money jar...
                // console.log("Click Error: ", error);
                // response.redirect("/" + shortCode);
                next();
                // TODO: Handle errors...
            })
        });

    // router.use(express.static('static')); 
    router.use('/admin/static', express.static('static'))
    
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