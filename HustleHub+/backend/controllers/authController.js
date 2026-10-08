const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// File Path
const usersFilePath = path.join(
    __dirname,
    "..",
    "data",
    "users.json"
);


function readUsers() {
    try {
        const data = fs.readFileSync(
            usersFilePath,
            "utf8"
        );

        if (!data.trim()) {
            return [];
        }

        return JSON.parse(data);

    } catch (error) {
        throw new Error(
            "Unable to read user data."
        );
    }
} //(IIE, 2026)


function saveUsers(users) {
    try {
        fs.writeFileSync(
            usersFilePath,
            JSON.stringify(users, null, 2),
            "utf8"
        );

    } catch (error) {
        throw new Error(
            "Unable to save user data."
        );
    }
}


// POST /api/auth/register
const register = async (req, res, next) => {

    try {

        const {
            firstName,
            lastName,
            email,
            password,
            role
        } = req.body;


        const users = readUsers();


        const existingUser = users.find(
            user =>
                user.email.toLowerCase() ===
                email.toLowerCase()
        ); //(IIE, 2026)


        // Input validation 
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message:
                    "A user with this email already exists."
            });
        }


        // Password Encryption 
        const passwordHash = await bcrypt.hash(
            password,
            12
        ); //(Islam, 2019)


        const newUser = {

            id: crypto.randomUUID(),

            firstName,
            lastName,

            email: email.toLowerCase(),

            password: passwordHash,

            role
        };


        users.push(newUser);

        saveUsers(users);


        // Successful response
        return res.status(201).json({

            success: true,

            message:
                "User registered successfully.",

            user: {
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role
            } //(IIE, 2026)

        });

    } catch (error) {
        next(error);
    }
};


// POST /api/auth/login
const login = async (req, res, next) => {

    try {

        const {
            email,
            password
        } = req.body;


        const users = readUsers();


        const user = users.find(
            user =>
                user.email.toLowerCase() ===
                email.toLowerCase()
        ); //(IIE, 2026)


        // Does not reveal whether the email exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password."
            });
        }


        const passwordMatches =
            await bcrypt.compare(
                password,
                user.password
            ); //(IIE, 2026)


        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password."
            });
        }


        /*
            Backwards compatibility for older test users.

            Old users contain:
            username

            New users contain:
            firstName
            lastName
        */
        const firstName =
            user.firstName || user.username || "User";

        const lastName =
            user.lastName || ""; //(IIE, 2026)


        // JWT Authentication
        const token = jwt.sign(
            {
                id: user.id,
                firstName,
                lastName,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn:
                    process.env.JWT_EXPIRES_IN
                    || "1h"
            } //(GeeksForGeeks, 2026)
        );


        // Successful response
        return res.status(200).json({

            success: true,

            message:
                "Login successful.",

            token,

            user: {
                id: user.id,
                firstName,
                lastName,
                email: user.email,
                role: user.role
            }

        }); //(IIE, 2026)

    } catch (error) {
        next(error);
    }
};


// POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {

    try {

        const {
            email
        } = req.body;


        const users = readUsers();


        const user = users.find(
            user =>
                user.email.toLowerCase() ===
                email.toLowerCase()
        ); //(IIE, 2026)


        /*
            Always returns the same response whether the email exists or not.
            This prevents account enumeration.
        */
        if (user) {

            // Generate secure reset token
            const resetToken =
                crypto
                    .randomBytes(32)
                    .toString("hex");


            /*
                Stores only a hash of the reset token. The original token would normally be
                sent to the user by email.
            */
            const resetTokenHash =
                crypto
                    .createHash("sha256")
                    .update(resetToken)
                    .digest("hex");


            user.resetPasswordToken =
                resetTokenHash; //(IIE, 2026)


            // Reset token expires after 15 minutes
            user.resetPasswordExpires =
                Date.now() + (15 * 60 * 1000);


            saveUsers(users);

            if (process.env.NODE_ENV !== "production") {

                console.log(
                    `[DEV] Password reset token for ${user.email}: ${resetToken}`
                );

            }

        } //(IIE, 2026)


        // Successful generic response
        return res.status(200).json({

            success: true,

            message:
                "If an account exists for this email, a password reset link has been sent."

        });

    } catch (error) {

        next(error);

    }
};


module.exports = {
    register,
    login,
    forgotPassword
}; //(IIE, 2026)

/*Reference List
1. The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of 
  Education: Unpublished.

2. Islam, T., 2019. NodeJS Password Encryption with bcrypt. Medium, [online] 16 December.
  Available at: <https://medium.com/@towfiqu/nodejs-password-encryption-with-bcrypt-8f78d78dc3e8> [Accessed 02 September 2026].

3. GeeksForGeeks, 2026. JWT Authentication In Node.js. [online] 
  Available at: <https://www.geeksforgeeks.org/node-js/jwt-authentication-with-node-js/> 
  [Accessed 02 September 2026].  
*/