const express = require('express')
const router = express.Router({ mergeParams: true });

const { getProject, getProjects, createProject, updatetechnologies, addImage, deleteProject  } = require('../controllers/project')
const { protect } = require('../middleware/authentication')
router
    .route('/')
    .get(getProjects)

router
    .route('/:id')
    .get(getProject)

// router
//     .route('/image/:id')
//     .post(protect, addImage)

router
    .route('/image/:id')
    .put(protect, addImage)
router
    .route('/technologies/:id')
    .put(protect, updatetechnologies)

router 
    .route('/create')
    .post(protect, createProject)

router
    .route('/delete/:id')
    .delete(protect, deleteProject)

module.exports = router