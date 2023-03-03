const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors")
require('dotenv').config();
require("./config/db");
const multer = require("multer")


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(function (request, response, next) {

  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  response.header("Access-Control-Allow-Credentials", true);
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, x-csrf-token, Accept, Authorization"
  );
  next();
});




// require router 
const auth = require("./router/auth");


const { response } = require("express");
app.use('/static', express.static(path.join(__dirname, 'public')))


const { request } = require("http");
const user = require("./router/user");
const admin = require("./router/admin");
const cart = require("./router/cart");
const brand = require("./router/brand");
const category = require("./router/category");
const product = require("./router/product");
const order = require("./router/order");

// use router
app.use("/auth",auth);
app.use("/user",user);
app.use("/admin",admin);
app.use("/cart",cart);
app.use("/brand",brand);
app.use("/category",category);
app.use("/product",product);
app.use("/order",order);


app.use(express.static(__dirname + '/public'));

app.get("/",async(request,response)=>{
  console.log("start");
  response.render("index.ejs");
})




// catch 404 and forward to error handler
app.use(function (req, res, next) {
 
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

 

  




app.listen(process.env.PORT, async()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})