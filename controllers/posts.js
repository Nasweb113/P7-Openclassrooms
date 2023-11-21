
const {prisma} = require("../db/db.js")

/*
const comment1 = {
  id: "comment1",
  user: "Email@email.com",
  content: "This is great!!"
}
const comment2 = {
  id: "comment2",
  user: "Email@email.com",
  content: "This is something I have never seen before!!"
}

const posts1 = {
  id:"1",
  user: "Email@email.com",
  content: "this is my Xth post",
  imageUrl: "https://picsum.photos/400/200",
  comments: [comment1]
}

const posts2 = {
  id:"2",
  user: "Email@email.com", 
  content: "this is my Xth post",
  imageUrl: "https://picsum.photos/400/200",
  comments: [comment1, comment2]
}

const posts3 = {
  id:"3",  
  user: "Email@email.com", 
  content: "this is my Xth post",
  imageUrl: "https://picsum.photos/400/200",
  comments: []
}
const posts = [posts1, posts2, posts3]
*/
async function getPosts(req, res) {
  const email = req.email 
  console.log("req.email", req.email)
  const posts= await prisma.post.findMany({
      include: {
      comments:{
        orderBy:{
          createdAt: 'asc'
        },
        include: {
          user:{
            select:{
              email: true
            }
          }      
        }   
      },
  user: {
    select: {
      email: true
  }
}
},
    orderBy: {
      createdAt: 'desc'
    }
  })
  res.send({posts: posts, email})
  
}

async function createPost(req, res) {
  
  const content = req.body.content
  const email = req.email
  try{
  
  const user = await prisma.user.findUnique({where: {email} })
  const userId = user.id
  const post = {content, userId}
  
  addImageUrlToPost(req, post)
  const result =  await prisma.post.create({ data:post})
  
  console.log("result", result)
  res.send({post: result})
  
}
catch (err){
  res.status(500).send({ error: "something went wrong"})
}
}

function addImageUrlToPost(req, post) {
  
  const hasImage = req.file !=null
  if (!hasImage) return
  let pathToImage = req.file.path.replace("\\", "/")
  const protocol = req.protocol
  const host = req.get("host")
  const url =  `${protocol}://${host}/${pathToImage}`
  post.imageUrl = url
  
}

async function deletePost(req, res) {
  const postId = Number (req.params.id)
  try {
  const post = await prisma.post.findUnique({
    where: {
      id: postId
    },
    include: {
      user: {
        select:{
          email:true 
        }
      }
    }
  })
  console.log("post", post)
  if (post == null) {
    return res.status(404).send({error: "post not found"})
  }
  const email = req.email
  if (email !== post.user.email){
    return res.status(403).send({ error: "you are not the owner of this post"})
  }
  
  await prisma.comment.deleteMany({ where: {postId}})
  
  await prisma.post.delete({ where: { id: postId}})
  res.send({ message: "Post is gone, byeeee!"})
}
catch (err){
  res.status(500).send({ error: "something went wrong"})

}

}




async function createComment(req, res) {
  
const postId = Number(req.params.id)
//const post = posts.find((post) => post.id === postId)
const post = await prisma.post.findUnique({
  where: { id: postId },
  include: {
    user: {
      select: {
        id: true
      }
    }
  }
})
console.log("post: : : ", post)
if (post == null) {
  return res.status(404).send({error: "post not found"})
}


const userCommenting = await prisma.user.findUnique({
where: {
  email: req.email
}
})
const userId = userCommenting.id

const commentToSend = { userId, postId, content: req.body.comment}
console.log("comment to send", commentToSend)
const comment = await prisma.comment.create({data: commentToSend})

console.log("comment", comment)
res.send({comment})

}
module.exports = { getPosts, createPost, createComment, deletePost }