
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

        const bookings = await Booking.find({ //Mongoose, (n.d.)
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
        });// (IIE, 2026)
    } catch (error) {
        next(error);
    }
};

const getBookingMessages = async (req, res, next) => {
    try {
        const { bookingId } = req.params;

        if (!mongoose.isValidObjectId(bookingId)) { //(Mongoose, n.d.)
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID."
            });
        }

        const booking = await Booking.findById(bookingId); //(Mongoose, n.d.)

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
            }); //(IIE, 2026)
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

        const booking = await Booking.findById(bookingId); //Mongoose, (n.d.)

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
        next(error); // (Express.js, n.d.)
    }
};

module.exports = {
    getMyConversations,
    getBookingMessages,
    sendMessage
}; //(IIE, 2026)

/*Reference List

The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of 
  Education: Unpublished.

Express.js, (n.d.). Writing error handlers. [online] Available at: https://expressjs.com/en/guide/error-handling/ [Accessed: 7 October 2026].

Mongoose, (n.d.). Mongoose v8.17.0 API: Model. [online] Available at: https://mongoosejs.com/docs/api/model.html [Accessed: 7 October 2026].

/*





Node.js, (n.d.). File system | Node.js v22.x Documentation. [online] Available at: https://nodejs.org/api/fs.html [Accessed: 8 October 2026].

Node.js, (n.d.). Path | Node.js v22.x Documentation. [online] Available at: https://nodejs.org/api/path.html [Accessed: 8 October 2026]. */