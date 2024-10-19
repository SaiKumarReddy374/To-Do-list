
const Users=require("../models/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const secretkey="saireddy";
const ToDo=require("../models/todo")
async function getsignup(req,res) {
    return res.render("signup",{message:null})
};

async function postsignup(req,res){
    const {name,email,password,confirmpassword}=req.body;

    // Basic input validation
    if (!name||!email||!password||!confirmpassword) {
        return res.render("signup",{message:"All fields are required."});
    }

    const user=await Users.findOne({
        email:email
    });
    if(user){
        return res.render("signup",{message:"user already exists"})
    }
    if(password!=confirmpassword){
        return res.render("signup",{message:"both password are not same"});
    }
    try{
        //hash the password before saving
        const hashedpassword=await bcrypt.hash(password,10);
    await Users.create({
        name:name,
        email:email,
        password:hashedpassword,
    });
    return res.render("login",{message:"user created please login"})
}catch(error){
    console.log("An error occured",error);
    return res.render("signup",{message:"an error occured"})
}

};


async function getlogin(req,res){
    return res.render("login",{message:null})
};

async function postlogin(req,res) {
    const {email,password}=req.body;
    //basic validation
    if(!email||!password){
        res.render("login",{message:"enter all details"});
    }
try{
    const user =await Users.findOne({
        email:email
    });
    if(!user){
        return res.render("login",{message:"user does nor exist please signup"})
    }
    const ismatch=await bcrypt.compare(password,user.password);
    if (!ismatch) {
        return res.render("login",{message:"incorrect password"});
    }
    // if(user.password!=password){
    //     return res.render("login",{message:"incorrect password"});
    // }
    //creating jwt token
    const token=jwt.sign({
        id:user._id,
        name:user.name,
        email:user.email,
    },secretkey,{expiresIn:3000});
    //set cookie
    res.cookie("authtoken",token,{
        httpOnly:"true",
        secure:"false"
    });
    return res.redirect("/home");
}catch(error){
    console.log("an error occured in login",error);
    return res.render("login",{message:"error in login try again"});
}
};
async function gethome(req,res) {
    const token=req.cookies.authtoken;
    if(!token){
        return res.render("login",{message:"session expired login"})
    }
    try {
        // Use a Promise to handle the JWT verification asynchronously
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, secretkey, (err, decoded) => {
                if (err) {
                    reject(err); // Reject the promise if there's an error
                } else {
                    resolve(decoded); // Resolve the promise with decoded data
                }
            });
        });

        // Fetch the to-do list for the current user using decoded.id
        const todos = await ToDo.find({email: decoded.email }); // Ensure this matches the field in your schema
        res.render("home", { users: decoded, todos: todos }); // Pass todos to the EJS view

    } catch (error) {
        console.error("Error in gethome:", error); // Log any errors
        return res.render("login", { message: "Session expired. error" }); // Redirect to login on error
    }
}



module.exports={
    getsignup,
    postsignup,
    getlogin,
    postlogin,
    gethome,
};