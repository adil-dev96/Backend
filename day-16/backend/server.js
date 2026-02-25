require ('dotenv').config()
const app = require('./src/app')
const connectToDb = require('./src/config/database')
app.listen(3000,()=>{
    console.log('server is running at port 3000');
    
})


connectToDb()