'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SessionActivity extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            SessionActivity.belongsTo(models.User,{
                foreignKey:'UserId',
                targetKey:'UserId',
                as:'User'
            });
        }
    }
    SessionActivity.init({
        SessionActivityId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            value: undefined
        },
        UserId: {
            type: DataTypes.UUID,
            allowNull: false,
            references:{
                model:'User',
                key:'UserId'
            },
            onDelete:'CASCADE',
            onUpdate:'CASCADE',
            value: undefined
        },
        GeoLocation: {
            type: Sequelize.TEXT,
            allowNull: false,
            value: undefined
        },
        Device: {
            type: DataTypes.TEXT,
            allowNull: false,
            value: undefined
        },
        UserAgent: {
            type: DataTypes.TEXT,
            allowNull: false,
            value: undefined
        },
        UTCLoginDate: {
            type: DataTypes.DATE,
            allowNull: false,
            value: undefined
        },
        UTCLogoutDate: {
            type: DataTypes.DATE,
            allowNull: false,
            value: undefined
        }
    }, {
        sequelize,
        modelName: 'SessionActivity',
    });
    return SessionActivity;
};