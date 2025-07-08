'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class application extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  application.init({
    file_identification: DataTypes.STRING,
    file_name: DataTypes.STRING,
    report_count: DataTypes.INTEGER,
    llm_report: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'application',
    tableName: 'applications',
    timestamps: true
  });
  return application;
};