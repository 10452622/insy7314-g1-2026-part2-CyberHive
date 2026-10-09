
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

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    authorizeRoles("Client"),
    validateBooking,
    createBooking
); //(IIE, 2026)

router.get(
    "/my",
    authenticateToken,
    authorizeRoles("Client"),
    getMyBookings
);

// Freelancer routes (Pages 13 & 15)
router.get(
    "/freelancer",
    authenticateToken,
    authorizeRoles("Freelancer"),
    getFreelancerBookings
);

router.get(
    "/:id",
    authenticateToken,
    getBookingById
);

// Status update route for client cancellation or freelancer progress updates (Pages 12 & 15)
router.patch(
    "/:id/status",
    authenticateToken,
    updateBookingStatus
);

module.exports = router; //(IIE, 2026)

/*Reference List

The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of 
  Education: Unpublished.
*/
