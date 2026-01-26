const express =require('express')
const app = express()

notes = []

app.use(express.json())

app.post('/notes',(req,res)=>{
    res.send('note created')
    console.log(req.body);
    
    notes.push(req.body)
})

app.get('/notes',(req,res)=>{
   res.send(notes)
    
})



app.listen(3000,()=>{
    console.log('server is runnig at 3000');
    
})