
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            index: true
        },

        sender: {
            type: String,
            required: true
        },

        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000
        }
    },
    {
        timestamps: true
    }
);

messageSchema.index({
    booking: 1,
    createdAt: 1
});

module.exports = mongoose.model("Message", messageSchema);
