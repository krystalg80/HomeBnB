'use strict';
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        key: 'id',
        model: 'Users',
      },
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        key: 'id',
        model: 'Spots',
      },
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      },
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5         //must be a rating 1-5, or could it be below 1? change to 0 if needed
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'Reviews',
    timestamps: true,
  });

//connections is this correct? based off of our diagram
  Review.associate = function(models) {
    // One Review belongs to a User
    Review.belongsTo(models.User, { foreignKey: 'userId' });

    // One Review belongs to a Spot
    Review.belongsTo(models.Spot, { foreignKey: 'spotId' });

    // One Review can have many ReviewImages
    Review.hasMany(models.ReviewImage, { foreignKey: 'reviewId', onDelete: 'CASCADE' });
  };

  return Review;
};
