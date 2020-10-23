'use strict'

/**
 * Module for the Login controller.
 *
 * @module controllers/loginController.js
 * @author Adrian Rosales
 * @version 1.0.0
 *
 */

const User = require('../models/user')

const loginController = {}

/**
 *
 * Loads the login page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
loginController.index = (req, res) => {
  res.render('home/index')
}

/**
 *
 * Login the user, check if the username is correct or the password match the username.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
loginController.login = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.authenticate(username, password)
    req.session.flash = { type: 'success', message: `Welcome ${username}` }
    req.session.user = user.username
    res.redirect('/snippets')
  } catch (error) {
    req.session.flash = { type: 'danger', message: `${error}` }
    res.redirect('/')
  }
}

module.exports = loginController
