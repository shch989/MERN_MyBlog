const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const app = express()

const salt = bcrypt.genSaltSync(10)
const secret = process.env.SECRET

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(express.json())

const port = process.env.PORT

mongoose.connect(process.env.MONGODB_URI)

app.post('/register', async (req, res) => {
  const { username, password } = req.body
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    })
    res.status(200).json(userDoc)
  } catch (err) {
    res.status(400).json(err)
  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const userDoc = await User.findOne({ username })
  if (!userDoc) {
    return res.status(400).json('wrong credentials')
  }
  const passOk = bcrypt.compareSync(password, userDoc.password)
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err
      res.cookie('token', token).json('ok')
    })
  } else {
    res.status(400).json('wrong credentials')
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
