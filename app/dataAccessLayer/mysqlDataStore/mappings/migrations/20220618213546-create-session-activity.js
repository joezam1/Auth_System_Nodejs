'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('SessionActivities', {

            SessionActivityId: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            UserId: {
                type: Sequelize.UUID,
                allowNull: false,
                references:{
                    model:'Users',
                    key:'UserId'
                },
                onDelete:'CASCADE',
                onUpdate:'CASCADE'
            },
            GeoLocation: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            Device: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            UserAgent: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            UTCLoginDate: {
                allowNull: false,
                type: Sequelize.DATE
            },
            UTCLogoutDate: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('SessionActivities');
    }
};