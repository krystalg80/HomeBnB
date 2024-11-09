'use strict';

const { ReviewImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: 'https://example.com/images/spot1.jpg'
      },
      {
        reviewId: 2,
        url: 'https://example.com/images/spot2.jpg'
      },
      {
        reviewId: 3,
        url: 'https://example.com/images/spot3.jpg'
      },
      {
        reviewId: 4,
        url: 'https://example.com/images/spot4.jpg'
      },
      {
        reviewId: 5,
        url: 'https://example.com/images/spot5.jpg'
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    await queryInterface.bulkDelete(options);
  }
};
