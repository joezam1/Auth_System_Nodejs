'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Sections', {

            SectionId: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4
            },
            SectionIndex: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                unique: true
            },
            Name:{
                type:Sequelize.STRING,
                allowNull:false,
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
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Sections');
    }
};