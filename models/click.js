module.exports = function (sequelize, DataTypes, options) {
    var model = options.sequelize.define("click", {
        // Attributes...
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
        },
        ipAddress: {
            type: DataTypes.STRING
        }
    });

    return model;
};