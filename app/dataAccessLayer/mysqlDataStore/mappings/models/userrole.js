'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserRole extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            UserRole.belongsTo(models.User, {
                foreignKey: 'UserId',
                targetKey: 'UserId',
                as: 'user'
            });
            UserRole.belongsTo(models.Role, {
                foreignKey: 'RoleId',
                targetKey: 'RoleId',
                as: 'role'
            });
        }
    }
    UserRole.init({
        UserRoleId: {
            type: DataTypes.UUID,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            value: undefined
        },
        UserId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'UserId'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
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
        modelName: 'UserRole',
    });
    return UserRole;
};