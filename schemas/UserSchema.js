const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: '/images/profilePic.png'
    },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    reposts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
}, { timestamps: true });

let User = mongoose.model('User', UserSchema);
module.exports = User;