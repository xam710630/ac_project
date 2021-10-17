const express = require("express")
const app = express()
const port = 3000

app.get("/", (req, res) => {
  res.send('This is my movie list')
})

app.listen(port, () => {
  console.log('express is sucess')
})