'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {

        await queryInterface.createTable('UserRoles', {

            UserRoleId: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4
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
            RoleId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Roles',
                    key: 'RoleId'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
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

        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
    }
};
