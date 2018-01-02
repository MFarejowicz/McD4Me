const express = require('express')
const app = express()

app.use(express.static('templates'))
app.use('/static', express.static('static'))

// 404
app.get('*', function(req, res) {
  res.send('oops 404')
})

app.listen(8080, () => console.log('Example app listening on port 8080!'))
