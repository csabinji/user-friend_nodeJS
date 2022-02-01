const userController = require(`../controllers/userController`);
const { verifyUser } = require(`../middlewares/authUser`);

module.exports = (router) => {
    router
        .get(`/guest-login`, userController.guestLogin)
        .post(`/social-login`, userController.socialLogin)
        .get(`/all-users`, verifyUser, userController.getAllUsers)
        .get(`/user-fetch/:userId`, verifyUser, userController.getUser)
};