const User = require('../../models/User');

class AuthRepository {
  /**
   * Find a user by their email address
   * @param {string} email
   * @returns {Promise<User|null>}
   */
  async findByEmail(email) {
    return User.findOne({ email: email.toLowerCase().trim() });
  }

  /**
   * Find a user by their ID
   * @param {string} id
   * @returns {Promise<User|null>}
   */
  async findById(id) {
    return User.findById(id);
  }

  /**
   * Create a new user record
   * @param {Object} userData
   * @returns {Promise<User>}
   */
  async createUser(userData) {
    const user = new User(userData);
    return user.save();
  }

  /**
   * Update an existing user by ID
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<User|null>}
   */
  async updateUser(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }
}

module.exports = new AuthRepository();
