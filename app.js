const express = require("express");
const { redirect } = require("express/lib/response");
const mongoose = require("mongoose");
const User = require("./user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const db_url = "mongodb://localhost:27017/open_market";

app.post("/login", async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone: phone });
  if (!user) {
    return res.json("user not found");
  }

  const isUser = await bcrypt.compare(password, user.password);
  if (!isUser) {
    return res.json("Phone or password is incorrect");
  }
  const token = jwt.sign({ uid: user._id }, "very_long_secret");
  return res.json({
    token,
    user,
  });
});

app.post("/signup", async (req, res) => {
  const { phone, password, name } = req.body;
  const user = await User.findOne({ phone: phone });
  console.log(user);
  if (user) {
    return res.json("phone is all ready taken");
  }

  const hash = await bcrypt.hash(password, 12);
  const newUser = await User.create({ phone, name, password: hash });
  const token = jwt.sign({ uid: newUser._id }, "very_long_secret");
  return res.json({
    token,
    user: newUser,
  });
});

app.post("/users", async (req, res) => {
  const user = await User.create(req.body);

  return res.json(user);
});

app.get("/users", async function (req, res) {
  const users = await User.find({});
  return res.json(users);
});

app.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  return res.json("User deleted");
});

app.put("/users/:id", async function (req, res) {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );
  return res.json(user);
});

app.listen(5000, function () {
  mongoose.connect(db_url).then(() => {
    console.log("Db connected with success ...");
  });
  console.log("**** Serveur en ecoute sur le port 5000 ****");
});
