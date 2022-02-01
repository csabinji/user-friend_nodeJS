const { Friends } = require(`../models`);
const responseHelper = require(`../helpers/responseHelper`);

module.exports = {
    sendRequest: async (req, res, next) => {
        try {
            const userId = req.User[`_id`];
            const { receiverId } = req.params;

            const alreadyFriend = await Friends.findOne({ userId: userId, friends: { $in: [receiverId] } });

            if (alreadyFriend) {
                return responseHelper(false, `User already in friend list!`, 400, `VALIDATION`, {}, res);
            }

            const alreadySent = await Friends.findOne({ userId: userId, sentRequest: { $in: [receiverId] } });

            if (alreadySent) {
                return responseHelper(false, `Friend request already sent!`, 400, `VALIDATION`, {}, res);
            }

            const sentByReceiver = await Friends.findOne({ userId: userId, requests: { $in: [receiverId] } });

            if (sentByReceiver) {
                return responseHelper(false, `Friend request already sent by the receiver!`, 400, `VALIDATION`, {}, res);
            }

            if (userId == receiverId) {
                return responseHelper(false, `Cannot send friend request to yourself!`, 400, `VALIDATION`, {}, res);
            }

            await Friends.updateOne({ userId: userId }, { $push: { sentRequest: receiverId } }, { upsert: true });
            await Friends.updateOne({ userId: receiverId }, { $push: { requests: userId } }, { upsert: true });
            return responseHelper(true, `Friend Request Sent!`, 200, ``, {}, res);
        } catch (error) {
            return responseHelper(false, `Internal server error`, 500, ``, {}, res);
        }
    },
    handleRequest: async (req, res, next) => {
        try {
            const userId = req.User[`_id`];
            const { action, senderId } = req.params;
            let message = ``;

            const alreadyAccepted = await Friends.findOne({ userId: userId, friends: { $in: [senderId] } });

            if (alreadyAccepted) {
                return responseHelper(false, `User already in friend list!`, 400, `VALIDATION`, {}, res);
            }

            if (action === `accept`) {
                await Friends.updateOne(
                    { userId: userId },
                    {
                        $push: { friends: senderId },
                        $pull: { requests: senderId }
                    },
                    { upsert: true });

                await Friends.updateOne(
                    { userId: senderId },
                    {
                        $push: { friends: userId },
                        $pull: { sentRequest: userId }
                    },
                    { upsert: true });

                message = `Friend request accepted!`;

            } else if (action === `cancel`) {
                await Friends.updateOne({ userId: userId }, { $pull: { requests: senderId } }, { upsert: true });
                await Friends.updateOne({ userId: senderId }, { $pull: { sentRequest: userId } }, { upsert: true });

                message = `Friend request canceled!`;
            };
            return responseHelper(true, message, 200, ``, {}, res);

        } catch (error) {
            return responseHelper(false, `Internal server error`, 500, ``, {}, res);
        }
    },
    getAllFriends: async (req, res, next) => {
        try {
            const userId = req.User[`_id`];
            const { searchTerm } = req.query;
            let options = {};
            if (searchTerm) {
                options = {
                    match: {
                        fullName: { $regex: searchTerm, $options: `i` },
                    },
                };
            }

            const friends = await Friends.find({ userId: userId })
                .select(`friends`)
                .populate({ path: `friends`, select: `fullname profilePic`, ...options });

            return responseHelper(true, `Friends retrieved!`, 200, ``, friends, res);

        } catch (error) {
            return responseHelper(false, `Internal server error`, 500, ``, {}, res);
        }
    },
    getFriendRequest: async (req, res, next) => {
        try {
            const userId = req.User[`_id`];

            const requests = await Friends.find({ userId: userId })
                .select(`requests`)
                .populate({ path: `requests`, select: `fullname profilePic` });

            return responseHelper(true, `Friend request retrieved!`, 200, ``, requests, res);

        } catch (error) {
            return responseHelper(false, `Internal server error`, 500, ``, {}, res);
        }
    },
    getSentFriendRequests: async (req, res, next) => {
        try {
            const userId = req.User[`_id`];
            const requests = await Friends.find({ userId: userId })
                .select(`sentRequest`)
                .populate({ path: `sentRequest`, select: `fullname profilePic` });
            return responseHelper(true, `Sent request retrieved!`, 200, ``, requests, res);
        } catch (error) {
            return responseHelper(false, `Internal server error`, 500, ``, {}, res);
        }
    },
    removeFriend: async (req, res, next) => {
        try {
            const userId = req.User[`_id`];
            const { friendId } = req.params;
            const friend = await Friends.findOne({ userId: userId, friends: { $in: [friendId] } });
            if (!friend) {
                return responseHelper(false, `User not in your friend list!`, 400, `VALIDATION`, {}, res);
            }
            await Friends.updateOne({ userId: userId }, { $pull: { friends: friendId } }, { upsert: true });
            await Friends.updateOne({ userId: friendId }, { $pull: { friends: userId } }, { upsert: true });
            return responseHelper(true, `Friend Removed`, 200, ``, {}, res);
        } catch (error) {
            return responseHelper(false, `Internal server error`, 500, ``, {}, res);
        }
    }
};