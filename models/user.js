module.exports = function (sequelize, DataTypes, options) {
    var model = sequelize.define("user", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
        },
        email: {
            // make unique...
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: true
            },
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birthday: {
            type: DataTypes.DATE
        },
        emailConfirmedOn: {
            type: DataTypes.DATE
        },
        activitedOn: {
            type: DataTypes.DATE
        },
        // TODO: Set attribute to sensitive so that they dont get it...
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(val) {
                var hashedPassword = options != null && val != null && val.length > 0 ? options.bcrypt.hashSync(val, options.bcrypt.genSaltSync(9), null) : null;
                this.setDataValue('password', hashedPassword);
            }
        }

        // TODO: Add a isAdmin field/getter override here...
    }, {
        comment: "The individual users of the system..."
    });
    
    model.prototype.validPassword = function(password) {
        return options.bcrypt.compareSync(password, this.password);
    };

    model.prototype.isAdmin = function() {
        // TODO: Might need to query the rules here if we get many users...
        
        for(var i in this.user_roles) {
            var userRole = this.user_roles[i];
            // console.log("User Role: ", this.user_roles);
            if(userRole.role.type == "admin" || userRole.role.type == "superadmin" ) {
                return true;
            }
        }
        return false;
    }

    model.prototype.ownsJar = function(shortCode, db, additionalIncludes) {
        // TODO: check if jar is owned by user...
        var userId = this.id;
        return new Promise(function(resolve, reject) {
            // do a thing, possibly async, then…
            var include = [];
            if(additionalIncludes) {
                include = include.concat(additionalIncludes);
            }
            db.Jar.findOne(
                {
                    where: {
                        shortCode: shortCode,
                        userId: userId
                    },
                    include: include
                }
            )
            .then(jar => {
                resolve(jar);
            }).catch(error => {
                console.log("Own Jar Error: ", error);
                reject(error);
            })
        });
    }

    model.prototype.ownsJarSlot = function(jarSlotId, shortCode, db, additionalIncludes) {
        // Check if jar slot is owned by user...
        var userId = this.id;
        return new Promise(function(resolve, reject) {
            // Prepare the additionals...
            var include = [
                {
                    association: db.JarSlot.Jar,
                    where: {
                        shortCode: shortCode,
                        userId: userId
                    }
                }
            ];
            if(additionalIncludes) {
                include = include.concat(additionalIncludes);
            }
            // Perform the check
            db.JarSlot.findOne(
                {
                    where: {
                        id: jarSlotId
                    },
                    include: include
                }
            )
            .then(jarSlot => {
                resolve(jarSlot);
            }).catch(error => {
                console.log("Own JarSlot Error: ", error);
                reject(error);
            })
        });
    }

    model.prototype.ownsImage = function(imageId, db) {
        // TODO: Check if Image is owned by user...
        var userId = this.id;
        return new Promise(function(resolve, reject) {
            // TODO: Allow admins to change images??
            db.Image.findOne(
                {
                    where: {
                        id: imageId,
                        userId: userId
                    }
                }
            )
            .then(image => {
                resolve(image);
            }).catch(error => {
                console.log("Own Image: ", error);
                reject(error);
            })
        });
    }

    // Model.prototype.toJSON = function () {
    //     var values = Object.assign({}, this.get());
    //     delete values.password;
    //     // TODO: have an associative array for all memberships that user belongs too...
    //     return values;
    // }

    return model;
};