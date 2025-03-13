const { Router } = require("express");
const upload = require("../middlewares/upload.middleware");
const MulterController = require("../controllers/upload.controller");

const multer = new MulterController();
const router = Router();

router.post("/upload", upload.single("photo"), multer.uploadFile);

module.exports = router;
