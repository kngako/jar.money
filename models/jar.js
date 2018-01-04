module.exports = function (options) {
    var model = options.sequelize.define("jar", {
        id: {
            type: options.Sequelize.UUID,
            defaultValue: options.Sequelize.UUIDV4,
            primaryKey: true,
            unique: true
        },
        // TODO: Make displayName the primary key..
        shortCode: {
            type: options.Sequelize.STRING,
            unique: true
        },
        displayName: {
            type: options.Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: options.Sequelize.STRING,
            allowNull: false
        },
    });

    return model;
};