// controllers/userController.js
// The CONTROLLER is the middle man. For every request it:
//   1. validates the input
//   2. asks the model to do the work
//   3. chooses the status code and sends the response
// It never touches the users array directly.

const userModel = require('../models/userModel');

// --- helpers -------------------------------------------------------------

// A field is valid when it exists, is a string, and is not empty after trimming.
// "   " must fail, which is why trim() is applied before checking length.
function isValidText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

// req.params.id always arrives as a STRING, so it is converted with Number().
// A valid id must be a positive whole number: 0, -3, 2.5 and "abc" all fail.
function parseId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  return id;
}

// --- Exercise 1: POST /api/v1/users --------------------------------------

function createUser(req, res) {
  const { name, email } = req.body;

  if (!isValidText(name) || !isValidText(email)) {
    return res.status(400).json({
      error: 'name and email are required and must be non-empty strings'
    });
  }

  const user = userModel.createUser(name, email);
  return res.status(201).json(user);
}

// --- Exercise 2: GET /api/v1/users ---------------------------------------

function getAllUsers(req, res) {
  return res.status(200).json(userModel.getAllUsers());
}

// --- Exercise 3: GET /api/v1/users/:id -----------------------------------

function getUserById(req, res) {
  const id = parseId(req.params.id);

  // Malformed id is a client mistake -> 400
  if (id === null) {
    return res.status(400).json({ error: 'id must be a positive integer' });
  }

  const user = userModel.findUserById(id);

  // Well-formed id that matches nothing -> 404
  if (user === null) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.status(200).json(user);
}

// --- Exercise 4: PUT /api/v1/users/:id -----------------------------------

function updateUser(req, res) {
  const id = parseId(req.params.id);

  if (id === null) {
    return res.status(400).json({ error: 'id must be a positive integer' });
  }

  const { name, email } = req.body;

  if (!isValidText(name) || !isValidText(email)) {
    return res.status(400).json({
      error: 'name and email are required and must be non-empty strings'
    });
  }

  const user = userModel.updateUser(id, name, email);

  if (user === null) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.status(200).json(user);
}

// --- Exercise 5: DELETE /api/v1/users/:id --------------------------------

function deleteUser(req, res) {
  const id = parseId(req.params.id);

  if (id === null) {
    return res.status(400).json({ error: 'id must be a positive integer' });
  }

  const removed = userModel.deleteUser(id);

  if (removed === null) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.status(200).json({
    message: `User ${id} deleted successfully`,
    user: removed
  });
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
