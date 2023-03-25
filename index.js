const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors")
require('dotenv').config();
require("./config/db");
const multer = require("multer");
const bodyParser = require("body-parser");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
const user = require("./router/auth");
const book = require("./router/books");
// use router
app.use("/auth",auth);
app.use("/books",book)



app.use(express.static(__dirname + '/public'));

app.get("/",async(request,response)=>{
  console.log("start");
  return response.send("hello world")
  
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