module.exports = function (sequelize, DataTypes, options) {
    var model = sequelize.define("location", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            unique: true,
            autoIncrement: true  
        },
        addressLine1: {
            type: DataTypes.STRING
        },
        addressLine2: {
            type: DataTypes.TEXT
        },
        country: {
            type: DataTypes.TEXT
        },
        city: {
            type: DataTypes.TEXT
        },
        postalCode: {
            type: DataTypes.TEXT
        },
        latitude: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: -90, max: 90 }
        },
        longitude: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: -90, max: 90 }
        },
        googleMapsURL: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
            validate: {
                isUrl: true
            }
        }
    }, {
        validate: {
            bothCoordsOrNone() {
                if ((this.latitude === null) !== (this.longitude === null)) {
                    throw new Error('Require either both latitude and longitude or neither')
                }
            }
        },
        comment: "Locations which are defined and used in the system..."
    });

    return model;
};