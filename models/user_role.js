module.exports = function (sequelize, DataTypes, options) {
    var model = sequelize.define("user_role", {
        // Attributes...
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
        }
    });

    return model;
};