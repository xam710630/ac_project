const express = require('express')
const app = express()
const port = 3000

app.get("/", (req, res) => {
  res.send('This is my first Express web App by kaiyu')
})

app.get("/food", (req, res) => {
  res.send('My favorite food is apple.')
})

app.get("/food/:food", (req, res) => {
  console.log(req.params.food)
  res.send(`<h1>My favorite food is ${req.params.food}.</h1>`)
})

app.listen(port, () => {
  console.log(`Express is running at http://localhost:${port}`)
})
