const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// File Path (IIE, 2026)
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
}


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
        );


        // Input validation (IIE, 2026)
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message:
                    "A user with this email already exists."
            });
        }


        // Password Encryption (Islam, 2019)
        const passwordHash = await bcrypt.hash(
            password,
            12
        );


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


        // Successful response (IIE, 2026)
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
            }

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
        );


        // Do not reveal whether the email exists
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
            );


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
            user.lastName || "";


        // JWT Authentication (GeeksForGeeks, 2026)
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
            }
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

        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    register,
    login
};

/*Reference List
- The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of 
  Education: Unpublished.
- Islam, T., 2019. NodeJS Password Encryption with bcrypt. Medium, [online] 16 December.
  Available at: <https://medium.com/@towfiqu/nodejs-password-encryption-with-bcrypt-8f78d78dc3e8> [Accessed 02 September 2026].
- GeeksForGeeks, 2026. JWT Authentication In Node.js. [online] 
  Available at: <https://www.geeksforgeeks.org/node-js/jwt-authentication-with-node-js/> 
  [Accessed 02 September 2026].  
*/