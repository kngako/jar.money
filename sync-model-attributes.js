// This module syncs the database to the models...


var config = require("config");

var db = require('./persistence.js')(config);

db.updateDatabaseFromModels(() => {
    console.log("Database updated successfully.");
});