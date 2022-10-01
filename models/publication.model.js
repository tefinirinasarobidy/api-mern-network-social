const mongoose = require('mongoose')

const publicationShema = mongoose.Schema(
    {
        posterId: {
            type: String,
            require: true
        },
        message: {
            type: String,
            trim: true,
        },
        picture: {
            type: String
        },
        video: {
            type: String
        },
        likers: {
            type: [String]
        },
        comments: {
            type: [
                {
                    user_id: String,
                    user_firstname: String,
                    text: String,
                    timestamps: Number,
                }
            ],
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('publication',publicationShema)