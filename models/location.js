module.exports = function (options) {
    var model = options.sequelize.define(options.TABLE_NAMES.LOCATION, {
        id: {
            type: options.Sequelize.BIGINT,
            primaryKey: true,
            unique: true,
            autoIncrement: true  
        },
        name: {
            type: options.Sequelize.STRING
        },
        description: {
            type: options.Sequelize.TEXT
        },
        country: {
            type: options.Sequelize.TEXT
        },
        city: {
            type: options.Sequelize.TEXT
        },
        postalCode: {
            type: options.Sequelize.TEXT
        },
        latitude: {
            type: options.Sequelize.INTEGER,
            allowNull: false,
            validate: { min: -90, max: 90 }
        },
        longitude: {
            type: options.Sequelize.INTEGER,
            allowNull: false,
            validate: { min: -90, max: 90 }
        },
        googleMapsURL: {
            type: options.Sequelize.TEXT,
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