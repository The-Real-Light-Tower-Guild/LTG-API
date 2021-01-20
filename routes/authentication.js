const express = require('express')
const router = express.Router()

const { register, login, getUser, logout, updateUser } = require('../controllers/authentication')

//Get Request
router.get('/user', getUser)
router.get('/logout', logout)

//Post Request
router.post('/register', register)
router.post('/login', login)

//Put request
router.put('/update', updateUser)



module.exports = router