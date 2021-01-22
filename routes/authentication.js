const express = require('express')
const router = express.Router()


const { register, login, getUser, logout, updateUser } = require('../controllers/authentication')

const { protect } = require('../middleware/authentication')

//Get Request
router.get('/user',protect, getUser)
router.get('/logout', logout)

//Post Request
router.post('/register', register)
router.post('/login', login)

//Put request
router.put('/update', protect, updateUser)



module.exports = router