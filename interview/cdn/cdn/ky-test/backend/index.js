const express = require('express')
const app = express()

app.get('/api/user', (req, res) => {
    res.json({
        id: 1,
        name: '张三',
        role: 'admin'
    })
})

app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000')
})