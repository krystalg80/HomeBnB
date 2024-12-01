'use strict';

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // define association here
      Review.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      }); 
      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE'
      });
      Review.hasMany(models.ReviewImage, {
        foreignKey: "reviewId",
        onDelete: "CASCADE"
      });
      
    }
  }
  Review.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        }
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Spots",
          key: "id"
        }
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
      tableName: "Reviews",
    }
  );
  return Review;
};  