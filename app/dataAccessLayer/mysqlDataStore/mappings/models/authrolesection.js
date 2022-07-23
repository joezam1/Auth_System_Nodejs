'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AuthRoleSection extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            AuthRoleSection.belongsTo(models.Role,{
                foreignKey:'RoleId',
                targetkey:'RoleId',
                as:'role'
            });
            AuthRoleSection.belongsTo(models.Section,{
                foreignKey:'SectionId',
                targetKey:'SectionId',
                as:'Section'
            });
        }
    }
    AuthRoleSection.init({
        AuthRoleSectionId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            value: undefined
        },
        RoleId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Roles',
                key: 'RoleId'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
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
            allowNull: false,
            value: undefined
        }
    }, {
        sequelize,
        modelName: 'AuthRoleSection',
    });
    return AuthRoleSection;
};