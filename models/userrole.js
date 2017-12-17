module.exports = function (options) {
    var model = options.sequelize.define(options.TABLE_NAMES.USER_ROLE, {
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