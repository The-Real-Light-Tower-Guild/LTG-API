const handleAsync = require('../middleware/handleAsync')
const ErrorResponse = require('../utils/errorResponse')
const cloudinary = require('../utils/cloudinary')
const Project = require('../models/Project')
const Profile = require('../models/Profile')

const path = require('path')


// @desc      Create project
// @route     PUT /api/v1/project/
// @access    Private
exports.createProject = handleAsync( async (req, res, next) => {
    req.body.user = req.user.id

    const project = await Project.create(req.body)
    res.status(200)
        .json({
            success: true,
            data: project
        })
})


// @desc      Add a project Image
// @route     POST /api/v1/project/image/:id
// @access    Private
exports.addImage = handleAsync( async (req, res, next) => {
    const image = req.files.file
    console.log(req.files)
    const projectID = req.params.id
    
    let project = await Project.findById(projectID)

    if(!project){
        console.log(`Blog Post with ID ${blogID} not found...`)
        return next()
    }

    if(!image.mimetype.startsWith('image')){
        console.log("Not an image")
        return next()
    }

    if(image.size > process.env.MAX_FILEUPLOAD){
        console.log('Image is to large')
        return next()
    }

    image.name = `image_${projectID}${path.parse(image.name).ext}`

    image.mv(`${process.env.FILE_UPLOAD_PATH}/${image.name}`, async err => {
        if(err) {
            console.log(`${err}`)
            return next()
        }
        const cloudIMG = await cloudinary.uploader.upload(`${process.env.FILE_UPLOAD_PATH}/${image.name}`)
        project = await Project.findByIdAndUpdate(projectID, {
            image: cloudIMG.secure_url,
            cloudinary_id: cloudIMG.public_id 
        })
    })
   

    res.status(200).json({
        success: true,
        data: project
    })
})


// @desc      Update Tech section
// @route     POST /api/v1/technologies/:id
// @access    Private
exports.updatetechnologies = handleAsync(async (req, res, next) => {

    let updatetechnologies = await Project.findById(req.params.id)

    if(!updatetechnologies){
        return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
    }

    let tech = req.body.technologies
    const techFields = {}
    techFields.technologies = tech.split(',').map(items => items.trim());
    console.log(techFields)

    updatetechnologies = await Project.findByIdAndUpdate(req.params.id, { $push: techFields }
        ,{
        new: true,
        runValidators: true
    })

    res.status(200).json({ 
        success: true, 
        data: updatetechnologies
    });
});


// @desc   Get Single Project
// @route  GET /api/v1/project/:id
// @access Public
exports.getProject = handleAsync( async (req, res, next) => {
    const projectID = req.params.id
    const project = await Project.findById(projectID)
    res.status(200).json({
        success: true,
        data: project
    })
})

// @desc   Get All Projects
// @route  GET /api/v1/project/
// @access Public
exports.getProjects =  async (req, res, next) => {
    let project = await Project.find().sort('-createdAt')
    res.status(200).json({
        success: true,
        data: project
    })
}


// @desc      Delete project
// @route     PUT /api/v1/project/delete
// @access    Private
exports.deleteProject = handleAsync (async (req, res, next) => {
    const projectID = req.params.id
    const project = await Project.findById(projectID)
    if(!project){
        return next(new ErrorResponse(`Blog not found with id of ${blogID}`, 404))
    }
    await project.remove()

    res.status(200)
        .json({
            success: true,
            data: `Project with id ${projectID} is deleted`
        })
})