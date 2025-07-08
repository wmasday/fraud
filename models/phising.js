'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class phising extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  phising.init({
    url_phising: DataTypes.STRING,
    file_html: DataTypes.STRING,
    report_count: DataTypes.INTEGER,
    llm_report: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'phising',
    tableName: 'phisings',
    timestamps: true
  });
  return phising;
};