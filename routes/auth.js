const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("config");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Invalid user or password!");
  }
  const password = await bcrypt.compare(req.body.password, user.password);
  if (!password) {
    return res.status(400).send("Invalid user or password!");
  }
  res.send(
    genToken({
      _id: user._id,
      email: user.email
    })
  );
});

function validate(user) {
  const schema = {
    email: Joi.string()
      .email()
      .min(6)
      .max(255),
    password: Joi.string()
      .min(6)
      .max(255)
  };
  return Joi.validate(user, schema);
}

function genToken(params = {}) {
  return jwt.sign(params, config.get("jwtKey"));
}
module.exports = router;
