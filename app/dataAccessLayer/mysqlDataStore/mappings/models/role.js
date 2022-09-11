'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Role.belongsToMany(models.User,{
                through:models.UserRole,
                as:'userRole',
                foreignKey:'RoleId'
            });
            Role.belongsToMany(models.Section,{
                through:models.AuthRoleSection,
                as:'authRoleSection',
                foreignKey:'RoleId'
            });
        }
    }
    Role.init({
        RoleId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            value: undefined
        },
        RoleIndex: {
            type: DataTypes.INTEGER,
            primaryKey: false,
            autoIncrement: true,
            allowNull: false,
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
            allowNull: false,
            type: DataTypes.DATE,
            value: undefined
        },
        UTCDateUpdated: {
            type: DataTypes.DATE,
            allowNull: true,
            value: undefined
        }
    }, {
        sequelize,
        modelName: 'Role',
    });
    return Role;
};