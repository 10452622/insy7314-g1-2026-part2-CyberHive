const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        firstName: { type: String, trim: true, default: "" },
        lastName: { type: String, trim: true, default: "" },
        username: { type: String, trim: true, default: "" },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["Client", "Freelancer"], required: true },
        resetPasswordToken: String,
        resetPasswordExpires: Number
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);