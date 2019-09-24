const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/user");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const users = await User.find().sort({ _id: -1 });
  res.send(users);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const user = new User(req.body);
  console.log(user.password);
  user.password = await encryptPassword(user.password);
  res.send(await user.save());
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Invalid user!");
  }
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.send(await user.save());
});

router.delete("/:id", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Invalid user!");
  }
  const user = await User.findByIdAndRemove(req.params.id);
  res.send(user);
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Invalid user!");
  }
  const user = await User.findById(req.params.id);
  res.send(user);
});

// Encrypt password
async function encryptPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

module.exports = router;
