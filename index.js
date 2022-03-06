const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const passport = require("passport")
require('./authenticate')
dotenv.config();

mongoose.connect("mongodb://localhost/social", {useNewUrlParser:true, useUnifiedTopology:true},(err)=> {
  if(err)   console.log(err.message);
});

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(passport.initialize());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.listen(8800, () => {
  console.log("Backend server is running!");
});
