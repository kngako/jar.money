module.exports = function (sequelize, DataTypes, options) {
    var model = sequelize.define("jar", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
        },
        // TODO: Make displayName the primary key..
        shortCode: {
            type: DataTypes.STRING,
            unique: true
        },
        displayName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
    });

    return model;
};