import express from 'express'
import runGraph from './ai/graph.ai.js'

const app = express();


app.get('/', async (req,res)=>{
    
    const result = await runGraph("write a code for factorial function in js")

    res.json(result)

})

export default app
