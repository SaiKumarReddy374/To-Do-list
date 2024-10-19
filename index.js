const express=require("express");
const {connectToMongoDB}=require("./mongodb");
const router=require("./routes/user");
const path=require("path");
const cookieparser=require("cookie-parser");
// const methodOverride = require("method-override");
const app=express();
const port=3000;

//connection to database
connectToMongoDB("mongodb://localhost:27017/todolist")
.then(()=>console.log("monndoDB connected succesfully"))
.catch((err)=>console.log("unable to connect to mongoDB",err));

//view engine setup
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

//middleware
app.use(express.urlencoded({extended:false}));
app.use(cookieparser());
// app.use(methodOverride('_method'));
app.use(router);


app.listen(port,()=>{console.log(`the server started at port: ${port}`)});