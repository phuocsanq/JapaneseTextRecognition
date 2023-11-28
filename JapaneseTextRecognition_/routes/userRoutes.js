const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const fileUploadController = require('../controllers/fileUploadController');

// router.post('/signup', authController.signup);
router.post('/file-upload', authController.protect, fileUploadController.handleFileUpload, fileUploadController.convert, fileUploadController.show); //, fileUploadController.convert, fileUploadController.show
router.get('/', authController.login1);
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/admin/updateUser', authController.protect, authController.restrictTo('admin'), authController.updateUser);
router.get('/admin/myAccount', authController.protect, authController.restrictTo('admin'), authController.adminAccount);
router.post('/admin/createAccount', authController.protect, authController.restrictTo('admin'), authController.createAccount);
router.post('/admin/deleteAccount', authController.protect, authController.restrictTo('admin'), authController.deleteAccount);
router.post('/admin/changeUserPassword', authController.protect, authController.restrictTo('admin'), authController.changeUserPassword);
router.get('/admin', authController.protect, authController.restrictTo('admin'), authController.admin);
router.get('/home', authController.protect, authController.restrictTo('user'), authController.home);
router.get('/myAccount', authController.protect, authController.restrictTo('user'), authController.myAccount);
// router.get('/account', authController.protect, authController.account);
// router.get('/myHistory', authController.protect, authController.myHistory);
// router.get('/history', authController.protect, authController.history);

router.post('/updateUser', authController.protect, userController.updateUser);
router.post('/updatePassword', authController.protect, userController.updatePassword);

// router.post('/file-upload', authController.protect, authController.restrictTo('user'), userController.upload);
// router.post('/convert', authController.protect, authController.restrictTo('user'), userController.covert);
router.post('/getget', authController.protect, fileUploadController.test);
router.get('/get_history', authController.protect, authController.restrictTo('user') , userController.getHistory);
router.get('/admin/get_history', authController.protect, authController.restrictTo('admin') , userController.getAllHistory)

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser);

module.exports = router;