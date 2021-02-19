const mongoose = require('mongoose')


const ProjectSchema = new mongoose.Schema({
    desription:{
        type: String,
        required: false
    },
    technologies:{
        type:[String],
        required: false
    },
    image: {
        type: String
    },
    cloudinary_id:{
        type: String
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS'
      ]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
})

ProjectSchema.virtual('users', {
    ref: 'Users',
    localField: '_id',
    foreignField: 'project',
    justOne: false
})

module.exports = mongoose.model('Project', ProjectSchema);
