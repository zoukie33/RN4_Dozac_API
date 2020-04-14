const multer = require('multer');


const uploadImg = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

exports.uploadImg = uploadImg;