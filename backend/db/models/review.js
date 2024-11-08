'use strict';

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // define association here
    }
  }
  Review.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      review: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 250],
        },
      },
      stars: {
        type: DataTypes.INTEGER,
        validate: {
          isNumeric: true,
          min: 1,
          max: 5
        },
      },
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};  