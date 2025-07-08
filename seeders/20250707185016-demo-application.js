'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('applications', [
      {
        file_identification: 'file-001',
        file_name: 'document1.pdf',
        report_count: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        file_identification: 'file-002',
        file_name: 'document2.pdf',
        report_count: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('applications', null, {});
  }
};
