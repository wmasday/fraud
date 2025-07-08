'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('virtual_numbers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      number: {
        type: Sequelize.STRING
      },
      operator: {
        type: Sequelize.STRING
      },
      whatsapp: {
        type: Sequelize.BOOLEAN
      },
      ovo: {
        type: Sequelize.BOOLEAN
      },
      gopay: {
        type: Sequelize.BOOLEAN
      },
      dana: {
        type: Sequelize.BOOLEAN
      },
      linkaja: {
        type: Sequelize.BOOLEAN
      },
      isaku: {
        type: Sequelize.BOOLEAN
      },
      shopeepay: {
        type: Sequelize.BOOLEAN
      },
      report_count: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('virtual_numbers');
  }
};