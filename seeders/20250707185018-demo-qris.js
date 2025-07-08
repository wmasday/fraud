'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('qris', [
      {
        store: 'Toko Azra',
        city: 'Jakarta',
        zip_code: 12345,
        file_qr: 'azra_qr.png',
        report_count: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        store: 'Dicka Mart',
        city: 'Bandung',
        zip_code: 67890,
        file_qr: 'dicka_qr.png',
        report_count: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('qris', null, {});
  },
};
