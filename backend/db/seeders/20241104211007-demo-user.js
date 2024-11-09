'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'Sarah',
        lastName: 'Smith',
        email: 'sarah.smith@airbnb.com',
        username: 'techmama',
        hashedPassword: bcrypt.hashSync('password123')
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@airbnb.com',
        username: 'hollywood_hero',
        hashedPassword: bcrypt.hashSync('password234')
      },
      {
        firstName: 'Emily',
        lastName: 'Johnson',
        email: 'emily.johnson@airbnb.com',
        username: 'austin_explorer',
        hashedPassword: bcrypt.hashSync('password345')
      },
      {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@airbnb.com',
        username: 'luxury_in_cupertino',
        hashedPassword: bcrypt.hashSync('password456')
      },
      {
        firstName: 'Olivia',
        lastName: 'Williams',
        email: 'olivia.williams@airbnb.com',
        username: 'sf_novice',
        hashedPassword: bcrypt.hashSync('password567')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: [
        'techmama', 
        'hollywood_hero', 
        'austin_explorer', 
        'luxury_in_cupertino', 
        'sf_novice'
      ] }
    }, {});
  }
};
