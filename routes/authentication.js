const express = require('express')
const router = express.Router({ mergeParams: true });


const { register, login, getUser, logout, updateUser, updatePassword } = require('../controllers/authentication')

const { protect } = require('../middleware/authentication')


// Include other resource routers
const profileRouter = require('./profile')

// Re-route into other resource routers
router.use('/:id/profile', profileRouter)

//Get Request
router.get('/user',protect, getUser)
router.get('/logout', logout)

//Post Request
router.post('/register', register)
router.post('/login', login)

//Put request
router.put('/updateuser', protect, updateUser)

router.put('/updatepassword', protect, updatePassword)



module.exports = router