const mongoose = require('mongoose')
const { isEmail } = require('validator');
const bcrypt = require("bcrypt")

const userShema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 50,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            unique: true,
            trim: true
        },
        firstname: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        picture: {
            type: String,
            default: './uploads/profil/random-user.jpeg'
        },
        bio: {
            type: String,
            max: 1824
        },
        followers: {
            type: [String]
        },
        following: {
            type: [String]
        },
        likes: {
            type: [String]
        }
    }, 
    {
        timestamps: true
    }
)

// crypter password
userShema.pre("save",async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
})
userShema.statics.login = async function(email,password) {
    const user = await this.findOne({email})
    if(user) {
        const auth = await bcrypt.compare(password,user.password)
        if (auth) {
            return user;
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect email')
}

const User = mongoose.model('user', userShema);
module.exports = User