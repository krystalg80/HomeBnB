'use strict';

const { sequelize } = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING(30),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 30]
        }
      },
      lastName: {
        type: Sequelize.STRING(30),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 30]
        }
      },
      username: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [4, 30] //Not sure what length to set it, but maybe username has to be atleast 5 characters?
        }
      },
      email: {
        type: Sequelize.STRING(256),
        allowNull: false,
        unique: true,
        validate : {
          isEmail: true,    // has to be a valid email format @
          notEmpty: true
        }
      },
      hashedPassword: {
        type: Sequelize.STRING.BINARY,
        allowNull: false,
        validate: {
          notEmpty: true //cannot be emptyyy
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    return queryInterface.dropTable(options);
  }
};