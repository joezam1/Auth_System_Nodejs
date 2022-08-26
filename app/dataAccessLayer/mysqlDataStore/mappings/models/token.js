'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Token extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Token.belongsTo(models.User, {
                foreignKey: 'UserId',
                targetKey: 'UserId',
                as: 'users'
            });
        }
    }
    Token.init({
        TokenId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            value: undefined
        },
        UserId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'User',
                key: 'UserId'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            value: undefined

        },
        Token: {
            type: DataTypes.TEXT,
            allowNull: false,
            value: undefined
        },
        Type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            value: undefined
        },
        Payload: {
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
        UTCDateExpired: {
            type: DataTypes.DATE,
            allowNull: true,
            value: undefined
        }

    }, {
        sequelize,
        modelName: 'Token',
    });
    return Token;
};