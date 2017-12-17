module.exports = function (options) {
    var model = options.sequelize.define(options.TABLE_NAMES.CONFIRMATION, {
        token: {
            type: options.Sequelize.UUID,
            defaultValue: options.Sequelize.UUIDV4,
            primaryKey: true,
            unique: true
        },
        sent: {
            type: options.Sequelize.INTEGER
        }
    }, {
        comment: "User confirmation"
    });

    return model;
};