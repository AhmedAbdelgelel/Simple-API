const Joi = require("joi");

exports.signupSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(16)
    .required()
    .email({
      tlds: { allow: ["com", "net"] },
    }),

  password: Joi.string()
    .required()
    .min(8)
    .pattern(
      new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ),
});

exports.loginSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(16)
    .required()
    .email({
      tlds: { allow: ["com", "net"] },
    }),

  password: Joi.string()
    .required()
    .min(8)
    .pattern(
      new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ),
});

exports.changePasswordSchema = Joi.object({
  newPassword: Joi.string()
    .required()
    .pattern(
      new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ),
  oldPassword: Joi.string()
    .required()
    .pattern(
      new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ),
});

exports.createPostSchema = Joi.object({
  title: Joi.string().min(3).max(60).required(),
  description: Joi.string().min(3).max(600).required(),
  userId: Joi.string().required(),
});
