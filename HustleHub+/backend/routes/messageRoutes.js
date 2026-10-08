
const express = require("express");

const {
    authenticateToken
} = require("../middleware/authMiddleware");

const {
    getMyConversations,
    getBookingMessages,
    sendMessage
} = require("../controllers/messageController");

const router = express.Router(); //(IIE, 2026)

router.use(authenticateToken);

router.get("/", getMyConversations);

router.get("/:bookingId", getBookingMessages);

router.post("/:bookingId", sendMessage); //(IIE, 2026)

module.exports = router;

/*Reference List

The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of 
  Education: Unpublished.
*/