const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const AppError = require("./src/utils/appError");
const globalErrorHandler = require("./src/controllers/errorController");
const ProductRouter = require("./src/routers/ProductRoutes");
const CategoryRouter = require("./src/routers/CategoryRoutes");
const userRouter = require("./src/routers/userRoutes");
const cartRouter = require("./src/routers/cardRoutes");

const app = express();
app.use(cookieParser());
app.use(express.json());

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", ProductRouter);
app.use("/api/v1/categories", CategoryRouter);
app.use("/api/v1/cart", cartRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
