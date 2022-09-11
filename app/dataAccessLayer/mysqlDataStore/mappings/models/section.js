'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Section extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Section.belongsTo(models.Roles,{
                through:models.AuthRoleSection,
                as:'authRoleSection',
                foreignKey:'SectionId'
            });
        }
    }
    Section.init({
        SectionId: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            value: undefined
        },
        SectionIndex: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            unique: true,
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
        modelName: 'Section',
    });
    return Section;
};