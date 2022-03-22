const express = require('express')
const bcrypt = require('bcrypt')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const hbs = require('hbs')
const sessions = require('express-session')
const { db } = require('./DB')
const { checkAuth } = require('./src/middlewares/checkAuth')

const PORT = process.cwd().PORT || 3000

const app = express()
const saltRounds = 10

app.set('view engine', 'hbs')
app.set('views', path.join(process.cwd(), 'src', 'views'))
app.set('cookieName', 'sid')
hbs.registerPartials(path.join(process.cwd(), 'src', 'views', 'partials'))

const secretKey = 'mxrCKk#3JWchr.BXEJLERMO^opGc?RTqUBz6'

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(process.cwd(), 'public')))
app.use(express.json)

app.use(sessions({
  name: app.get('cookieName'),
  secret: secretKey,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 86400 * 1e3,
  },
}))

app.use((req, res, next) => {
  const currentEmail = req.session?.user?.email
  if (currentEmail) {
    const currentUser = db.users.find((user) => user.email === currentEmail)
    console.log({ currentUser })
    res.locals.name = currentUser.name
  }
  next()
})

app.get('/', (req, res) => {
  res.render('main')
})

app.get('/galery', checkAuth, (req, res) => {
  const usersQuery = req.query
  let imgForRender = db.images

  if (usersQuery.limit !== undefined && Number.isNaN(+usersQuery.limit) === false) {
    imgForRender = db.images.slice(0, usersQuery.limit)
  }

  if (usersQuery.reverse === 'true') {
    imgForRender = db.images.slice().reverse()
  }

  if (usersQuery.limit !== undefined && Number.isNaN(+usersQuery.limit) === false && usersQuery.reverse === 'true') {
    imgForRender = db.images.slice().reverse().slice(0, usersQuery.limit)
  }

  res.render('galery', { srcOfImg: imgForRender })
})

app.get('/auth/signup', (req, res) => {
  res.render('signUp')
})

app.post('/auth/signup', async (req, res) => {
  const {
    name, email, password, id,
  } = req.body

  const hashPass = await bcrypt.hash(password, saltRounds)

  db.users.push({
    name,
    email,
    password: hashPass,
    id: uuidv4(),
  })

  req.session.user = {
    email,
    id,
  }

  res.redirect('/galery')
})

app.get('/auth/signin', async (req, res) => {
  res.render('signIn')
})

app.post('/auth/signin', async (req, res) => {
  const { email, password } = req.body

  const currentUser = db.users.find((user) => user.email === email)

  if (currentUser) {
    if (await bcrypt.compare(password, currentUser.password)) {
      req.session.user = {
        email,
      }

      return res.redirect('/galery')
    }
  }

  return res.redirect('/auth/signin')
})

app.post('/addphoto', (req, res) => {
  const {
    src, description, id,
  } = req.body

  req.session.user = {
    id,

  }

  db.images.push({
    src,
    description,
    id: uuidv4(),
  })

  console.log(db.images)

  res.redirect('/galery')
})

app.delete('/delete', (req, res) => {
// в разработке

  res.sendStatus(204)
})

app.get('/auth/signout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.redirect('/')
    res.clearCookie(req.app.get('cookieName'))
    return res.redirect('/')
  })
})

app.get('*', (req, res) => {
  res.render('404')
})

app.listen(PORT, () => {
  console.log(`Server has been started on port: ${PORT}`)
})
