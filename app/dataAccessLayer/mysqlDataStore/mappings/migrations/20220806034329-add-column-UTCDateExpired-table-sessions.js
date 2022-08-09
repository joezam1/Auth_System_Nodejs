'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('Sessions', 'UTCDateExpired',{
      type: Sequelize.DATE,
      allowNull: true,
      after:'UTCDateCreated'
    });
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
