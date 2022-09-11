'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Service extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Service.belongsTo(models.Section,{
                foreignKey:'SectionId',
                targetKey:'SectionId',
                as:'section'
            });
        }
    }
    Service.init({
        ServiceId: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            value: undefined
        },
        SectionId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Sections',
                key: 'SectionId'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            value: undefined
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
            value: undefined
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: false,
            value: undefined
        },
        IsActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            value: undefined
        },
        UTCDateCreated: {
            type: DataTypes.DATE,
            allowNull: false,
            value: undefined
        },
        UTCDateUpdated: {
            type: DataTypes.DATE,
            allowNull: true,
            value: undefined
        }
    }, {
        sequelize,
        modelName: 'Service',
    });
    return Service;
};