module.exports = function (options) {
    var model = options.sequelize.define("jar", {
        // Attributes...
        displayName: {
            type: options.Sequelize.STRING,
            // defaultValue: options.Sequelize.UUIDV4,
            primaryKey: true,
            unique: true
        },
        // displayName: {
        //     type: options.Sequelize.STRING,
        //     allowNull: false
        // },
        description: {
            type: options.Sequelize.STRING,
            allowNull: false
        },
    });

    return model;
};