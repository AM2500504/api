// models/userModel.js
// The MODEL holds the data and every function that touches it.
// Nothing here knows about HTTP, requests, responses or status codes.

// In-memory store. Resets every time the server restarts.
const users = [];

// Counter for generating IDs.
// It only ever goes UP, and is never derived from users.length.
// If it were based on length, deleting a user would let the next
// created user reuse an ID that already existed.
let nextId = 1;

function getAllUsers() {
  return users;
}

// Search with a for loop, as the exercise sheet requires.
// Returns the user object, or null when there is no match.
function findUserById(id) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      return users[i];
    }
  }
  return null;
}

// Returns the array position of a user, or -1 when not found.
// Needed separately from findUserById because splice() works on an index.
function findUserIndexById(id) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      return i;
    }
  }
  return -1;
}

function createUser(name, email) {
  const user = {
    id: nextId,
    name: name.trim(),
    email: email.trim()
  };
  nextId++;
  users.push(user);
  return user;
}

// Updates both fields but keeps the existing id.
function updateUser(id, name, email) {
  const user = findUserById(id);
  if (user === null) {
    return null;
  }
  user.name = name.trim();
  user.email = email.trim();
  return user;
}

// Removes the user with splice() and returns the removed object.
function deleteUser(id) {
  const index = findUserIndexById(id);
  if (index === -1) {
    return null;
  }
  const removed = users.splice(index, 1);
  return removed[0];
}

module.exports = {
  getAllUsers,
  findUserById,
  createUser,
  updateUser,
  deleteUser
};
