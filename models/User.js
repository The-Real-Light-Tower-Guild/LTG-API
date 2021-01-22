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
        photo: {
            type: String,
            default: 'no-photo.jpg'
        },
        role: {
            type: String,
            enum: ['user', 'student', 'admin'],
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

//Middleware to handle the password END
module.exports = mongoose.model('User', UserSchema)