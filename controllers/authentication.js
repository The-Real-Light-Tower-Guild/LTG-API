const sendTokenResponse = require('../utils/responseToken')
const handleAsync = require('../middleware/handleAsync')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')

//@desc Register User
//@route POST /api/v1/auth/register
//@access Public
exports.register = handleAsync(async (req, res, next) => {
    const { name, email, password, role } = req.body
    const myname = name.split(' ')[0]
    avatar = `https://avatars.dicebear.com/4.5/api/jdenticon/${myname}.svg`

    const user = await User.create({
        name, 
        email, 
        password, 
        role
    })

    sendTokenResponse(user, 200, res)
})


//@desc Login User
//@route POST /api/v1/auth/login
//@access Public
exports.login = handleAsync(async (req, res, next) => {
    const { email, password } = req.body
    if(!email || !password){
        return next(new ErrorResponse('Please provide an email and password', 400))
    }
    const user = await User.findOne({email}).select('+password')

    if(!user){
        return next(new ErrorResponse('Invalid credentials', 400))
    }

    const isMatch = await user.matchPassword(password)

    if(!isMatch){
         return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res)
   
})

//@desc  Get current Logged in user
//@route POST /api/v1/auth/login
//@access Private
exports.getUser = handleAsync(async (req, res, next) => {

    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data: user
    })
})


// @desc   Update User detailes
// @route  PUT /api/v1/auth/updatedetails
// @access Private
exports.updateUser = async (req, res, next) => {
 
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    success: true,
    data: user
  })
}

// @desc   Log User Out
// @route  GET /api/v1/auth/logout
// @access Private
exports.logout = handleAsync( async (req, res, next) => {
     res.status(200).json({
        success: true,
        data: {}
    })
})


//TODO: Set up password rest
//TODO: send a random token to email with a link

