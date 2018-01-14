module.exports = function (sequelize, DataTypes, options) {
    var model = sequelize.define("role", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        comment: "Each defined role in the system..."
    });

    return model;
};