const Joi = require("Joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 4,
    maxlength: 1024
  }
});

// generate json web tokens
userSchema.methods.getAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
  return token;
};

// model
const User = mongoose.model("User", userSchema);

// validation
function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(255)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
