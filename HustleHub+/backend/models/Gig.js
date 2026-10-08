
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
        }, //(IIE, 2026)

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
        }, //(IIE, 2026)

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

module.exports = mongoose.model("Gig", gigSchema); //(IIE, 2026)

/*Reference List

The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of 
  Education: Unpublished.
*/