'use strict'
/**
 * Start point of the application.
 *
 * Source: Mats file structure and exercise follow the route and Pure approval. Https://helmetjs.github.io/docs/csp/.
 *
 * @module app.js
 * @author Adrian Rosales
 * @version 1.0.0
 *
 */

const express = require('express')
const hbs = require('express-hbs')
const { join } = require('path')
const logger = require('morgan')
const createError = require('http-errors')
const session = require('express-session')
const helmet = require('helmet')
const csrf = require('csurf')
const fs = require('fs')
const https = require('https')
const connectDB = require('./config/mongoose.js')

const app = express()

connectDB()

/// Setup view engine.
app.engine('hbs', hbs.express4({
  defaultLayout: join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: join(__dirname, 'views', 'partials')
}))

// middlewares
app.set('view engine', 'hbs')
app.set('views', join(__dirname, 'views'))
app.use(helmet.xssFilter())
app.use(helmet.frameguard())
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", 'bootstrapcdn.com', 'cloudflare.com', 'fontawesome.com', 'jquery.com', 'stackpath.bootstrapcdn.com', 'fonts.googleapis.com', 'fonts.gstatic.com'],
    fontSrc: ['fonts.googleapis.com', 'fonts.gstatic.com']
  }
}))
// Request logger.
app.use(logger('dev'))

// Serve static files.
app.use(express.static(join(__dirname, 'public')))
app.use(express.static('/public/images'))

// Parse only urlencoded bodies.
app.use(express.urlencoded({ extended: true }))

// Session cookie Source: course material
app.use(session({
  name: 'Awesome kaka',
  secret: 'mySecretjklbjkbvjkvi99877iut43',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // da
    sameSite: 'lax'
  }
}))

app.use(csrf())

// display Flash message
app.use((req, res, next) => {
  res.locals.flash = req.session.flash
  res.locals.csrfToken = req.csrfToken()
  delete req.session.flash

  next()
})

// check current user
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user
  }

  next()
})

// Define routes.
// catch 404 (ALWAYS keep this as the last route)
app.use('/', require('./routes/loginRouter'))
app.use('/signup', require('./routes/userRouter'))
app.use('/snippets', require('./routes/snippetsRouter'))
app.use('*', (req, res, next) => next(createError(404)))

// Error handler.
app.use((err, req, res, next) => {
  // 404 Not Found.
  if (err.status === 404) {
    return res
      .status(404)
      .sendFile(join(__dirname, 'views', 'errors', '404.html'))
  }

  // 500 Internal Server Error (in production, all other errors send this response).
  if (req.app.get('env') !== 'development') {
    return res
      .status(500)
      .sendFile(join(__dirname, 'views', 'errors', '500.html'))
  }

  // Development only!
  // Only providing detailed error in development.

  // Render the error page.
  res
    .status(err.status || 500)
    .render('errors/error', { err })
})

https.createServer({
  key: fs.readFileSync('localhost.key'),
  cert: fs.readFileSync('localhost.crt')
}, app).listen(8000, () => {
  console.log('Listening... port 8000')
})
