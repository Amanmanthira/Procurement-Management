const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  if (user) {
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if the password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = generateToken(user._id);

    return res.status(200).json({
      message: 'Login successful',
      token,  // Send the token in the response
      role: user.role  // Include the role in the response
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();  // Fetch all users
    res.status(200).json(users);  // Return users as JSON
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Update user
const updateUser = async (req, res) => {
  const { name, email, role } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();
    res.status(200).json(user);  // Return updated user data
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`Attempting to delete user with ID: ${id}`);
    
    // Use findByIdAndDelete to delete the user by ID
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      console.log(`User not found with ID: ${id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`User deleted successfully: ${user}`);

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error during user deletion:', error);
    return res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};






module.exports = { registerUser, loginUser,getUsers, updateUser, deleteUser  };
