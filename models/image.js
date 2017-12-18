module.exports = function (options) {
    var model = options.sequelize.define("image", {
        // Attributes...
        id: {
            type: options.Sequelize.UUID,
            defaultValue: options.Sequelize.UUIDV4,
            primaryKey: true,
            unique: true
        },
        src: {
            type: options.Sequelize.STRING,
            allowNull: false
        },
    });

    return model;
};