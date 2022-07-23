'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Roles', {
            RoleId: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            RoleIndex: {
                type: Sequelize.INTEGER,
                unique: true,
                autoIncrement: true,
                allowNull: false

            },
            Name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            Description: {
                type: Sequelize.STRING,
                allowNull: false
            },
            IsActive: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            },

            UTCDateCreated: {
                allowNull: false,
                type: Sequelize.DATE
            },
            UTCDateUpdated: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Roles');
    }
};