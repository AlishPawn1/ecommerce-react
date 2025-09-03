import multer from "multer";
var storage = multer.diskStorage({
  filename: function filename(req, files, callback) {
    callback(null, files.originalname);
  }
});
var upload = multer({
  storage: storage
});
export default upload;