module.exports = function (sequelize, DataTypes, options) {
    var model = sequelize.define("jar_slot", {
        // Attributes...
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
        },
        uri: {
            type: DataTypes.STRING,
        },
        order: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
    });

    return model;
};