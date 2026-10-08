const express = require("express");

const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authenticateToken, (req, res) => {

    // Successful response 
    res.status(200).json({
        success: true,
        message: "Protected profile accessed successfully.",

        user: {
            id: req.user.id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            role: req.user.role
        }
    }); //(IIE, 2026)

});

module.exports = router;

/*Reference List
1. The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of 
  Education: Unpublished.
*/  