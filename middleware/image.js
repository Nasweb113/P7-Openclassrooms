const multer = require("multer")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const {mimetype} = file
    const extension = mimetype.split("/")[1]
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + "."+ extension)
  }
})
const upload = multer({ storage: storage, dest: "uploads/" })
const imageUpload= upload.single('image')





module.exports = { imageUpload}