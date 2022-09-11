'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Services', {

            ServiceId: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4
            },
            SectionId: {
                type: Sequelize.UUID,
                allowNull: false,
                references:{
                    model:'Sections',
                    key:'SectionId'
                },
                onDelete:'CASCADE',
                onUpdate:'CASCADE'
            },
            Name: {
                type:Sequelize.STRING,
                allowNull:false
            },
            Description:{
                type:Sequelize.STRING,
                allowNull:false
            },
            IsActive:{
                type:Sequelize.BOOLEAN,
                allowNull:false
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
        await queryInterface.dropTable('Services');
    }
};