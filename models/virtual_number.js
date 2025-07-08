'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class virtual_number extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  virtual_number.init({
    number: DataTypes.STRING,
    operator: DataTypes.STRING,
    whatsapp: DataTypes.BOOLEAN,
    ovo: DataTypes.BOOLEAN,
    gopay: DataTypes.BOOLEAN,
    dana: DataTypes.BOOLEAN,
    linkaja: DataTypes.BOOLEAN,
    isaku: DataTypes.BOOLEAN,
    shopeepay: DataTypes.BOOLEAN,
    report_count: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'virtual_number',
  });
  return virtual_number;
};