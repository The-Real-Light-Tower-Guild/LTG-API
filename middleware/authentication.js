const jwt = require('jsonwebtoken')

const User = require('../models/User')
const handleAsync = require('./handleAsync')
const ErrorResponse = require('../utils/errorResponse')


exports.protect = handleAsync(async (req, res, next) => {
    let token;
    //Get the token from the header
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    // else if(req.cookies.token){
    //     token = req.cookies.token
    // }

    if(!token){
        return next(new ErrorResponse(' Line 19: Not authorized to access this route', 401))
    }

    try {
        //Verify that the token belong to the user in the database
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        //Get the id from the token
        req.user = await User.findById(decoded.id)
        //Go to the next middlewares
        next()
    } catch (error) {
        console.log(error)
        return next(new ErrorResponse('Line 31 Not authorized to access this route', 401))
        
    }
})

// Check the roles and grant access to a specific area of the front end
// exports.authorize = (...roles) => {
//     return (req, res, next)=>{
//         if(!roles.includes(req.user.role)){
//             return next(new ErrorResponse(`User Role ${req.user.role}is not authorized access this route`, 403))
//         }
//         next()
//     }
// }