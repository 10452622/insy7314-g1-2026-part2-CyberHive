const jwt = require("jsonwebtoken");

//JWT Authentication 
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization; //(GeeksForGeeks, 2026)

        //Input validation 
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is required."
            });
        } //(IIE, 2026)

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token."
        }); //(IIE, 2026)
    }
};

module.exports = {
    authenticateToken
};

/*Reference List
1. The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of 
  Education: Unpublished.

2. GeeksForGeeks, 2026. JWT Authentication In Node.js. [online] 
  Available at: <https://www.geeksforgeeks.org/node-js/jwt-authentication-with-node-js/> 
  [Accessed 02 September 2026]. 
*/ 