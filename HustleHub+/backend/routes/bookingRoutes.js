
const express = require("express");

const {
    createBooking,
    getMyBookings,
    getBookingById
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

router.get(
    "/:id",
    authenticateToken,
    getBookingById
);

module.exports = router; //(IIE, 2026)

/*Reference List

The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of 
  Education: Unpublished.
*/
