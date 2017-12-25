module.exports = function (config) {
    var db = {};

    var dbOptions = {
        db: db
    };

    dbOptions.Sequelize = require('sequelize');
    // require('sequelize-hierarchy')(dbOptions.Sequelize);
    dbOptions.bcrypt = require('bcrypt'); // Used to hash the passwords...
    
    // Add the config of the things...
    var database = config.get('database.database');
    var username = config.get('database.username');
    var password = config.get('database.password');
    
    dbOptions.sequelize = new dbOptions.Sequelize(database, username, password, {
        host: config.get('database.host'),
        dialect: config.get('database.dialect'),
        
        // SQLite only
        storage: config.get('database.storage')
    }, {
        // don't delete database entries but set the newly added attribute deletedAt
        // to the current date (when deletion was done). paranoid will only work if
        // timestamps are enabled
        paranoid: true,
    });
    
    // Test out the connection
    dbOptions.sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
            // TODO: Fix 
        });
    
    // TODO: Import the modules...
    db.User = require('./models/user.js')(dbOptions);
    db.Role = require('./models/role.js')(dbOptions);
    db.UserRole = require('./models/user_role.js')(dbOptions);
    db.Location = require('./models/location.js')(dbOptions);
    db.Confirmation = require('./models/confirmation.js')(dbOptions);
    db.Jar = require('./models/jar.js')(dbOptions);
    db.JarSlot = require('./models/jar-slot.js')(dbOptions);
    db.Image = require('./models/image.js')(dbOptions);
    db.Slot = require('./models/slot.js')(dbOptions);
    db.Click = require('./models/click.js')(dbOptions);
    
    // Time for the associations...
    // User 1:N associations
    db.User.UserRoles = db.User.hasMany(db.UserRole);
    db.UserRole.belongsTo(db.User);

    // User 1:1 associations
    db.User.hasOne(db.Confirmation);
    db.Confirmation.belongsTo(db.User);
    
    // Roles 1:N associations...
    db.Role.UserRoles = db.Role.hasMany(db.UserRole);
    db.UserRole.belongsTo(db.Role);

    db.Jar.Image = db.Jar.hasOne(db.Image);

    db.JarSlot.Jar = db.JarSlot.hasOne(db.Jar);
    db.JarSlot.Slot = db.JarSlot.hasOne(db.Slot); // TODO: make allow null to false...

    db.Slot.Image = db.Slot.hasOne(db.Image);

    db.Click.JarSlot = db.Click.hasOne(db.JarSlot);

    db.LoadDB = (callback) => {
        dbOptions.sequelize.sync()
        .then(() => {
            callback(config, db);
        })
        .catch(error => {
            // Do the things...
            console.error('Unable to connect to the database:', error);
        })
    } // TODO: Turn this into a promise to be like all the other cool kids...
    return db;

    
};

