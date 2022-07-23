'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sessions', {

      SessionId: {
        type: Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        primaryKey:true,
        allowNull:false
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
      SessionToken:{
        type:Sequelize.TEXT,
        allowNull:false
      },
      Expires:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      Data:{
        type:Sequelize.TEXT,
        allowNull:false
      },
      IsActive:{
        type:Sequelize.BOOLEAN,
        allowNull:false
      },
      UTCDateCreated: {
        type: Sequelize.DATE,
        allowNull: false
      },
      UTCDateUpdated: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Sessions');
  }
};