'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Registers', {
            RegisterId: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4
            },
            RegisterIndex: {
                type: Sequelize.INTEGER,
                unique:true,
                allowNull: false,
                autoIncrement: true
            },
            UserId:{
                type:Sequelize.UUID,
                allowNull:false,
                references:{
                    model:'Users',
                    key:'UserId'
                },
                onDelete:'CASCADE',
                onUpdate:'CASCADE'
            },
            IsActive:{
                type:Sequelize.BOOLEAN,
                allowNull:false
            },
            UTCDateCreated: {
                type: Sequelize.DATE,
                allowNull: false

            },
            UTCDateClosed: {
                type: Sequelize.DATE,
                allowNull: true
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Registers');
    }
};