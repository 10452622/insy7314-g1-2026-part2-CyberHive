
const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error(
                "MONGO_URI is missing from the environment variables."
            );
        } //(IIE, 2026)

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

module.exports = connectDB; // (IIE, 2026)

/*Reference List

The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of 
  Education: Unpublished.
*/