'use strict'

/**
 * Module for the signup controller.
 *
 * @module controllers/signupController.js
 * @author Adrian Rosales
 * @version 1.0.0
 *
 */

const User = require('../models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const signupController = {}

/**
 *
 * Loads the signup page.
 *
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
signupController.index = (req, res) => {
  res.render('register/signup')
}

/**
 *
 * Sign up the user. Checks if the user already exists if not procceed to create a new user and crypt the password.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * Source: https://www.youtube.com/watch?v=OH6Z0dJ_Huk&t=1592s. https://github.com/kelektiv/node.bcrypt.js how to use bcrypt.
 */
signupController.signUp = async (req, res) => {
  User.find({ username: req.body.username })
    .exec()
    .then(user => {
      console.log(user)
      if (user.length >= 1) {
        req.session.flash = { type: 'danger', message: 'User exists, try another username' }
        res.redirect('/signup')
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send()
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              password: hash
            })
            user
              .save()
              .then(result => {
                console.log(result)
                res.status(201).send()
                res.redirect('/')
              })
              .catch(err => {
                console.log(err)
                res.status(500).send()
              })
            req.session.flash = { type: 'success', message: 'Register successful 👍🏻' }
          }
        })
      }
    })
}

module.exports = signupController
