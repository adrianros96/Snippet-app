'use strict'
/**
 * Module for the snippets routes.
 *
 * @module routes/snippetsRouter.js
 * @author Adrian Rosales
 * @version 1.0.0
 *
 */

const express = require('express')
const router = express.Router()

const controller = require('../controllers/snippetsController')

// Loads the snippets page
router.get('/', controller.index)

// Logged in users can create new snippets
router.get('/new', controller.authorize, controller.new)
router.post('/create', controller.authorize, controller.create)

// specific logged in users can update and delete snippets
router.get('/edit/:id', controller.authorizeUser, controller.edit)
router.post('/update/:id', controller.authorizeUser, controller.update)
router.get('/delete/:id', controller.authorizeUser, controller.delete)
module.exports = router
