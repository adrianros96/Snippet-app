'use strict'
/**
 * Config file for mongoose.
 *
 * @module config/mongoose.js
 * @author Adrian Rosales
 * @version 1.0.0
 *
 */

const mongoose = require('mongoose')

const uri = 'add your specific uri'

/**
 *  Connects to the mongo Db database.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    mongoose.set('useFindAndModify', false)
    console.log('db connected!')
  } catch (error) {
    console.log(error)
  }
}

module.exports = connectDB
