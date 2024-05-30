const express = require("express");
const bcrypt = require("bcrypt");
const authRouter = express.Router();

const jwt = require("jsonwebtoken");
const Users = require("../model/user");

authRouter.post("/login", async(req, res) => {
  console.log(req.body);

  const user = req.body;

  //checking DB for the user

  try {
const prevUser = await Users.findOne({email: user.email});
console.log(prevUser);


//return error if no user with the email is in the DB

if(!prevUser){

  res
  .status(401)
  .send({error: true, message: "email or password incorrect"});

  return;
}

//checking if the password is correct
var isPasswordValid = bcrypt.compareSync(user.password, prevUser.password);
console.log(isPasswordValid);

//return error if provided password is wrong
if (!isPasswordValid) {
  res
  .status(401)
  .send({error: true, message: "email or password incorrect"});

  return;

}

//signing token

var token = jwt.sign(
{id: prevUser._id, email: prevUser.email},
process.env.JWT_SECRET,
{expiresIn: process.env.JWT_SECRET_EXPIRES}

);

res.send({
message: "user logged in successfully",
user: {
  id: prevUser._id,
  email: prevUser.email,
  firstname: prevUser.firstname,
  lastname: prevUser.lastname,
},

token: {
  accessToken:token,
  expiresIn:process.env.JWT_SECRET_EXPIRES,
},
});
  } catch (error){
  res.status(500).send({error:true, message: "Internal Server error"});
  }
});

authRouter.post("/register", async (req, res) => {
  const user = req.body;

  //check if a user with the email already exist

  try {
    const prevUser = await Users.findOne({ email: user.email });

    if (prevUser) {
      res.status(400).send({ error: true, message: "user already registered" });
    }

    //replace plaintext password with hashed password
    user.password = await bcrypt.hash(user.password, 10);

    const newUser = new Users(user);

    const response = await newUser.save();
    if (response) {
      res.status(201).send({ message: "user registered successfully" });
    }
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
});

module.exports = authRouter;