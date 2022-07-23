'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('AuthRoleSections', {

            AuthRoleSectionId: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
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
            SectionId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Sections',
                    key: 'SectionId'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            IsActive:{
                type:Sequelize.BOOLEAN,
                allowNull:false,
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
        await queryInterface.dropTable('AuthRoleSections');
    }
};