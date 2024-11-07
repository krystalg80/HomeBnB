
const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../../config/database.js'); 


module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, { as: 'Owner', foreignKey: 'ownerId' });
    }
  }
  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lat: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      lng: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      avgRating: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      previewImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    }, 
    {
      sequelize,
      modelName: 'Spot',
      tableName: 'Spots',
    }
  );
  return Spot;
};

// module.exports = Spot;
