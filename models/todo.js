const mongoose=require("mongoose");

const todoSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    dueDate:{
        type:Date,
    },
    email:{
        type:String,
        required:true,
    },
    status: {
        type: String,
        enum: ['completed', 'missed', 'incomplete'],
        default: 'incomplete', // Default value set to 'incomplete'
    },
});

const ToDo=mongoose.model("todo",todoSchema);

module.exports=ToDo;