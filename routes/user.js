const express=require("express");
const { getsignup, postsignup,getlogin,postlogin,gethome,checkAuth} = require("../controllers/user");
const {createToDo,updateToDo,deleteToDo,getToDo}=require("../controllers/todo");

const router=express.Router();

const jwt = require("jsonwebtoken");
const secretkey = "saireddy"; // Store this in an environment variable in production

function authenticateToken(req, res, next) {
    const token = req.cookies.authtoken; // Assuming you are using cookies for the token
    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, secretkey, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user; // Set the user in the request
        next(); // Proceed to the next middleware/route handler
    });
}
router.get("/",(req,res)=>{
    res.render("index")
});
router.get("/logout",(req,res)=>{
    res.clearCookie("email");
    res.clearCookie("authtoken");
    return res.redirect("/login");
})

router.get("/signup",getsignup);
router.post("/signup",postsignup);

router.get("/login",getlogin);
router.post('/login',postlogin);
router.get("/home",authenticateToken,gethome);

router.post("/home/add", authenticateToken, createToDo);

// Other routes
router.get("/home",authenticateToken, getToDo); // Ensure authentication for fetching todos
router.post("/home/update/:id",authenticateToken, updateToDo); // Ensure authentication for updating todos
router.post("/home/delete/:id",authenticateToken, deleteToDo); // Ensure authentication for deleting todos


// Route for displaying the add to-do form
router.get("/home/add", (req, res) => {
    res.render('addTodo'); // Render your EJS template for adding a to-do
});

module.exports=router;