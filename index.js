require ("dotenv").config()
const express = require("express")
const port = process.env.PORT || 3002
const app = express()
const bodyParser = require ("body-parser")
const { logUser, signupUser } = require("./controllers/users.js")
const cors = require("cors")

const { postRouter } = require("../back/routes/posts.js")
app.use(cors())
app.use(bodyParser.json())

const {prisma} = require("./db/db.js")



//view all users
prisma.post.findMany().then(console.log).catch(console.log)

app.use("/posts", postRouter)
app.use("/uploads", express.static('uploads'))

app.post("/auth/login", logUser)
app.post("/auth/signup", signupUser)


app.listen(port, ()=> console.log(`listening on port ${port}`))

