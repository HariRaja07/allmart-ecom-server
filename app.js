const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const AppError = require("./src/utils/appError");
const globalErrorHandler = require("./src/controllers/errorController");

const app = express();
app.use(cookieParser());
app.use(express.json());

const allowedOrigins = ["http://localhost:517344"];
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);


app.get("/", (req, res) => {
    res.send("API is running...");
});

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
