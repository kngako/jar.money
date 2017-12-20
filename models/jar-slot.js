module.exports = function (options) {
    var model = options.sequelize.define("jar_slot", {
        // Attributes...
        id: {
            type: options.Sequelize.UUID,
            defaultValue: options.Sequelize.UUIDV4,
            primaryKey: true,
            unique: true
        },
        uri: {
            type: options.Sequelize.STRING,
            allowNull: false
        },
        order: {
            type: options.Sequelize.INTEGER,
            allowNull: false
        },
    });

    return model;
};