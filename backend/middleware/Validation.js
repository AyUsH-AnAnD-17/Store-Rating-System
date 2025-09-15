const Joi = require('joi');

const passwordSchema = Joi.string()
  .min(8)
  .max(16)
  .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?])'))
  .required()
  .messages({
    'string.pattern.base': 'Password must contain at least one uppercase letter and one special character',
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password must not exceed 16 characters'
  });

const userRegistrationSchema = Joi.object({
  name: Joi.string().min(20).max(60).required(),
  email: Joi.string().email().required(),
  address: Joi.string().max(400).required(),
  password: passwordSchema
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const storeSchema = Joi.object({
  name: Joi.string().min(20).max(60).required(),
  email: Joi.string().email().required(),
  address: Joi.string().max(400).required()
});

const ratingSchema = Joi.object({
  storeId: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(500).optional()
});

const passwordUpdateSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: passwordSchema
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

module.exports = {
  validate,
  userRegistrationSchema,
  userLoginSchema,
  storeSchema,
  ratingSchema,
  passwordUpdateSchema
};