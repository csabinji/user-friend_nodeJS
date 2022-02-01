const mongoose = require(`mongoose`);

const User = mongoose.model(`User`, {
    fullname: {
        type: String
    },
    nickname: {
        type: String,
    },
    email: {
        type: String
    },
    role: {
        type: String,
        enum: [`user`, `guest`, `admin`],
        default: `user`,
    },
    authProvider: {
        type: String,
        enum: [`facebook`, `google`]
    },
    profileId: {
        type: String,
    },
    profilePic: {
        type: String,
    },
})

module.exports = User;