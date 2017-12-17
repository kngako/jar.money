module.exports = function (options) {
    var model = options.sequelize.define(options.TABLE_NAMES.USER, {
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
        level: {
            type: options.Sequelize.STRING,
            allowNull: false,
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
                this.setDataValue('password', options.bcrypt.hashSync(val, options.bcrypt.genSaltSync(9), null));
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
        // TODO: Find a more secure role id system...
        for(var i in this.user_roles) {
            var userRole = this.user_roles[i];
            if(userRole.roleId == "admin" || userRole.roleId == "superadmin" ) {
                return true;
            }
        }
        return false;
    }

    // Model.prototype.toJSON = function () {
    //     var values = Object.assign({}, this.get());
    //     delete values.password;
    //     // TODO: have an associative array for all memberships that user belongs too...
    //     return values;
    // }

    model.prototype.isAdminOfMembership = function(membershipId) {
        // TODO: Find a more secure role id system...
        for(var i in this.user_roles) {
            var userRole = this.user_roles[i];
            console.log("Checking: ", userRole.role.membershipId);
            if(userRole.role.membershipId == membershipId && (userRole.role.type == "admin" || userRole.role.type == "superadmin")) {
                return true;
            }
        }
        return false;
    }

    model.prototype.isMemberOfMembership = function(membershipId) {
        // TODO: Find a more secure role id system...
        for(var i in this.user_roles) {
            var userRole = this.user_roles[i];
            console.log("Checking: ", userRole.role.membershipId);
            console.log("Should be: ", membershipId);
            if(userRole.role.membershipId == membershipId && (userRole.role.type == "member" || userRole.role.type == "superadmin")) {
                return true;
            }
        }
        return false;
    }

    return model;
};