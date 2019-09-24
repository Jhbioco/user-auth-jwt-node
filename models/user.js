const mongoose = require("mongoose");
const Joi = require("joi");

// Create the schema
const UserSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, required: true },
  email: { type: String, minlength: 6, maxlength: 255, required: true },
  password: { type: String, minlength: 6, maxlength: 255, required: true }
});

// Create the model
const User = mongoose.model("User", UserSchema);

// Field validation with joi
function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required(),
    email: Joi.string()
      .email()
      .min(6)
      .max(255)
      .required(),
    password: Joi.string()
      .min(6)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
}

module.exports = { User, validateUser };
