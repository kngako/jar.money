// App starts by loading the persistence which will then load the server...

// TODO: Read and set configs...
var config = require("config");
var db = require('./persistence.js')(config);

db.LoadDB(function(config, dbInstance) {
    // Table created
    // We could probably run the things...
    var server = require('./server.js')(config, dbInstance);
    // TODO: Create a method on server called runServer to runServer...
});


