module.exports = function (options) {
    var model = options.sequelize.define("click", {
        // Attributes...
        id: {
            type: options.Sequelize.UUID,
            defaultValue: options.Sequelize.UUIDV4,
            primaryKey: true,
            unique: true
        },
        ipAddress: {
            type: options.Sequelize.STRING
        }
    });

    return model;
};