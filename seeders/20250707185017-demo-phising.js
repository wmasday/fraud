'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('phisings', [
      {
        url_phising: 'http://fakebank.com',
        file_html: 'fakebank.html',
        report_count: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url_phising: 'http://phishingsite.com',
        file_html: 'phishingsite.html',
        report_count: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('phising', null, {});
  }
};
