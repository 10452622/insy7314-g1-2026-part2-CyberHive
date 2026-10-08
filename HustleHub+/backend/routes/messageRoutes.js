
const express = require("express");

const {
    authenticateToken
} = require("../middleware/authMiddleware");

const {
    getMyConversations,
    getBookingMessages,
    sendMessage
} = require("../controllers/messageController");

const router = express.Router();

router.use(authenticateToken);

router.get("/", getMyConversations);

router.get("/:bookingId", getBookingMessages);

router.post("/:bookingId", sendMessage);

module.exports = router;
