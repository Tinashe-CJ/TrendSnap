// In-memory user storage for demo
const users = new Map();

// Helper functions
const findUserById = (userId) => {
  return Array.from(users.values()).find(user => user.id === userId);
};

const findUserByEmail = (email) => {
  return users.get(email);
};

const saveUser = (user) => {
  users.set(user.email, user);
};

const getAllUsers = () => {
  return Array.from(users.values());
};

module.exports = {
  users,
  findUserById,
  findUserByEmail,
  saveUser,
  getAllUsers
}; 