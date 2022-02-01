const jwt = require(`jsonwebtoken`);
const { JWT_SECRET } = require(`../config/env`);
const responseHelper = require("../helpers/responseHelper");
const { User } = require(`../models`);

module.exports = {
    verifyUser: async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const data = jwt.verify(token, JWT_SECRET);
            const user = await User.findOne({ _id: data.userId });
            if (!user) {
                return responseHelper(false, `Unauthorized User`, 401, ``, {}, res)
            }
            req.User = user;
            next();
        } catch (error) {
            return responseHelper(false, `Internal server error`, 500, ``, {}, res);
        }
    }
}