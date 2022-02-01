const { User } = require(`../models`);
const jwt = require(`jsonwebtoken`);
const { JWT_SECRET } = require(`../config/env`);
const responseHelper = require(`../helpers/responseHelper`);

module.exports = {
    guestLogin: async (req, res, next) => {
        try {
            const user = new User({
                fullname: await getUniqueName(),
                role: `guest`
            });
            await user.save();
            const token = jwt.sign({ userId: user._id }, JWT_SECRET);
            return responseHelper(true, `Guest account created!`, 200, ``, { user, token }, res);
        } catch (error) {
            return responseHelper(false, `Internal server error`, 500, ``, {}, res);
        }
    },
    socialLogin: async (req, res, next) => {
        try {
            const { authProvider, profileId, email } = req.body;
            const savedUser = await User.findOne({
                $or: [
                    { authProvider: authProvider, profileId: profileId },
                    { email: email }
                ]
            });
            if (!savedUser) {
                const user = await User.create(req.body);
                const token = jwt.sign({ userId: user._id }, JWT_SECRET)
                return responseHelper(true, `User created!`, 200, ``, { user, token }, res);
            }
            const token = jwt.sign({ userId: savedUser._id }, JWT_SECRET)
            return responseHelper(true, `Login Successful!`, 200, ``, { savedUser, token }, res);
        } catch (error) {
            return responseHelper(false, `Internal server error`, 500, ``, {}, res);
        }
    },
    getAllUsers: async (req, res, next) => {
        try {
            const users = await User.find({
                role: { $nin: [`guest`, `admin`] },
                _id: { $nin: [req.User[`_id`]] }
            }).lean();
            return responseHelper(true, `All Users Retrieved!`, 200, ``, users, res);
        } catch (error) {
            return responseHelper(false, `Internal server error`, 500, ``, {}, res);
        }
    },
    getUser: async (req, res, next) => {
        try {
            const { userId } = req.params;
            const user = await User.findById(userId).lean();
            return responseHelper(true, `User Retrieved!`, 200, ``, user, res);
        } catch (error) {
            return responseHelper(false, `Internal server error`, 500, ``, error, res);
        }
    }
}
const getUniqueName = async () => {
    const fullname = `guest${Math.floor(100000 + Math.random() * 900000)}`;
    const user = await User.findOne({ fullname });
    if (!user) {
        return fullname;
    }
    await getUniqueName();
}