const express = require('express')

const app = express()

app.get('/',(req,res)=>{
    res.send('this is home page')
})

app.get('/about',(req,res)=>{
    res.send('this is about')
})
app.listen(3000)