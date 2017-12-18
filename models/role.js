module.exports = function (options) {
    var model = options.sequelize.define("role", {
        id: {
            type: options.Sequelize.UUID,
            defaultValue: options.Sequelize.UUIDV4,
            primaryKey: true,
            unique: true,
        },
        description: {
            type: options.Sequelize.STRING,
            allowNull: false
        },
        type: {
            type: options.Sequelize.STRING,
            allowNull: false
        }
    }, {
        comment: "Each defined role in the system..."
    });

    return model;
};