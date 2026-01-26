const express = require('express')
const app = express()

app.use(express.json())

app.get('/',(req,res)=>{
    res.send('welcome to the world')
})

const note = []

app.post('/notes', (req,res)=>{
    res.send('note created successfully')
    note.push(req.body)
    
    
})


app.get('/notes',(req,res)=>{
    res.send(note)
})

app.delete('/notes/:index',(req,res)=>{
    delete note[req.params.index] 
    res.send('deleted successfully')
})

app.patch('/notes/:index',(req,res)=>{
    note[req.params.index].description = req.body.description
    res.send('updated successfully')
})



module.exports = app