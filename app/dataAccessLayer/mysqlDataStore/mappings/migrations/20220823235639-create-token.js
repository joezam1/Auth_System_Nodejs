'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Tokens', {
            TokenId: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            UserId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'UserId'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'

            },
            Token: {
                type: Sequelize.TEXT,
                allowNull: false          },
            Type: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            Payload: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            IsActive: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            },
            UTCDateCreated: {
                type: Sequelize.DATE,
                allowNull: false
            },
            UTCDateExpired: {
                type: Sequelize.DATE,
                allowNull: true
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Tokens');
    }
};