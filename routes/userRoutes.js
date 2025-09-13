const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus
} = require('../controllers/userController');

// GET /api/users - Get all users
router.get('/', getUsers);

// POST /api/users - Create new user
router.post('/', createUser);

// PUT /api/users/:id - Update user
router.put('/:id', updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', deleteUser);

// PATCH /api/users/:id/status - Update user status
router.patch('/:id/status', updateUserStatus);

module.exports = router;