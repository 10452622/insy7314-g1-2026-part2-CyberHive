
const express = require("express");

const {
    createBooking,
    getMyBookings,
    getBookingById
} = require("../controllers/bookingController");

const {
    authenticateToken
} = require("../middleware/authMiddleware");

const {
    authorizeRoles
} = require("../middleware/roleMiddleware");

const {
    validateBooking
} = require("../middleware/validationMiddleware");

const router = express.Router();

// Create a booking - clients only
router.post(
    "/",
    authenticateToken,
    authorizeRoles("Client"),
    validateBooking,
    createBooking
);

// View bookings belonging to the logged-in client
router.get(
    "/my",
    authenticateToken,
    authorizeRoles("Client"),
    getMyBookings
);

router.get(
    "/:id",
    authenticateToken,
    getBookingById
);

module.exports = router;
