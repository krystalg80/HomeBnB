'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'Lionel',
        lastName: 'Messi',
        email: 'lionel@messi.io',
        username: 'the-goat',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Cristiano',
        lastName: 'Ronaldo',
        email: 'cristiano@ronaldo.io',
        username: 'cr-7',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Diego',
        lastName: 'Maradona',
        email: 'diego@maradona.io',
        username: 'maradona',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Edson',
        lastName: 'Nascimento',
        email: 'edson@nascimento.io',
        username: 'pele',
        hashedPassword: bcrypt.hashSync('password4')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['the-goat', 'cr7', 'maradona', 'pele'] }
    }, {});
  }
};
