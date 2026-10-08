
//Packages
const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");

// MongoDB connection 
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

//Security middleware (IIE, 2026)
app.use(helmet());

//Allow requests from the React frontend (Ibrahim, 2024)
app.use(cors());

// Parse JSON request bodies
app.use(express.json({ limit: "10kb" }));

// Basic test route (IIE, 2026)
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the HustleHub+ API"
    });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// SSL certificate paths
const keyPath = path.join(
    __dirname,
    "cert",
    "server.key"
);

const certPath = path.join(
    __dirname,
    "cert",
    "server.crt"
);

// Connect to MongoDB before starting the server.
const startServer = async () => {
    try {
        await connectDB();
        if (
            fs.existsSync(keyPath) &&
            fs.existsSync(certPath)
        ) {
            const sslOptions = {
                key: fs.readFileSync(keyPath),
                cert: fs.readFileSync(certPath)
            };

            // Create HTTPS server (IIE, 2026)
            https.createServer(
                sslOptions,
                app
            ).listen(PORT, () => {
                console.log(
                    `HustleHub+ API running at https://localhost:${PORT}`
                );
            });

        } else {
            app.listen(PORT, () => {
                console.log(
                    `HustleHub+ API running at http://localhost:${PORT}`
                );

                console.log(
                    "SSL certificates not found. Using HTTP for local development."
                );
            });
        }

    } catch (error) {
        console.error(
            "Backend startup failed:",
            error.message
        );

        process.exit(1);
    }
};

startServer();

/*Reference List
- The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of
  Education: Unpublished.
- Ibrahim, M., 2024. What is Cross Origin Resource Sharing (CORS)?. Super Tokens blog, [blog] 06 July. Available at:
  <https://supertokens.com/blog/what-is-cross-origin-resource-sharing> [Accessed 02 September 2026].
*/
