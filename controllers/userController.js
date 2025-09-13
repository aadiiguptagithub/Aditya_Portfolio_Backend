const User = require('../models/user');

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create user
const createUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    const user = new User({
      name,
      email,
      role: role || 'User',
      status: status || 'Active'
    });
    
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status } = req.body;
    
    if (!name || !email || !role || !status) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if email is being changed and if it already exists
    if (email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
    }
    
    user.name = name;
    user.email = email;
    user.role = role;
    user.status = status;
    
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user status
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['Active', 'Inactive', 'Suspended'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.status = status;
    await user.save();
    
    res.json(user);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus
};