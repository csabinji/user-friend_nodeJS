const mongoose = require(`mongoose`);
const { ObjectId } = mongoose.Schema.Types;

const Friends = mongoose.model(`Friends`, {
    userId: {
        type: ObjectId,
        ref: `User`,
        required: true,
    },
    friends: [
        {
            type: ObjectId,
            ref: `User`,
            required: true,
        }
    ],
    requests: [
        {
            type: ObjectId,
            ref: `User`,
            required: true,
        }
    ],
    sentRequest: [
        {
            type: ObjectId,
            ref: `User`,
            required: true,
        }
    ]
});

module.exports = Friends;