'use strict'
/**
 * Module for the user routes.
 *
 * @module routes/userRouter.js
 * @author Adrian Rosales
 * @version 1.0.0
 *
 */

const express = require('express')
const router = express.Router()

const controller = require('../controllers/signupController')

// Loads the signup page and new users can register an account
router
  .get('/', controller.index)
  .post('/', controller.signUp)

module.exports = router
