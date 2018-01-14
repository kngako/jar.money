module.exports = function (sequelize, DataTypes, options) {
    var model = sequelize.define("confirmation", {
        token: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
        },
        sent: {
            type: DataTypes.INTEGER
        }
    }, {
        comment: "User confirmation"
    });

    return model;
};