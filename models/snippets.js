'use strict'

const mongoose = require('mongoose')

/**
 * The schema for the snippets.
 */
const snippetSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String },
  title: { type: String, required: true },
  snippet: { type: String, required: true },
  language: { type: String, required: true },
  notes: { type: String, required: true }
})

// Create a model using the schema

module.exports = mongoose.model('SnippetDB', snippetSchema)
