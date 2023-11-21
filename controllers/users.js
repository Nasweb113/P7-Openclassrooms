// Import necessary libraries and modules
const jwt = require("jsonwebtoken");
const { prisma } = require("../db/db.js");
const bcrypt = require("bcrypt");

// Function to handle user login
async function logUser(req, res) {
  // Extract email and password from the request body
  const { email, password } = req.body;
  try {
    // Retrieve user from the database based on the provided email
    const user = await getUser(email);
    
    // If user is not found, return a 404 error
    if (user == null) res.status(404).send({ error: "Sorry, user not found" });

    // Check if the provided password matches the stored hashed password
    const isPasswordCorrect = await checkPassword(user, password);

    // If the password is incorrect, return a 401 error
    if (!isPasswordCorrect)
      return res.status(401).send({ error: "Invalid password" });

    // Generate a JWT token for the user
    const token = makeToken(email);

    // Send the token, user email, and a success message in the response
    res.send({
      token: token,
      email: user.email,
      message: "User is now logged in. Nice one!",
    });
  } catch (error) {
    // If an error occurs during the process, return a 500 error
    res.status(500).send({ error });
  }
}

// Function to generate a JWT token based on the user's email
function makeToken(email) {
  return jwt.sign({ email }, process.env.SECRET, { expiresIn: "24h" });
}

// Function to retrieve a user from the database based on the email
function getUser(email) {
  return prisma.user.findUnique({ where: { email } });
}

// Function to check if the provided password matches the stored hashed password
function checkPassword(user, password) {
  return bcrypt.compare(password, user.password);
}

// Function to handle user signup
async function signupUser(req, res) {
  // Extract email, password, and confirmPassword from the request body
  const { email, password, confirmPassword } = req.body;
  try {
    // Check if the password and confirmPassword match
    if (confirmPassword == null)
    return res.status(400).send({error:"Please confirm password"});
    if (password !== confirmPassword)
      return res.status(400).send({ error: "Password does not match" });

    // Check if the user already exists in the database
    const userInDb = await getUser(email);
    if (userInDb != null)
      return res.status(400).send({ error: "User already exists in the database" });

    // Hash the password before saving it in the database
    const hash = await hashPassword(password);

    // Save the user with the hashed password in the database
    const user = await saveUser({ email, password: hash });

    // Send the user data in the response
    res.send({ user });
  } catch (error) {
    // If an error occurs during the process, return a 500 error
    res.status(500).send({ error });
  }
}

// Function to save a user in the database
function saveUser(user) {
  return prisma.user.create({ data: user });
}

// Function to hash a password using bcrypt
function hashPassword(password) {
  const NUMBER_OF_SALT_ROUNDS = 10;
  return bcrypt.hash(password, NUMBER_OF_SALT_ROUNDS);
}

// Export the login and signup functions for external use
module.exports = { logUser, signupUser };

/*const jwt = require ("jsonwebtoken")
const { prisma } = require("../db/db.js")
const bcrypt = require("bcrypt")


async function logUser(req, res) {
  const {email, password} = req.body
  try {
  const user = await getUser(email)
  if (user == null) res.status(404).send({error:"Sorry user not found"})
  
const isPasswordCorrect =
  await checkPassword(user,password)
  
    if (!isPasswordCorrect)
      return res.status(401).send({error:"Invalid Password"})
    const token = makeToken(email)
    
    res.send({ token: token, email: user.email, message: "user is now logged in, nice one!"})
  
  }
  catch(error){ 
     res.status(500).send({error})
  }
}


function makeToken(email) {
  return jwt.sign({email}, process.env.SECRET, {expiresIn: "24h"})
}


function getUser(email){
 return prisma.user.findUnique({ where: {email}})
}

function checkPassword(user, password){
  return bcrypt.compare(password, user.password)
}



async function signupUser(req, res) {
  const {email, password, confirmPassword} = req.body
  try {
  if (password !== confirmPassword) return res.status(400).send ({error: "password does not match"})

  const userInDb = await getUser(email)
  if (userInDb != null) return res.status(400).send({error: "User already exists in database"})
  
  
  const hash = await hashPassword(password)
  const user = await saveUser({email, password:hash})
  res.send({user}) 
  }
  catch(error) {
  res.status(500).send({error})
  }
}

function saveUser(user) {
  
  return prisma.user.create({ data: user})
}

function hashPassword(password) {
  const NUMBER_OF_SALT_ROUNDS = 10
  return bcrypt.hash(password,NUMBER_OF_SALT_ROUNDS )

}
module.exports = { logUser, signupUser}*/