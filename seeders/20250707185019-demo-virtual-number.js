'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('virtual_numbers', [
      {
        number: '081234567890',
        operator: 'Telkomsel',
        whatsapp: true,
        ovo: true,
        gopay: false,
        dana: true,
        linkaja: false,
        isaku: false,
        shopeepay: true,
        report_count: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        number: '089876543210',
        operator: 'Indosat',
        whatsapp: false,
        ovo: false,
        gopay: true,
        dana: false,
        linkaja: true,
        isaku: true,
        shopeepay: false,
        report_count: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('virtual_numbers', null, {});
  }
};
