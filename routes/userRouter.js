// routes/userRouter.js
// The ROUTER is just a map: this URL + this HTTP method -> this controller function.
// No logic lives here.

const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// '/' here means the base path this router is mounted on in server.js,
// which is /api/v1/users
router.post('/', userController.createUser);        // Exercise 1
router.get('/', userController.getAllUsers);        // Exercise 2
router.get('/:id', userController.getUserById);     // Exercise 3
router.put('/:id', userController.updateUser);      // Exercise 4
router.delete('/:id', userController.deleteUser);   // Exercise 5

module.exports = router;
