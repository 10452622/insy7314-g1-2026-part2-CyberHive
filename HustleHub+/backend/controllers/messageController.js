
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Message = require("../models/Message");

const isParticipant = (booking, userId) => {
    const id = String(userId || "");

    return (
        String(booking.client) === id ||
        String(booking.freelancer) === id
    );
};

const getMyConversations = async (req, res, next) => {
    try {
        const userId = String(req.user.id || "");

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication information."
            });
        }

        const bookings = await Booking.find({
            $or: [
                { client: userId },
                { freelancer: userId }
            ]
        })
            .populate("gig")
            .sort({ createdAt: -1 });

        const conversations = await Promise.all(
            bookings.map(async (booking) => {
                const lastMessage = await Message.findOne({
                    booking: booking._id
                })
                    .sort({ createdAt: -1 })
                    .lean();

                return {
                    bookingId: booking._id,
                    gigTitle: booking.gig?.title || "Service",
                    freelancerName:
                        booking.gig?.freelancerName || "Freelancer",
                    clientId: booking.client,
                    freelancerId: booking.freelancer,
                    status: booking.status,
                    lastMessage,
                    createdAt: booking.createdAt
                };
            })
        );

        return res.status(200).json({
            success: true,
            conversations
        });
    } catch (error) {
        next(error);
    }
};

const getBookingMessages = async (req, res, next) => {
    try {
        const { bookingId } = req.params;

        if (!mongoose.isValidObjectId(bookingId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID."
            });
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        if (!isParticipant(booking, req.user.id)) {
            return res.status(403).json({
                success: false,
                message: "You cannot access this conversation."
            });
        }

        const messages = await Message.find({
            booking: booking._id
        })
            .sort({ createdAt: 1, _id: 1 })
            .lean();

        return res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        next(error);
    }
};

const sendMessage = async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const { text } = req.body;

        if (!mongoose.isValidObjectId(bookingId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID."
            });
        }

        if (
            typeof text !== "string" ||
            !text.trim() ||
            text.trim().length > 2000
        ) {
            return res.status(400).json({
                success: false,
                message: "Message must contain 1 to 2000 characters."
            });
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        if (!isParticipant(booking, req.user.id)) {
            return res.status(403).json({
                success: false,
                message: "You cannot message about this booking."
            });
        }

        const message = await Message.create({
            booking: booking._id,
            sender: String(req.user.id),
            text: text.trim()
        });

        return res.status(201).json({
            success: true,
            message
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMyConversations,
    getBookingMessages,
    sendMessage
};
