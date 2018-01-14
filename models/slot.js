module.exports = function (sequelize, DataTypes, options) {
    var model = sequelize.define("slot", {
        // Attributes...
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
        },
        type: {
            type: DataTypes.STRING,
            // TODO: Validate that it's not an empty string...
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            // TODO: Validate that it's not an empty string...
            allowNull: false
        },
        callToAction: {
            type: DataTypes.STRING,
            // TODO: Validate that it's not an empty string...
            allowNull: false
        },
        scheme: {
            type: DataTypes.STRING,
            // TODO: Validate that it's not an empty string...
            allowNull: false
        },
        hint: {
            type: DataTypes.STRING,
            // TODO: Validate that it's not an empty string...
            allowNull: false
        }
    });

    return model;
};