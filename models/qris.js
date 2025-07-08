'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class qris extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  qris.init({
    store: DataTypes.STRING,
    city: DataTypes.STRING,
    zip_code: DataTypes.INTEGER,
    file_qr: DataTypes.STRING,
    report_count: DataTypes.INTEGER,
    llm_report: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'qris',
  });
  return qris;
};