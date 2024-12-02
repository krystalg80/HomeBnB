'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots'; 
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '456 Silicon Valley Blvd',
        city: 'Mountain View',
        state: 'California',
        country: 'United States of America',
        lat: 37.419200,
        lng: -122.057400,
        name: 'Modern Silicon Valley Apartment',
        description: 'Stylish one-bedroom apartment in the heart of Silicon Valley. Perfect for tech professionals and travelers visiting the Bay Area.',
        price: 200,
        avgRating: 4.8,
        previewImage: 'https://rentpath-res.cloudinary.com/$img_current/t_3x2_webp_lg/65ea5991fd9869a22e0f1536af1282da',
        SpotImages: [
          {url: 'https://rentpath-res.cloudinary.com/$img_current/t_3x2_webp_lg/65ea5991fd9869a22e0f1536af1282da'},
        ]
      },
      {
        ownerId: 2,
        address: '789 Elm Street',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States of America',
        lat: 34.052235,
        lng: -118.243683,
        name: 'Charming Hollywood Loft',
        description: 'Cozy loft in the vibrant heart of Hollywood. Walking distance to famous landmarks like the Walk of Fame and the Hollywood Sign.',
        price: 150,
        avgRating: 4.7,
        previewImage: 'https://media.knockrentals.com/knock/community/1828/f4fe11b3eacab4799dc09efd19f71932.jpg',
        SpotImages: [
          {url: 'https://media.knockrentals.com/knock/community/1828/f4fe11b3eacab4799dc09efd19f71932.jpg'},
        ]
      },
      {
        ownerId: 3,
        address: '101 Tech Way',
        city: 'Austin',
        state: 'Texas',
        country: 'United States of America',
        lat: 30.267153,
        lng: -97.7430608,
        name: 'Contemporary Austin Loft',
        description: 'Bright, airy loft located in downtown Austin, ideal for exploring the city’s lively cultural scene, including live music, restaurants, and festivals.',
        price: 180,
        avgRating: 4.6,
        previewImage: 'https://www.urbanspacerealtors.com/wp-content/uploads/2018/05/brazoslofts-4-1024x576.jpg',
        SpotImages: [
          {url: 'https://www.urbanspacerealtors.com/wp-content/uploads/2018/05/brazoslofts-4-1024x576.jpg'},
        ]
      },
      {
        ownerId: 4,
        address: '321 Apple Park Drive',
        city: 'Cupertino',
        state: 'California',
        country: 'United States of America',
        lat: 37.334922,
        lng: -122.009033,
        name: 'Luxury Cupertino Retreat',
        description: 'A stunning, modern house in Cupertino, perfect for families or business travelers. Close to Apple Park and other tech hubs.',
        price: 250,
        avgRating: 4.9,
        previewImage: 'https://images.squarespace-cdn.com/content/v1/647492104073c862ac184723/9f8c5e84-943b-4d61-9430-7c21a89f28a7/eichler-home-cupertino.jpg',
        spotImages: [
          {url: 'https://images.squarespace-cdn.com/content/v1/647492104073c862ac184723/9f8c5e84-943b-4d61-9430-7c21a89f28a7/eichler-home-cupertino.jpg'},
        ]
      },
      {
        ownerId: 5,
        address: '123 Disney Lane',
        city: 'San Francisco',
        state: 'California',
        country: 'United States of America',
        lat: 37.7645358,
        lng: -122.4730327,
        name: 'Cozy San Francisco Apartment',
        description: 'Bright and inviting apartment in a prime San Francisco location, just a short ride from Fisherman’s Wharf, Golden Gate Park, and more.',
        price: 123,
        avgRating: 4.5,
        previewImage: 'https://images1.apartments.com/i2/gxfCQMjEkd-zliiVOWVosUcJgZ1FF42CSKCl-8RihZE/117/image.jpg',
        SpotImages: [
          {url: 'https://images1.apartments.com/i2/gxfCQMjEkd-zliiVOWVosUcJgZ1FF42CSKCl-8RihZE/117/image.jpg'},
        ]
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    const options = { tableName: 'Spots' };
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { 
        [Op.in]: [
          'Modern Silicon Valley Apartment',
          'Charming Hollywood Loft',
          'Contemporary Austin Loft',
          'Luxury Cupertino Retreat',
          'Cozy San Francisco Apartment'
        ]
      }
    }, {});
  }
};
