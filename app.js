const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const AppError = require("./src/utils/appError");
const globalErrorHandler = require("./src/controllers/errorController");
const ProductRouter = require("./src/routers/ProductRoutes");
const CategoryRouter = require("./src/routers/CategoryRoutes");
const userRouter = require("./src/routers/userRoutes");
const cartRouter = require("./src/routers/cardRoutes");
const HomeCategoryRouter = require("./src/routers/HomeCategoryRoutes");
const BrandRouter = require("./src/routers/BrandRoutes");
const DealRouter = require("./src/routers/dealRoutes"); 
const OfferRouter = require("./src/routers/OfferRoutes");

const app = express();
app.use(cookieParser());
app.use(express.json());

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "https://allmart7.netlify.app", "https://genuine-sawine-75c421.netlify.app"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/product", ProductRouter);
app.use("/api/v1/categories", CategoryRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/homeCategory", HomeCategoryRouter);
app.use("/api/v1/brand", BrandRouter);
app.use("/api/v1/deal", DealRouter);
app.use("/api/v1/offer", OfferRouter);


app.get("/", (req, res) => {
  res.send("API is running...");
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
