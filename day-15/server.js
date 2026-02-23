require('dotenv').config()
const app = require('./src/app')
const connectToDatabse = require('./src/config/database')


connectToDatabse()
app.listen(3000,()=>{
    console.log('server is running at port 3000');
    
})