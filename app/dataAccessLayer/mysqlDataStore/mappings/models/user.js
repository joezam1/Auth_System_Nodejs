'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.belongsTo(models.Role,{
                through:models.UserRole,
                as:'userRole',
                foreignKey:'UserId'
            });
            User.hasMany(models.Session,{
                foreignKey:'UserId',
                targetKey:'UserId'
            });
            User.hasMany(models.SessionActivity,{
                foreignKey:'UserId',
                targetKey:'UserId'
            });
            User.hasOne(models.Register,{
                foreignKey:'UserId',
                targetKey:'UserId'
            });
        }
    }
    User.init({
        UserId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            value: undefined
        },
        UserIndex: {
            type: DataTypes.INTEGER,
            primaryKey: false,
            unique: true,
            allowNull: false,
            value: undefined
        },
        FirstName: {
            type: DataTypes.STRING,
            allowNull: false,
            value: undefined
        },
        MiddleName: {
            type: DataTypes.STRING,
            allowNull: false,
            value: undefined
        },
        LastName: {
            type: DataTypes.STRING,
            allowNull: false,
            value: undefined
        },
        Username: {
            type: DataTypes.STRING,
            allowNull: false,
            value: undefined
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
            value: undefined
        },
        Password: {
            type: DataTypes.TEXT,
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
            allowNull: false,
            value: undefined
        }
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};