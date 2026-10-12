const express = require("express");

const {
    createBooking,
    getMyBookings,
    getBookingById,
    getFreelancerBookings,
    updateBookingStatus
} = require("../controllers/bookingController"); //(IIE, 2026)

const {
    authenticateToken
} = require("../middleware/authMiddleware");

const {
    authorizeRoles
} = require("../middleware/roleMiddleware");

const {
    validateBooking
} = require("../middleware/validationMiddleware");

const {
    bookingLimiter
} = require("../middleware/rateLimiters");

const router = express.Router();

// POST /api/bookings
// Only authenticated clients can create bookings.
router.post(
    "/",
    authenticateToken,
    authorizeRoles("Client"),
    bookingLimiter,
    validateBooking,
    createBooking
); //(IIE, 2026)

// GET /api/bookings/my
// Retrieve bookings belonging to the logged-in client.
router.get(
    "/my",
    authenticateToken,
    authorizeRoles("Client"),
    bookingLimiter,
    getMyBookings
);

// GET /api/bookings/freelancer
// Retrieve bookings assigned to the logged-in freelancer.
router.get(
    "/freelancer",
    authenticateToken,
    authorizeRoles("Freelancer"),
    bookingLimiter,
    getFreelancerBookings
);

// PATCH /api/bookings/:id/status
// Update a booking's status.
router.patch(
    "/:id/status",
    authenticateToken,
    bookingLimiter,
    updateBookingStatus
);

// GET /api/bookings/:id
// Retrieve a specific booking.
router.get(
    "/:id",
    authenticateToken,
    bookingLimiter,
    getBookingById
);

module.exports = router; //(IIE, 2026)

/*Reference List
The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of
  Education: Unpublished.
*/
