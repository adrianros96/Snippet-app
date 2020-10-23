'use strict'
/**
 * Module for the snippets controller.
 *
 * @module controllers/snippetsController.js
 * @author Adrian Rosales
 * @version 1.0.0
 *
 */

const SnippetDB = require('../models/snippets')
const mongoose = require('mongoose')

const snippetsController = {}

/**
 * Displays the snippets page and all the snippets.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next If the snippets doesn't load Bad request is displayed.
 * @returns {Function} If error with status code 400.
 */
snippetsController.index = async (req, res, next) => {
  try {
    const snippetZ = []
    const variabel = (await SnippetDB.find({}))
      .map(userSnippet => ({
        _id: userSnippet._id,
        title: userSnippet.title,
        snippet: userSnippet.snippet,
        language: userSnippet.language,
        notes: userSnippet.notes,
        username: userSnippet.username,
        owner: userSnippet.username === req.session.user
      }))

    variabel.forEach(el => snippetZ.push(el))
    const viewData = { snippetZ }
    res.render('snippet/index', { viewData })
  } catch {
    const error = new Error('400 - Bad request')
    error.statusCode = 400
    return next(error)
  }
}

/**
 * Returns a code snippet for creating a new snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
snippetsController.new = async (req, res) => {
  res.render('snippet/new')
}
/**
 * Creates a new snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
snippetsController.create = async (req, res) => {
  const snippets = await new SnippetDB({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    snippet: req.body.snippet,
    language: req.body.language,
    notes: req.body.notes,
    username: req.session.user
  })
  await snippets.save()
  // ...redirect to the list of snippets.
  req.session.flash = { type: 'success', message: 'Snippet Created' }
  res.redirect('.')
}

/**
 * If the user is not logged in Send error message no access.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next If the authorize doesn't work Bad request is displayed.
 * @returns {Function} If error with status code 403.
 * Source: course materials.
 */
snippetsController.authorizeUser = async (req, res, next) => {
  try {
    // Auktorisering av ägarskap
    const snippet = await SnippetDB.findOne({ _id: req.params.id })
    if (req.session.user !== snippet.username) {
      const error = new Error('403 - No access')
      error.statusCode = 403
      return next(error)
    }
    next()
  } catch {
    const error = new Error('500 - internal server error')
    error.statusCode = 500
    return next(error)
  }
}
/**
 * If the user is logged in.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next If the authorize doesn't work Bad request is displayed.
 * @returns {Function} If error with status code 403.
 * Source: course materials.
 */

snippetsController.authorize = async (req, res, next) => {
  if (!req.session.user) {
    const error = new Error('403 - No access')
    error.statusCode = 403
    return next(error)
  }
  next()
}

/**
 * Deletes the snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next If the delete doesn't work Bad request is displayed.
 * @returns {Function} If error with status code 400.
 *
 * Source: https://kb.objectrocket.com/mongo-db/how-to-use-the-mongoose-findbyidandupdate-method-924.
 */
snippetsController.delete = async (req, res, next) => {
  try {
    await SnippetDB.findByIdAndRemove(req.params.id, (err, doc) => {
      if (!err) {
        req.session.flash = { type: 'success', message: 'Snippet Deleted' }
        res.redirect('/snippets')
      } else {
        res.status(403).send()
      }
    })
  } catch {
    const error = new Error('400 - Bad request')
    error.statusCode = 400
    return next(error)
  }
}

/**
 * Displays the edit snippet page with correct data do edit.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next If the edit page doesn't work Bad request is displayed.
 * @returns {Function} If error with status code 403.
 */
snippetsController.edit = (req, res, next) => {
  try {
    SnippetDB.findById(req.params.id, (err, doc) => {
      if (!err) {
        res.render('snippet/edit', {
          snippetz: doc
        })
      }
    })
  } catch {
    const error = new Error('403 - No access')
    error.statusCode = 403
    return next(error)
  }
}

/**
 * Updates the snippetDB.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next If the updates doesn't work Bad request is displayed.
 * Source: https://kb.objectrocket.com/mongo-db/how-to-use-the-mongoose-findbyidandupdate-method-924.
 *
 */
snippetsController.update = async (req, res, next) => {
  console.log(typeof next)
  try {
    const id = await req.params.id

    await SnippetDB.findByIdAndUpdate(id, {
      title: req.body.title,
      snippet: req.body.snippet,
      langauge: req.body.langauge,
      notes: req.body.notes
    }, (err, updatedSnippet) => {
      if (err) {
        console.log('no update')
        res.send(err)
      } else {
        req.session.flash = { type: 'success', message: 'Snippet updated' }
        res.redirect('/snippets')
      }
    })
  } catch {
    const error = new Error('400 - Bad request')
    error.statusCode = 400
    return next(error)
  }
}
module.exports = snippetsController
