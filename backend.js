const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 3000;

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        'message' : "successful"
    })
})

app.post('/api', (req, res) => {
    const { token } = req.body
    res.json({
        "message" : "alert has been sent"
    })
})

app.listen(port)
