const express = require('express')
const router = express.Router({ mergeParams: true });



const { getUsers, createProfile, updateProfile, getProfile, profilePhotoUpload, updateSkills } = require('../controllers/profile')

const { protect } = require('../middleware/authentication')




router
    .route('/profiles')
    .get(getUsers)

router
    .route('/skills/:id')
    .put(protect, updateSkills)

router
    .route('/create')
    .post(protect, createProfile)

router
    .route('/avatar/:id')
    .put(protect, profilePhotoUpload)
    
router
    .route('/:id')
    .put(protect, updateProfile)

router
    .route('/')
    .get(protect, getProfile)

module.exports = router

