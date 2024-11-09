'use strict';

const { Review } = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        userId: 1,
        spotId: 1,
        review: "Amazing place! Had a great time, would definitely come back.",
        stars: 5
      },
      {
        userId: 2,
        spotId: 2,
        review: "The location was perfect, but the place could use some improvements.",
        stars: 3
      },
      {
        userId: 3,
        spotId: 3,
        review: "Lovely spot, very cozy. Enjoyed my stay!",
        stars: 4
      },
      {
        userId: 4,
        spotId: 4,
        review: "Not as expected. The room was smaller than advertised, and the AC was broken.",
        stars: 2
      },
      {
        userId: 5,
        spotId: 5,
        review: "The best place I’ve stayed in! Beautiful views and amazing service.",
        stars: 5
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Reviews";
    await queryInterface.bulkDelete(options);
  }
};
