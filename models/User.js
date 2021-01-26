const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String, 
            required:[true, 'Please add a name']
        },
        email: {
            type:String,
            unique: true,
            require: [true, 'Please add an  email'],
            match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email',
        ],
        },
        role: {
            type: String,
            enum: ['student', 'admin'],
            default: 'user'
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: 6,
            select: false
        },
        createdAt: {
            type: Date,
            default:Date.now
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
   }
)

//Middleware to handle the password START
//encrypt the password
UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

//Signed JWT token and rsend it to the front end
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE,
    })
}

// Compare the entered in password and one in the database
UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

// When a user is deleted, it will also delete profile
UserSchema.pre('remove', async function(next){
    await this.model('Profile').deleteMany({user: this._id});
    next();
})
//Middleware to handle the password END

//Reverse populate with virtual
UserSchema.virtual('profiles', {
    ref: 'Profile',
    localField: '_id',
    foreignField: 'user',
    justOne: false
})

module.exports = mongoose.model('User', UserSchema)