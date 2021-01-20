const express = require('express')
const app = express()

const path = require('path')

const colors = require('colors')
const dotenv = require('dotenv')
const morgan = require('morgan')

//Secure the routes 
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require("helmet");
const xss = require('xss-clean')
const hpp = require('hpp');
const rateLimit = require("express-rate-limit");
const cors = require('cors')
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
})

app.use(express.json())
app.use(mongoSanitize())
app.use(helmet());
app.use(xss())
app.use(hpp());
app.use(limiter)
app.use(cors())

//@test Logging routes to compare to API Call
dotenv.config({ path: './config/config.env'})
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//Getting router from the file routes
const auth = require('./routes/authentication')

app.use('/api/v1/auth', auth)



const PORT = process.env.PORT || 5000



//If the route is not a valid route 
app.get('*', (req, res) => {
	res.status(404).json({
        success: false,
        message: "Invalid Route"
    })
});


const server = app.listen(PORT, console.log(`> Server running in ${process.env.NODE_ENV}: http://localhost:${PORT}`.brightBlue.bold))

//Handle Rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red)
    server.close(() => process.exit(1))
})