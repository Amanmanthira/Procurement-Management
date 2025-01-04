const mongoose = require('mongoose'); // Import mongoose
const bcrypt = require('bcryptjs');   // Import bcrypt for hashing passwords

// Define the User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
});

// Pre-save middleware to hash the password before saving to the DB
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();  // Only hash the password if it's modified
  this.password = await bcrypt.hash(this.password, 10);  // Hash the password
  next();
});

// Method to compare the entered password with the stored hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);  // Compare password
};

// Export the User model based on the schema
module.exports = mongoose.model('User', UserSchema);
