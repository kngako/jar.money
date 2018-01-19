// This module syncs the database to the models...


var config = require("config");

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

// TODO: Import the modules...
db.User = require('./models/user.js')(dbOptions.sequelize, dbOptions.Sequelize, dbOptions);
db.Role = require('./models/role.js')(dbOptions.sequelize, dbOptions.Sequelize, dbOptions);
db.UserRole = require('./models/user_role.js')(dbOptions.sequelize, dbOptions.Sequelize, dbOptions);
db.Location = require('./models/location.js')(dbOptions.sequelize, dbOptions.Sequelize, dbOptions);
db.Confirmation = require('./models/confirmation.js')(dbOptions.sequelize, dbOptions.Sequelize, dbOptions);
db.Jar = require('./models/jar.js')(dbOptions.sequelize, dbOptions.Sequelize, dbOptions);
db.JarSlot = require('./models/jar-slot.js')(dbOptions.sequelize, dbOptions.Sequelize, dbOptions);
db.Image = require('./models/image.js')(dbOptions.sequelize, dbOptions.Sequelize, dbOptions);
db.Slot = require('./models/slot.js')(dbOptions.sequelize, dbOptions.Sequelize, dbOptions);
db.Click = require('./models/click.js')(dbOptions.sequelize, dbOptions.Sequelize, dbOptions);

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

db.User.Jars = db.User.hasMany(db.Jar);

db.Jar.JarSlots = db.Jar.hasMany(db.JarSlot);
db.JarSlot.Jar = db.JarSlot.belongsTo(db.Jar);
// db.JarSlot.Jar = db.JarSlot.belongsTo(db.Jar);

db.JarSlot.Slot = db.JarSlot.belongsTo(db.Slot); // TODO: make allow null to false...

db.Image.Jars = db.Image.hasMany(db.Jar);
db.Jar.Image = db.Jar.belongsTo(db.Image);

db.Image.Slots = db.Image.hasMany(db.Slot);
db.Slot.Image = db.Slot.belongsTo(db.Image);

db.User.Images = db.User.hasMany(db.Image);
db.Image.User = db.Image.belongsTo(db.User);

db.JarSlot.Clicks = db.JarSlot.hasMany(db.Click);


dbOptions.sequelize.sync({
    alter: true
})
.then(() => {
    console.log("It worked...");
})
.catch(error => {
    // Do the things...
    console.error('Unable to connect to the database:', error);
})


module.exports = db;