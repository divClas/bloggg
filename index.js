import express, { response } from "express";
import jwt from "jsonwebtoken";
import mongosee from "mongoose";

mongosee
  .connect(
    "mongodb+srv://admin:wwwwww@cluster0.quuoow3.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB ERR", err));

const app = express();

app.use(express.json());

app.post("/auth/register", (req, res) => {
console.log("sadasds git")
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("serv ok");
});
