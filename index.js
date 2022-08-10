const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/db");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const { errorHandler } = require("./middleware/error");

const app = express();
app.use(cors());
connectDB();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  app._router.stack.forEach(function(r){
    if (r.route && r.route.path){
      console.log(r.route.path)
    }
  });
});

app.get("/", (req, res) => {
  res.send("App is running.");
});

// express.json & urlencoded is for Reading the body..
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/uploads", express.static("./uploads"));

// The routes
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

// Override the default Error handler for express
app.use(errorHandler);
