
const express = require("express");

const { authenticateToken } = require("../middleware/authMiddleware");

const {
    getMyProfile,
    updateMyProfile
} = require("../controllers/userController");

const router = express.Router();

// GET /api/users/profile
// Existing protected profile endpoint
router.get("/profile", authenticateToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Protected profile accessed successfully.",
        user: {
            id: req.user.id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            role: req.user.role
        }
    });
});

// GET /api/users/me
// Retrieve the logged-in user's complete profile
router.get("/me", authenticateToken, getMyProfile);

// PATCH /api/users/me
// Update the logged-in user's profile
router.patch("/me", authenticateToken, updateMyProfile);

module.exports = router;
