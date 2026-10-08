
const mongoose = require("mongoose");
const dns = require("dns");

// Use alternative DNS resolvers for MongoDB Atlas SRV lookups.
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error(
                "MONGO_URI is missing from the environment variables."
            );
        }

        const connection = await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            `MongoDB connected: ${connection.connection.host}`
        );

    } catch (error) {
        console.error(
            "MongoDB connection failed:",
            error.message
        );

        throw error;
    }
};

module.exports = connectDB;
