const mongoose=require("mongoose");

const userschema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        required:true,
    }
},{timestamps:true});

const Users=mongoose.model("user",userschema);

module.exports=Users;