'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://example.com/images/spot1-image1.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://example.com/images/spot2-image1.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://example.com/images/spot3-image1.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://example.com/images/spot4-image1.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://example.com/images/spot5-image1.jpg',
        preview: true
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    await queryInterface.bulkDelete(options);
  }
};
