module.exports = function (options) {
    var model = options.sequelize.define("slot", {
        // Attributes...
        id: {
            type: options.Sequelize.UUID,
            defaultValue: options.Sequelize.UUIDV4,
            primaryKey: true,
            unique: true
        },
        type: {
            type: options.Sequelize.STRING,
            allowNull: false
        },
        name: {
            type: options.Sequelize.STRING,
            allowNull: false
        },
        callToAction: {
            type: options.Sequelize.STRING,
            allowNull: false
        },
        scheme: {
            type: options.Sequelize.STRING,
            allowNull: false
        },
        hint: {
            type: options.Sequelize.STRING,
            allowNull: false
        }
    });

    return model;
};