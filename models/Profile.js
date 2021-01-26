const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    bio:{
        type: String
    },
    avatar: {
        type: String,
    },
    cloudinary_id: {
    type: String,
  },
    skills:{
        type:[String],
        required: false
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS'
      ]
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone number can not be longer than 20 characters']
    },
    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
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
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

//Set the default image
ProfileSchema.pre('save', async function(next){
    this.photo = `https://avatars.dicebear.com/4.5/api/jdenticon/${this.user}.svg`
})

// When a profile is deleted, it will also delete projects
ProfileSchema.pre('remove', async function(next){
    await this.model('Project').deleteMany({profile: this._id});
    next();
})

//Reverse populate with virtual
// ProfileSchema.virtual('projects', {
//     ref: 'Projects',
//     localField: '_id',
//     foreignField: 'profile',
//     justOne: false
// })



module.exports = mongoose.model('Profile', ProfileSchema);
