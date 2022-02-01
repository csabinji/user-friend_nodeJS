const { Router } = require(`express`);
const userRoute = require(`./userRoute`);
const friendsRoute = require(`./friendsRoute`);

module.exports = () => {
    const router = Router();
    userRoute(router);
    friendsRoute(router);
    return router;
};