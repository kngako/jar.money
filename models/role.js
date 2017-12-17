module.exports = function (options) {
    var model = options.sequelize.define(options.TABLE_NAMES.ROLE, {
        id: {
            type: options.Sequelize.UUID,
            defaultValue: options.Sequelize.UUIDV4,
            primaryKey: true,
            unique: true,
        },
        description: {
            type: options.Sequelize.STRING
        },
        type: {
            type: options.Sequelize.STRING
        }
    }, {
        comment: "Each defined role in the system..."
    });

    return model;
};