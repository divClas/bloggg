import { body } from "express-validator";

export const registerValidator = [
  body("email", "неверный формат почты ").isEmail(),
  body("password", "пароль должен быть минимум 5 символов").isLength({ min: 5 }),
  body("fullName", "Укажите имя ").isLength({ min: 3 }),
  body("avatarUrl", " неверная ссылка на фото ").optional().isURL(),
];
