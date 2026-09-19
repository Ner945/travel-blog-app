const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

//POST register new user
router.post('/register', userController.registerUser);

//POST login user
router.post('/login', userController.loginUser);

module.exports = router;