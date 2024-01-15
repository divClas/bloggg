import express, { response } from "express";

import mongosee from "mongoose";
import {
  registerValidator,
  loginValidator,
  postCreateValidation,
} from "./validations/validation.js";

import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/userController.js";
import * as PostController from "./controllers/postController.js";
mongosee
  .connect(
    "mongodb+srv://admin:wwwwww@cluster0.quuoow3.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB ERR", err));

const app = express();

app.use(express.json());
//роуты на авторизацию
//авторизация
app.post("/auth/login", loginValidator, UserController.login);
//регистрация юзера
app.post("/auth/register", registerValidator, UserController.register);
//полчеение данных юзера
app.get("/auth/me", checkAuth, UserController.getMe);

//роуты на новости CRUD
// получить все новости
app.get("/posts", PostController.getAll);
// получить одну новость
app.get("/posts/:id", PostController.getOne);
// создать новость
app.post("/posts", checkAuth, postCreateValidation, PostController.create);
// удалить новость
app.delete("/posts/:id", checkAuth, PostController.remove);
// обновить новость
app.patch("/posts/:id", PostController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("serv ok");
});
