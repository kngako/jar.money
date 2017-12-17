module.exports = function (config) {
    var db = {};

    db.LoadDB = (callback) => {
        callback(config, db);
    } // TODO: Turn this into a promise to be like all the other cool kids...
    return db;

    
};

