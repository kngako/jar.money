module.exports = function (options) {
    var model = options.sequelize.define("user", {
        id: {
            type: options.Sequelize.UUID,
            defaultValue: options.Sequelize.UUIDV4,
            primaryKey: true,
            unique: true
        },
        email: {
            // make unique...
            type: options.Sequelize.STRING,
            unique: true,
            validate: {
                isEmail: true
            },
            allowNull: false,
        },
        phoneNumber: {
            type: options.Sequelize.STRING
        },
        firstName: {
            type: options.Sequelize.STRING,
            allowNull: false
        },
        lastName: {
            type: options.Sequelize.STRING,
            allowNull: false
        },
        birthday: {
            type: options.Sequelize.DATE
        },
        emailConfirmedOn: {
            type: options.Sequelize.DATE
        },
        activitedOn: {
            type: options.Sequelize.DATE
        },
        // TODO: Set attribute to sensitive so that they dont get it...
        password: {
            type: options.Sequelize.STRING,
            allowNull: false,
            set(val) {
                var hashedPassword = val != null && val.length > 0 ? options.bcrypt.hashSync(val, options.bcrypt.genSaltSync(9), null) : null;
                console.log("%%%%%%%%- Hashed Password: ", hashedPassword);
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

    model.prototype.ownsJar = function(jarId, db) {
        // TODO: check if jar is owned by user...
        
        return true;
    }

    model.prototype.ownsJarSlot = function(jarId, db) {
        // TODO: Check if jar slot is owned by user...
        
        return true;
    }

    model.prototype.ownsImage = function(imageId, db) {
        // TODO: Check if Image is owned by user...
        
        return true;
    }

    // Model.prototype.toJSON = function () {
    //     var values = Object.assign({}, this.get());
    //     delete values.password;
    //     // TODO: have an associative array for all memberships that user belongs too...
    //     return values;
    // }

    return model;
};