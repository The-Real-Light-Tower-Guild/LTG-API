const ErrorResponse = require('../utils/errorResponse')
const handleAsync = require('../middleware/handleAsync')
const User = require('../models/User')
const Profile = require('../models/Profile')
const cloudinary = require('../utils/cloudinary')

const path = require('path')

// @desc      Get all Users
// @route     POST /api/v1/profiles
// @access    Public
exports.getUsers = handleAsync( async (req, res, next) => {

    const users = await Profile.find().populate('user')
    
    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    })
})


// @desc      Create new profile
// @route     POST /api/v1/profile/create
// @access    Private
exports.createProfile = handleAsync(async (req, res, next) => {
    const userID = req.user.id
    req.body.user = req.user.id
    
    const user = await User.findById(userID)
    if(!user){
        return next(new ErrorResponse(`No user with id ${userID}`))
    }

    const profile = await Profile.create(req.body)

    res.status(200).json({
        success: true,
        data: profile
    })
})
  
// @desc      Update Profile Photo
// @route     PUT /api/v1/profile/avatar/:id
// @access    Private
exports.profilePhotoUpload = handleAsync(async (req, res, next) => {
    const image = req.files.file
    let profile = await Profile.findById(req.params.id)

    if(!profile){
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    //if there is a avatar than delete the avatar that was store before hand
    if(profile.cloudinary_id){
       await cloudinary.uploader.destroy(profile.cloudinary_id);
    }

    if(!image.mimetype.startsWith('image')){
        return next(new ErrorResponse(`${image.name} is not an image`, 404))
    }

    //check file size
    if(image.size > process.env.MAX_FILEUPLOAD){
        return next(new ErrorResponse(`Must be an image less than 1mb`, 404))
    }
    

    image.name = `photo_${req.user.id}${path.parse(image.name).ext}`;

    image.mv(`${process.env.FILE_UPLOAD_PATH}/${image.name}`, async err => {
        if(err){
            console.error(err)
            return next(new ErrorResponse(`Problem with file upload`), 500)
        }

        const cloudImage = await cloudinary.uploader.upload(`${process.env.FILE_UPLOAD_PATH}/${image.name}`)
        profile = await Profile.findByIdAndUpdate(req.params.id, { 
            avatar: cloudImage.secure_url,
            cloudinary_id: cloudImage.public_id
        })
   })
    
    res.status(200).json({ 
        success: true, 
        data: profile
    });
});

// @desc      Update Profile
// @route     PUT /api/v1/profile/:id
// @access    Private
exports.updateProfile = handleAsync(async (req, res, next) => {
    let updateProfile = await Profile.findById(req.params.id)
    if(!updateProfile){
        return next(new ErrorResponse(`Profile not found with id of ${req.params.id}`, 404));
    }

    if(req.body.skills){
        return next(new ErrorResponse(`Skills cant be sent in this route`, 404));
    }

    updateProfile = await Profile.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true
    })
    res.status(200).json({ 
        success: true, 
        data: updateProfile
    });
});

// @desc      Update Skills section
// @route     PUT /api/v1/profile/skills/:id
// @access    Private
exports.updateSkills = handleAsync(async (req, res, next) => {
    let updateSkills = await Profile.findById(req.params.id)
    if(!updateSkills){
        return next(new ErrorResponse(`Profile not found with id of ${req.params.id}`, 404));
    }
    let skills = req.body.skills
    const skillsFields = {}
    skillsFields.skills = skills.split(',').map(skill => skill.trim());

    updateSkills = await Profile.findByIdAndUpdate(req.params.id, { $push: skillsFields }
        ,{
        new: true,
        runValidators: true
    })

    res.status(200).json({ 
        success: true, 
        data: updateSkills
    });
});
    

// @desc      Get single profile
// @route     GET /api/v1/profile/
// @access    Private
exports.getProfile = handleAsync( async (req, res, next) => {

    const user = await User.findById(req.user.id).populate('profiles')
    res.status(200).json({
        success: true,
        data: user
    })
})