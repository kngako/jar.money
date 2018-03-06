/**
 * This router handles things related to the web browser experience...
 */
// This is the mock data we working with...

module.exports = function (options) {
    var path = require('path');
    var multer  = require('multer');
    var mime = require('mime');
    var qr = require('qr-image');
    
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
    const notFoundPage = pug.compileFile('views/404.pug'); 
    const adminPage = pug.compileFile('views/admin.pug');
    const confirmEmailPage = pug.compileFile('views/confirm-email.pug');
    const confirmationFailurePage = pug.compileFile('views/confirmation-failure.pug');
    const confirmationSuccessPage = pug.compileFile('views/confirmation-success.pug');
    const editImagePage = pug.compileFile('views/edit-image.pug');
    const editJarSlotPage = pug.compileFile('views/edit-jar-slot.pug');
    const editJarPage = pug.compileFile('views/edit-jar.pug');
    const editSlotPage = pug.compileFile('views/edit-slot.pug');
    const errorPage = pug.compileFile('views/error.pug');
    const homePage = pug.compileFile('views/home.pug');
    const loginPage = pug.compileFile('views/login.pug');
    const moneyJarPage = pug.compileFile('views/money-jar.pug');
    const nonExistentMoneyJar = pug.compileFile('views/non-existent-money-jar.pug');
    const openJarPage = pug.compileFile('views/open-jar.pug');
    const selectJarSlotPage = pug.compileFile('views/select-jar-slot.pug');
    const signupPage = pug.compileFile('views/signup.pug');
    const unauthorizedPage = pug.compileFile('views/unauthorized.pug');
    const viewJarPage = pug.compileFile('views/view-jar.pug');
    const viewSlotPage = pug.compileFile('views/view-slot.pug');
    const welcomeJarPage = pug.compileFile('views/welcome-jar.pug');

    var router = express.Router();

    router.route('/')
        .get(function(request, response, next) {
            response.send(homePage({
                user: request.user,
                pageTitle: "Money Jar - Home"
            }))
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
            console.log("346436257257: LOGIN: ", request);
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
                                console.log('44364246256: Trying to login: ', request)
                                passport.authenticate('local')(request, response, () => {
                                    // TODO: Figure out what problems arises without saving session...
                                    response.send(confirmEmailPage({
                                        user: request.user,
                                        pageTitle: "Money Jar - Confirm email"
                                    }));
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
                        response.send(errorPage({
                            user: request.user,
                            pageTitle: "Money Jar - Signup ERROR"
                        }))
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
                        response.send(confirmationSuccessPage({
                            user: request.user,
                            pageTitle: "Money Jar - Confirmation Success"
                        }))
                        // response.redirect("/confirmation-success");
                    })
                    .catch(error => {
                        console.error("Error Confirmation: ", error);
                        // TODO: Show error info...
                        response.send(errorPage({
                            user: request.user,
                            pageTitle: "Money Jar - Error"
                        }))
                    });
                } else {
                    // TODO: Render confirmation error...
                    response.send(confirmationFailurePage({
                        user: request.user,
                        pageTitle: "Money Jar - Confirmation Failure"
                    }))
                    // response.status(400).send("Match not found");
                }
            })
        });

    router.route('/admin/confirm-email/')
        .get(function(request, response, next){
            console.log("We should be here redirecting stuff...");
            if (request.user && request.user.emailConfirmedOn == null) {
                response.send(confirmEmailPage({
                    user: request.user,
                    pageTitle: "Money Jar - Confirm email"
                }))
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
                response.send(loginPage({
                    pageTitle: "Money Jar - Login",
                    data: null
                }))
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
                        response.send(loginPage({
                            pageTitle: "Money Jar - Login",
                            data: info
                        }))
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
                    response.send(viewSlotPage({
                        user: request.user,
                        pageTitle: "Money Jar - Slot",
                        slot: slot
                    }))
                }).catch(error => {
                    response.send(errorPage({
                        user: request.user,
                        pageTitle: "Money Jar - Error"
                    }))
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
                    response.send(editSlotPage({
                        user: request.user,
                        pageTitle: "Money Jar - Slot",
                        slot: slot
                    }))
                }).catch(error => {
                    response.send(errorPage({
                        user: request.user,
                        pageTitle: "Money Jar - Error"
                    }))
                })
                
            } else  {
                response.redirect('/admin');
            }
            
        })
        .post(function(request, response, next) {
            if(request.user && request.user.isAdmin()){
                // TODO: Edit a slot
                console.log("Trying to update: ", request.body);
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
                    console.error("Update Error: ", error);
                    response.send(errorPage({
                        user: request.user,
                        pageTitle: "Money Jar - Error"
                    }))
                })
            } else  {
                response.redirect('/admin');
            }
            
        });

    
    router.route('/admin/slot')
        .get(function(request, response, next) {
            if(request.user && request.user.isAdmin()){
                // TODO: Render Slot with ID...
                response.send(editSlotPage({
                    user: request.user,
                    pageTitle: "Money Jar - Slot",
                    slot: {}
                }))
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
                            userId: request.user.id,
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
                                response.send(errorPage({
                                    user: request.user,
                                    pageTitle: "Money Jar - Error"
                                }))
                            }
                        }).catch(error => {
                            // TODO: Creatation 
                            console.error("Slot Creation Error: ", error);
                            response.send(errorPage({
                                user: request.user,
                                pageTitle: "Money Jar - Error"
                            }))
                        })
                    }).catch(error => {
                        // TODO: Creatation 
                        console.error("Slot Creation Error: ", error);
                        response.send(errorPage({
                            user: request.user,
                            pageTitle: "Money Jar - Error"
                        }))
                    })
                    
                } else  {
                    response.redirect('/admin');
                }
            } else {
                response.send(errorPage({
                    user: request.user,
                    pageTitle: "Money Jar - Upload Error"
                }))
            }
            
            
        });

    router.route('/admin/jar/:shortCode')
        .get(function(request, response, next) {
            // TODO: Check if user is admin or owner of the jar...
            // TODO: Render Jar with ID...
            if(request.user){
                var additionalIncludes = [
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
                ];
                request.user.ownsJar(request.params.shortCode, db, additionalIncludes)
                .then(jar => {
                    if(jar) {
                        // TODO: get the jar...
                        response.send(viewJarPage({
                            user: request.user,
                            pageTitle: "Money Jar - Jar",
                            jar: jar
                        }))
                    } else {
                        response.redirect('/admin');
                    }
                }).catch(error => {
                    // TODO: Creatation 
                    console.error("Access Error: ", error);
                    response.send(errorPage({
                        user: request.user,
                        pageTitle: "Money Jar - Access Error"
                    }))
                })
                
            } else  {
                response.redirect('/admin');
            }

            
        })
        
    
    router.route('/admin/jar/')
        .get(function(request, response, next) {
            // TODO: Check if user is authenticated
            if(request.user){
                response.send(editJarPage({
                    user: request.user,
                    pageTitle: "Money Jar - Jar",
                    errorMessage: null,
                    subErrorMessage: null,
                    jar: {}
                }))
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
                            userId: request.user.id,
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
                                response.send(errorPage({
                                    user: request.user,
                                    pageTitle: "Money Jar - Error"
                                }))
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
                            response.send(editJarPage({
                                user: request.user,
                                pageTitle: "Money Jar - Jar",
                                errorMessage: errorMessage,
                                subErrorMessage: subErrorMessage,
                                jar: tmpJar
                            }))
                        })
                    }).catch(error => {
                        console.error("Error: ", error);
                        response.send(errorPage({
                            user: request.user,
                            pageTitle: "Money Jar - Error"
                        }))
                    });
                } else {
                    response.send(editJarPage({
                        user: request.user,
                        pageTitle: "Money Jar - Jar",
                        errorMessage: "Please provide an image",
                        subErrorMessage: null,
                        jar: tmpJar
                    }))
                }
            } else  {
                response.redirect('/admin');
            }            
        });

    router.route('/admin/jar/:shortCode/jar-slot/:jarSlotId')
        .get(function(request, response, next) {
            if(request.user){
                request.user.ownsJarSlot(request.params.jarSlotId, request.params.shortCode, db, {
                    association: db.JarSlot.Slot,
                    include: [
                        {
                            association: db.Slot.Image
                        }
                    ]
                })
                .then(jarSlot => {
                    if(jarSlot) {
                        response.send(editJarSlotPage({
                            user: request.user,
                            pageTitle: "Money Jar - Jar Slot",
                            heading: "Add new jar slot",
                            jarSlot: jarSlot
                        }))
                    } else {
                        response.redirect("/admin");
                    }
                })
                
            } else {
                response.redirect("/admin");
            }
        })
        .post(function(request, response, next) {
            // TODO: Create a Jar
            // TODO: Redirect to Add a slot...
            if(request.user){
                var shortCode = request.params.shortCode;
                
                request.user.ownsJarSlot(request.params.jarSlotId, shortCode, db, {
                    association: db.JarSlot.Slot
                })
                .then(jarSlot => {
                    if(jarSlot) {
                        var uri = request.body.uri;     
                        if(uri && uri.startsWith(jarSlot.slot.scheme)) {
                            uri = uri.replace(jarSlot.slot.scheme, "");
                        }
                        // TODO: construct a redirectUrl and run a regex on it...
                        jarSlot.update(
                            {
                                uri: uri,
                            }
                        ).then ((success) => {
                            console.log("Jarslot Update Result: ", success);

                            response.redirect("/admin/jar/" + shortCode);
                        })
                    } else {
                        response.redirect("/admin");
                    }
                }).catch(error => {
                    console.error("Error: ", error);
                    response.send(errorPage({
                        user: request.user,
                        pageTitle: "Money Jar - Error"
                    }))
                })
            } else {
                response.redirect("/admin");
            }
            
        });
    
    router.route('/admin/jar/:shortCode/jar-slot')
        .get(function(request, response, next) {
            // TODO: Check if user is authenticated
            // TODO: Remove already selected slots...
            if(request.user)
            {
                var additionalIncludes = [
                    {
                        association: db.Jar.JarSlots,
                        include: [
                            {
                                association: db.JarSlot.Slot
                            }
                        ]
                    }
                ];
                request.user.ownsJar(request.params.shortCode, db, additionalIncludes)
                .then(jar => {
                    if(jar) {
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
                            var avaibleSlots = slots.filter(slot => {
                                for(var i in jar.jar_slots) {
                                    var jarSlot = jar.jar_slots[i];
                                    if(jarSlot.slot.id == slot.id)
                                        return false;
                                }
                                return true;
                            });
                            
                            console.log("Slot: ", avaibleSlots);
                            response.send(selectJarSlotPage({
                                user: request.user,
                                pageTitle: "Money Jar - Jar Slot",
                                heading: "Select jar slot",
                                jar: jar,
                                slots: avaibleSlots
                            }))
                        })
                        .catch(error => {
                            console.error("Select Jar Slot (Slot) Error: ", error);
                            response.send(errorPage({
                                user: request.user,
                                pageTitle: "Money Jar - Error"
                            }))
                        })
                        
                    } else {
                        response.redirect("/admin");
                    }
                })
                .catch(error => {
                    console.error("Select Jar Slot (Slot) Error: ", error);
                    response.send(errorPage({
                        user: request.user,
                        pageTitle: "Money Jar - Error"
                    }))
                })
                
            } else {
                response.redirect("/admin");
            }
            
        })
        .post(function(request, response, next) {
            if(request.user)
            {
                var shortCode = request.params.shortCode;
                request.user.ownsJar(shortCode, db)
                .then(jar => {
                    if(jar) {
                        
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
                                    response.send(errorPage({
                                        user: request.user,
                                        pageTitle: "Money Jar - Error"
                                    }))
                                }
                            });
                        })
                        .catch(error => {
                            console.error("Select Jar Slot (Slot) Error: ", error);
                            response.send(errorPage({
                                user: request.user,
                                pageTitle: "Money Jar - Error"
                            }))
                        })
                    } else {
                        response.redirect("/admin");
                    }
                })
                .catch(error => {
                    console.error("Select Jar Slot (Slot) Error: ", error);
                    response.send(errorPage({
                        user: request.user,
                        pageTitle: "Money Jar - Error"
                    }))
                })             
            } else {
                response.redirect("/admin");
            }            
        });

    router.route('/admin/jar/:shortCode/edit')
        .get(function(request, response, next) {
            // TODO: Check if user is authenticated and owns jar
            // TODO: Render Jar with ID...
            if(request.user)
            {
                var additionalIncludes = [
                    {
                        association: db.Jar.Image
                    }
                ];
                request.user.ownsJar(request.params.shortCode, db, additionalIncludes)
                .then(jar => {
                    if(jar) {
                        response.send(editJarPage({
                            user: request.user,
                            pageTitle: "Money Jar - Jar",
                            errorMessage: null,
                            subErrorMessage: null,
                            jar: jar
                        }))
                    } else {
                        response.redirect("/admin");
                    }
                }).catch(error => {
                    console.error("Edit Jar Error: ", error);
                    response.send(errorPage({
                        user: request.user,
                        pageTitle: "Money Jar - Error"
                    }))
                })
                
            } else {
                response.redirect("/admin");
            }
        })
        .post(function(request, response, next) {
            // TODO: Edit this jar
            // TODO: Render edited jar...
            if(request.user){
                var shortCode = request.params.shortCode;
                request.user.ownsJar(request.params.shortCode, db)
                .then(jar => {
                    // TODO: Create a check if it is not owned...
                    if(jar) {
                        return jar.update(
                            {
                                displayName: request.body.displayName,
                                description: request.body.description
                            }
                        )
                    } else {
                        return null
                    }
                    
                }).then( updatedJar => {
                    console.log("Jar Update: ", updatedJar);
                    response.redirect("/admin/jar/" + shortCode +"/jar-slot");
                }).catch(error => {
                    console.error("Error: ", error);
                    response.send(errorPage({
                        user: request.user,
                        pageTitle: "Money Jar - Error"
                    }))
                })
            } else  {
                response.redirect('/admin');
            }            
        });

    router.route('/admin/image/:imageId/edit')
        .get(function(request, response, next) {
            // TODO: Check if user is authenticated and owns image
            // TODO: Add image...
            if(request.user)
            {
                request.user.ownsImage(request.params.imageId, db)
                .then(image => {
                    if(image) {
                        response.send(editImagePage({
                            user: request.user,
                            pageTitle: "Money Jar - Image",
                            image: image
                        }))
                    } else {
                        response.redirect("/admin");
                    }
                }).catch(error => {
                    console.error("Error: ", error);
                    response.send(errorPage({
                        user: request.user,
                        pageTitle: "Money Jar - Error"
                    }))
                })
                
            } else {
                response.redirect("/admin");
            }
        })
        .post(imageUploads.single('image'), function(request, response, next) {
            if(request.file) {
                if(request.user)
                {
                    request.user.ownsImage(request.params.imageId, db)
                    .then(image => {
                        if(image) {
                            image.update(
                                {
                                    src: request.file.path
                                }
                            ).then(success => {
                                console.log("Image Update: ", success);
                                // TODO: Redirect back to the image...
                                response.redirect("/admin");
                            }).catch(error => {

                            })
                        } else {
                            response.redirect("/admin");
                        }
                    })
                    // EDIT Jar...
                } else {
                    response.redirect("/admin");
                }
            } else {
                response.send(errorPage({
                    user: request.user,
                    pageTitle: "Money Jar - Error"
                }))
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
            if(request.user) {
                // TODO: Automatically open the jar screen if user has no jars...
                var jarCount = -1;
                db.Jar.count(
                    {
                        where: {
                            userId: request.user.id
                        }
                    }
                ).then(userJarCount => {
                    jarCount = userJarCount; // Because I'm still getting used to promises
                    // TODO: Do a joined promise...
                    

                    if(request.user.isAdmin())
                        return db.Slot.findAll();
                    else
                        return null;
                })
                .then(slots => {
                    if(jarCount == 0) {
                        response.redirect("/admin/jar");
                    } else {
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
                            response.send(adminPage({
                                user: request.user,
                                pageTitle: "Money Jar - Admin",
                                slots: slots,
                                jars: ujars
                            }))
                        }).catch(error=> {
                            console.error("Jar Error: ", error)
                            response.send(errorPage({
                                user: request.user,
                                pageTitle: "Money Jar - Error"
                            }))
                        })
                    }
                    
                })
                .catch(error=> {
                    console.error("Slot Errors: ", error)
                    response.send(errorPage({
                        user: request.user,
                        pageTitle: "Money Jar - Error"
                    }))
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
            response.send(unauthorizedPage({
                user: request.user,
                pageTitle: "Money Jar - Unauthorized"
            }))
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
                    response.send(moneyJarPage({
                        user: request.user,
                        pageTitle: "Money Jar - " + jar.displayName,
                        jar: jar
                    }))
                } else {
                    response.send(nonExistentMoneyJar({
                        user: request.user,
                        pageTitle: "Money Jar - Jar",
                        shortCode: shortCode
                    }))
                }
                
            })
            
        });

    router.route('/:shortCode/jar-slot/:jarSlotId/')
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
                        },
                        {
                            association: db.JarSlot.Jar,
                            include: [
                                {
                                    association: db.Jar.User
                                }
                            ]
                        }
                    ]
                }
            )
            .then(jarSlot => {
                if(jarSlot) {
                    db.Click.create(
                        {
                            // TODO: Populate
                            ipAddress: ipAddress,
                            jarSlotId: jarSlot.id
                        }
                    ).then(()=>{
                        // Click stored...
                        console.log("Click created...");
                    }).catch(error => {
                        console.error("We have a problem"); 
                    })

                    var uri = jarSlot.uri;
                    if(uri && uri.startsWith(jarSlot.slot.scheme)) {
                        uri = uri.replace(jarSlot.slot.scheme, "");
                    }
                    var redirectUrl = jarSlot.slot.scheme + uri;

                    if(jarSlot.slot.scheme.startsWith("http")) {
                        response.redirect(redirectUrl);
                    } else {
                        var svgImage = qr.imageSync(jarSlot.uri, { type: 'svg' });
                        response.render("view-jar-slot", {
                            jarSlot: jarSlot,
                            svgImage: svgImage,
                            redirectUrl: redirectUrl
                        })
                    }
                    // TODO: Create a click entity...
                    
                } else {
                    next();
                    // TODO: Hamdlle errors
                }
                
            }).catch(error => {
                // TODO: Might wanna make it redirect to he money jar...
                // console.log("Click Error: ", error);
                // response.redirect("/" + shortCode);
                console.error("Problems: ", error);
                next();
                // TODO: Handle errors...
            })
        });

    // router.use(express.static('static')); 
    router.use('/admin/static', express.static('static'))
    
    router.use(function (request, response, next) {
        response.status(404);

        if (request.accepts('html')) {
            response.send(notFoundPage({
                user: request.user,
                pageTitle: "Money Jar - 404"
            }))
            return;
        }
        
        if (request.accepts('html')) {
            response.json({
                message: "URL not accessible"
            });
            return;
        }

        

        response.type('txt').send('Not found');
    })

    // router.use(function (request, response, next) {
    //     response.status(500).redirect("/error");
    // })
    return router;
};