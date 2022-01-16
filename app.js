const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')

// import Routes
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

dotenv.config();
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true },
    () => console.log('connect to DB'))

//middlewatre

app.use(express.json())



app.use('/api/user', authRoute)
app.use('/api/post', postRoute)

app.listen(3000, () => console.log('Server is running in port 3000'))