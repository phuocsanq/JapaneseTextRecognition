const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const uploadController = require('../controllers/uploadController');


router.route('/:id').get(uploadController.getUpload);
router.route('/').post(uploadController.createUpload);

module.exports = router;