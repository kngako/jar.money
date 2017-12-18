module.exports = function (options) {
    var model = options.sequelize.define("user_role", {
        // Attributes...
        id: {
            type: options.Sequelize.UUID,
            defaultValue: options.Sequelize.UUIDV4,
            primaryKey: true,
            unique: true
        }
    });

    return model;
};