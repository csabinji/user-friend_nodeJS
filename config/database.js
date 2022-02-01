const mongoose = require(`mongoose`);
const { DATABASE_URL } = require(`./env`);

const connectDB = async () => {
    await mongoose.connect(DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

module.exports = connectDB;