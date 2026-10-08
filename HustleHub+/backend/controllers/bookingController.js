
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Gig = require("../models/Gig");

const createBooking = async (req, res, next) => {
    try {
        const { gigId, requirements } = req.body;

        if (!mongoose.isValidObjectId(gigId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid gig ID."
            });
        }

        const gig = await Gig.findOne({
            _id: gigId,
            isActive: true
        });

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: "Gig not found or no longer available."
            });
        }

        const deliveryDate = new Date();
        deliveryDate.setDate(
            deliveryDate.getDate() + gig.deliveryDays
        );

        const booking = await Booking.create({
            gig: gig._id,
            client: req.user.id,
            freelancer: gig.freelancer,
            requirements,
            amount: gig.price,
            status: "Pending",
            deliveryDate
        });

        res.status(201).json({
            success: true,
            message: "Booking created successfully.",
            booking
        });

    } catch (error) {
        next(error);
    }
};

// Retrieve bookings belonging to the logged-in client
const getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({
            client: req.user.id
        })
            .populate("gig")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        next(error);
    }
};

// Retrieve a single booking
const getBookingById = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID."
            });
        }

        const booking = await Booking.findById(req.params.id)
            .populate("gig");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        // Only the client or assigned freelancer may view it.
        if (
            booking.client !== req.user.id &&
            booking.freelancer !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "You cannot access this booking."
            });
        }

        res.status(200).json({
            success: true,
            booking
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getBookingById
};
