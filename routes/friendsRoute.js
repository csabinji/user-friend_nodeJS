const { verifyUser } = require(`../middlewares/authUser`);
const friendsController = require(`../controllers/friendsController`);

module.exports = (router) => {
    router
        .get(`/send-request/:receiverId`, verifyUser, friendsController.sendRequest)
        .get(`/handle-request/:senderId/:action`, verifyUser, friendsController.handleRequest)
        .get(`/get-all-friends`, verifyUser, friendsController.getAllFriends)
        .get(`/get-friend-requests`, verifyUser, friendsController.getFriendRequest)
        .get(`/get-sent-requests`, verifyUser, friendsController.getSentFriendRequests)
        .get(`/remove-friend/:friendId`, verifyUser, friendsController.removeFriend)
};