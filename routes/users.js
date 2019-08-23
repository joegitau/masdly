const auth = require("../middleware/auth");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const { User, validate } = require("../models/user");

const router = express.Router();

// get current user
router.get("/me", async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.status(200).send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send({ error: "User already exists" });

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  // define json web token
  const token = user.geAuthToken();

  // send the token within the http headers
  res
    .header("x-auth-token", token)
    .status(200)
    .send(_.pick(user, ["_id", "name", "email"]));
});

// router.put("/:id", async (req, res) => {
//   const user = await User.findByIdAndUpdate(
//     req.params.id,
//     { $set: { name, email, password } },
//     { new: true }
//   );
//   if (!user) return res.status(400).send({ error: "Could Not update User" });

//   res.status(200).send(user);
// });

// router.delete("/:id", async (req, res) => {
//   const user = await User.findByIdAndRemove(req.params.id);
//   if (!user) return res.status(400).send({ error: "Could Not Delete User" });
// });

// router.get("/:id", async (req, res) => {
//   const user = await User.findById(req, params.id);
//   if (!user) return res.status(400).send({ error: "Could Not find User" });
// });

module.exports = router;
