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
        url: 'https://rentpath-res.cloudinary.com/$img_current/t_3x2_webp_lg/65ea5991fd9869a22e0f1536af1282da',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://media.knockrentals.com/knock/community/1828/f4fe11b3eacab4799dc09efd19f71932.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://www.urbanspacerealtors.com/wp-content/uploads/2018/05/brazoslofts-4-1024x576.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://images.squarespace-cdn.com/content/v1/647492104073c862ac184723/9f8c5e84-943b-4d61-9430-7c21a89f28a7/eichler-home-cupertino.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://images1.apartments.com/i2/gxfCQMjEkd-zliiVOWVosUcJgZ1FF42CSKCl-8RihZE/117/image.jpg',
        preview: true
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    await queryInterface.bulkDelete(options);
  }
};
