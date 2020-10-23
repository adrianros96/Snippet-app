const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

/**
 * The schema for the User.
 */
const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true },
  password: { type: String, required: true, minlength: 8 }
})

/**
 * Checks if the username exists or if the password is correct.
 *
 * @param {string} username - The username input.
 * @param {string} password - The password input.
 * Source course material.
 */
userSchema.statics.authenticate = async function (username, password) {
  console.log(password)
  const user = await this.findOne({ username })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid Login Attempt.')
  }
  return user
}

module.exports = mongoose.model('User', userSchema)
