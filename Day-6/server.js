const mongoose = require('mongoose');
const app = require('./.src/app')
require('dotenv').config();

function connectToDb(){
mongoose.connect(process.env.MONGO_URI)

.then(()=>{
    console.log('connected to DataBase');
    
})
}

connectToDb()
app.listen(3000,()=>{
    console.log('server is running at 3000');
    
})