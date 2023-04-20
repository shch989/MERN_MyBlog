const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())

const port = 5000

app.post('/register', (req, res) => {
  const {username, password} = req.body
  console.log(username, password)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
