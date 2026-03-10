const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1025 * 1024 * 10, //10mb
  },
});

module.exports = upload;
    