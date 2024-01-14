import express, { response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongosee from "mongoose";
import { registerValidator } from "./validations/auth.js";
import { validationResult } from "express-validator";
import UserModel from "./models/user.js";
import checkAuth from "./utils/checkAuth.js";

mongosee
  .connect(
    "mongodb+srv://admin:wwwwww@cluster0.quuoow3.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB ERR", err));

const app = express();

app.use(express.json());

//авторизация
app.post("/auth/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "неверный логин или пароль",
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );
    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...user._doc,
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: "не удалось авторизоваться  ",
    });
  }
});
//регистрация юзера
app.post("/auth/register", registerValidator, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.starus(400).json(errors.array());
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });
    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );
    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...user._doc,
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: "не удалось зарегистрироваться ",
    });
  }
});

app.get("/auth/me", checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }
    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "нет доступа",
    });
  }
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("serv ok");
});
