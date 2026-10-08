const mongoose =
    require("mongoose");


const bookingSchema =
    new mongoose.Schema(
        {

            gig: {
                type:
                    mongoose.Schema.Types.ObjectId,
                ref: "Gig",
                required: true
            },

            client: {
                type:
                    mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            freelancer: {
                type:
                    mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            requirements: {
                type: String,
                required: true,
                trim: true,
                maxlength: 2000
            },

            amount: {
                type: Number,
                required: true,
                min: 0
            },

            status: {
                type: String,

                enum: [
                    "Pending",
                    "Confirmed",
                    "In Progress",
                    "Completed",
                    "Cancelled"
                ],

                default:
                    "Confirmed"
            },

            deliveryDate: {
                type: Date,
                required: true
            }

        },
        {
            timestamps: true
        }
    );


module.exports =
    mongoose.model(
        "Booking",
        bookingSchema
    );