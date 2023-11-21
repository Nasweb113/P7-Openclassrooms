
const express = require("express")
const { getPosts, createPost, createComment, deletePost } = require("../controllers/posts")
const { checkToken } = require("../middleware/token.js")
const postRouter = express.Router()
const { imageUpload } = require("../middleware/image")

postRouter.use(checkToken)
postRouter.post("/:id", createComment)
postRouter.delete("/:id", deletePost)
postRouter.get("/", getPosts)
postRouter.post("/", imageUpload, createPost)




module.exports = { postRouter }