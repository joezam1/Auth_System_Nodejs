'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.changeColumn('Registers','UTCDateClosed',{
      type: Sequelize.DATE,
      allowNull: true
    })
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
