const jwt = require("jsonwebtoken")

function checkToken(req, res, next) {
  
  const token = req.headers.authorization.split(" ")[1]
  
  if (token ==  null) return res.status(401).send({error: "missing token"})

  jwt.verify(token, process.env.SECRET, (error, decoded) => {

    if (error) return res.status(401).send({ error: "Invalid token" })
    req.email = decoded.email
    
    next()
  })
}
module.exports = {checkToken}