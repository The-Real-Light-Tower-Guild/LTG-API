

//@desc Register User
//@route POST /api/v1/auth/register
//@access Public
exports.register = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: "register"

    })
}


//@desc Login User
//@route POST /api/v1/auth/login
//@access Public
exports.login = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: "login"

    })
}

//@desc  Get current Logged in user
//@route POST /api/v1/auth/login
//@access Private
exports.getUser = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: "user"

    })
}


// @desc   Update User detailes
// @route  PUT /api/v1/auth/updatedetails
// @access Private
exports.updateUser = (req, res, next) => {
     res.status(200).json({
        success: true,
        data: "Update"
    })
}


// @desc   Log User Out
// @route  GET /api/v1/auth/logout
// @access Private
exports.logout = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: "Log out"
    })
}

