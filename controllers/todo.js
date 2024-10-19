const ToDo=require("../models/todo");


//for creating
async function createToDo(req,res) {
    const {title,description,dueDate}=req.body;
    const email=req.user.email;
    //basic authorization
try{
    const dueDateTime=new Date(dueDate);
    await ToDo.create({
        title,
        description,
        email,
        dueDate: dueDateTime,
    });
    res.redirect("/home");
}catch(error){
    console.error("error crating in todo",error);
    res.status(500).send('Internal server error');
}
}
//for updating
async function updateToDo(req,res) {
    const todoId=req.params.id;
    const action = req.body.action;
try{
    const updateData = {};
    const currentTodo = await ToDo.findById(todoId);
    if (!currentTodo) {
        return res.status(404).send("Item not found");
    }
    const currentTime = new Date(); // Get the current time
        const dueDate = new Date(currentTodo.dueDate); // Ensure the dueDate is a Date object

        // Update status based on action or current time
        if (currentTime >dueDate) {
            // If the current time is greater than the due date, mark as missed
            updateData.status = 'missed';
        } else {
            // Cycle through statuses based on the action
            if (action === "update") {
                updateData.status = currentTodo.status === 'incomplete' ? 'completed' : 'incomplete';
            }
        }
        await ToDo.findByIdAndUpdate(todoId, updateData, { new: true });
        res.redirect("/home");
}catch(error){
    console.error("error in update todo",error);
    res.status(500).send("internal server error")
}
}

//for deleting
async function deleteToDo(req,res) {
    const todoId=req.params.id;
try{
    const deleteTodo=await ToDo.findOneAndDelete({_id:todoId});
    if(deleteTodo){
        res.redirect("/home");
    }else{
        res.status(404).send("item not found to delete")
    }
}catch(error){
    console.error(error);
    res.status(500).send('Internal server error');
}   
}

async function getToDo(req, res) {
    
    const email = req.user.email; // Use the email from the authenticated user
    try {
        const todos = await ToDo.find({ email: email });
        const currentTime = new Date();
        for (const todo of todos) {
            if (currentTime > new Date(todo.dueDate) && todo.status !== 'completed') {
                todo.status = 'missed';
                await todo.save(); // Save the updated status
            }
        }
        res.render('home', { todos: todos, users: req.user }); // Pass user details
    } catch (error) {
        console.error("Error fetching to-do items:", error);
        res.status(500).send("Internal server error");
    }
}



module.exports={
    createToDo,
    updateToDo,
    deleteToDo,
    getToDo,
}