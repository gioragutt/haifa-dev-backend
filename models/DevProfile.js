const { DataTypes, Model } = require('sequelize');
const Joi = require('@hapi/joi');
const sequelize = require('../config/sequelize');
const Social = require('./Social');
const { removeImg } = require('../utils/fileSystem');

class DevProfile extends Model {
  static intensifiedValidation(devProfile) {
    return Joi.object({
      id: Joi.string().uuid(),
      name: Joi.string()
        .required()
        .min(1)
        .max(255),
      image: Joi.string().required(),
      bio: Joi.string().required(),
      email: Joi.string()
        .required()
        .email()
        .min(3)
        .max(255),
      socials: Social.intensifiedValidation()
    }).validate(devProfile);
  }
}

DevProfile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'unknown',
      validate: { len: [1, 255], notEmpty: true, notNull: true }
    },
    image: { type: DataTypes.STRING },
    bio: { type: DataTypes.TEXT },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
        notNull: true,
        notEmpty: true,
        len: [3, 255]
      }
    }
  },
  {
    sequelize,
    hooks: {
      beforeUpdate: async devProfile => {
        if (devProfile.getDataValue('image')) await removeImg(devProfile.previous('image'));
      },
      beforeDestroy: async devProfile => {
        await removeImg(devProfile.previous('image'));
      }
    }
  }
);

const associationParams = {
  as: 'socials',
  foreignKey: { name: 'devProfileId' },
  onDelete: 'CASCADE'
};

DevProfile.hasMany(Social, associationParams);
Social.belongsTo(DevProfile, associationParams);

module.exports = DevProfile;
