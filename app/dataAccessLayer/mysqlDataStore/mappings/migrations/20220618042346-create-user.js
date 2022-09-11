'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            UserId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false
            },
            UserIndex: {
                type: Sequelize.INTEGER,
                autoIncrement:true,
                primaryKey: false,
                unique: true,
                allowNull: false
            },
            FirstName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            MiddleName: {
                type: Sequelize.STRING,
                allowNull: true
            },
            LastName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            Username: {
                type: Sequelize.STRING,
                allowNull: false
            },
            Email: {
                type: Sequelize.STRING,
                allowNull: false
            },
            Password: {
                type: Sequelize.TEXT,
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
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users');
    }
};