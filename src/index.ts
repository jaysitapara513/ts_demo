import express, { Application } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
const app: Application = express();
const jsonParser = bodyParser.json();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/images", express.static(path.join(__dirname, "public/images")));

// database connection
mongoose
  .connect("mongodb://127.0.0.1:27017/task2")
  .then(() => {
    console.log("database connected");
  })
  .catch((error) => {
    console.log(error);
  });

// routes
import register from "./routes/register";
import login from "./routes/login";
import category from "./routes/category";
import product from "./routes/product";
import fileUpload from "./routes/fileUpload";
import categoryList from "./routes/categoryList";
import pagination from "./routes/pagination";

// middleware
import errorMiddleware from "./middleware/checkError";
import { verifyToken } from "./middleware/auth";

app.use("/register", jsonParser, register);
app.use("/login", jsonParser, login);
app.use("/update", jsonParser, verifyToken, login);
app.use("/profile", jsonParser, verifyToken, login);
app.use("/category", jsonParser, verifyToken, category);
app.use("/product", jsonParser, verifyToken, product);
app.use("/upload", verifyToken, fileUpload);
app.use("/categoryList", verifyToken, categoryList);
app.use("/pagination", pagination);

app.use(errorMiddleware);
app.use(verifyToken);

// server start
app.listen(3001, (): void => {
  console.log("Server started on port 3000");
});
