const { DataTypes, Model } = require('sequelize');
const Joi = require('@hapi/joi');
const sequelize = require('../config/sequelize');

class Tag extends Model {
  static intensifiedValidation() {
    return Joi.array().items(
      Joi.object({
        title: Joi.string()
          .min(1)
          .max(255)
          .required()
      })
    );
  }
}

Tag.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 255], notEmpty: true, notNull: true }
    }
  },
  {
    sequelize,
    modelName: 'tag'
  }
);

module.exports = Tag;
