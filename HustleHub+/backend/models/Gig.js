
const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        // The group authentication system uses UUID strings.
        freelancer: {
            type: String,
            required: true
        },

        freelancerName: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        deliveryDays: {
            type: Number,
            required: true,
            min: 1
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },

        reviewCount: {
            type: Number,
            default: 0,
            min: 0
        },

        imageUrl: {
            type: String,
            default: ""
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Gig", gigSchema);
