const express = require('express');
const { registerUser, loginUser,getUsers,updateUser,deleteUser } = require('../controllers/AuthController');
const { authMiddleware ,adminMiddleware} = require('../middleware/AuthMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
// Route for getting all users (only accessible to admin users)
router.get('/users',authMiddleware, adminMiddleware, getUsers);

// Route for updating user details (only accessible to admin users)
router.put('/users/:id',authMiddleware, adminMiddleware, updateUser);

// Route for deleting a user (only accessible to admin users)
router.delete('/users/:id', authMiddleware, adminMiddleware,deleteUser);


module.exports = router;
