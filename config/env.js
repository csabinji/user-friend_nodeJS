const ENV = process.env

module.exports = {
    DATABASE_URL: ENV.DATABASE_URL,
    PORT: ENV.PORT,
    JWT_SECRET: ENV.JWT_SECRET
};