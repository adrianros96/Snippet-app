'use strict'
/**
 * Module for the the login routes.
 *
 * @module routes/loginRouter.js
 * @author Adrian Rosales
 * @version 1.0.0
 *
 */

const express = require('express')
const router = express.Router()

const controller = require('../controllers/loginController')

// loads the log in page and creates the log in POST to enter the website
router
  .get('/', controller.index)
  .post('/', controller.login)

// Makes the user log out
router.get('/logout', (req, res) => {
  if (req.session.user) {
    req.session.destroy()
    res.redirect('/')
  } else {
    return res.status.send(401)
  }
})

module.exports = router
