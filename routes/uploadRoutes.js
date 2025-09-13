const express = require('express');
const { upload } = require('../config/cloudinary');
const { uploadBase64Image, uploadFileImage, deleteImage } = require('../controllers/uploadController');

const router = express.Router();

// POST /api/upload/base64 - Upload base64 image
router.post('/base64', uploadBase64Image);

// POST /api/upload/file - Upload file image
router.post('/file', upload.single('image'), uploadFileImage);

// DELETE /api/upload - Delete image
router.delete('/', deleteImage);

module.exports = router;