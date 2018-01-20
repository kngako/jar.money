module.exports = function (sequelize, DataTypes, options) {
    var model = sequelize.define("image", {
        // Attributes...
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
        },
        src: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // webSrc: {
        //     type: DataTypes.STRING
        // }
    });

    return model;
};