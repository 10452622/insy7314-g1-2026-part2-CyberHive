const User = require("../models/User");

// GET /api/users/me
const getMyProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select(
            "-password -resetPasswordToken -resetPasswordExpires"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User profile not found."
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

// PATCH /api/users/me
const updateMyProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const {
            firstName,
            lastName,
            username,
            professionalTitle,
            location,
            bio,
            skills,
            website,
            linkedin,
            github
        } = req.body;

        const updates = {};

        // Only allow these fields to be updated.
        if (firstName !== undefined) {
            updates.firstName = String(firstName).trim();
        }

        if (lastName !== undefined) {
            updates.lastName = String(lastName).trim();
        }

        if (username !== undefined) {
            updates.username = String(username).trim();
        }

        if (professionalTitle !== undefined) {
            updates.professionalTitle =
                String(professionalTitle).trim();
        }

        if (location !== undefined) {
            updates.location = String(location).trim();
        }

        if (bio !== undefined) {
            updates.bio = String(bio).trim();
        }

        if (website !== undefined) {
            updates.website = String(website).trim();
        }

        if (linkedin !== undefined) {
            updates.linkedin = String(linkedin).trim();
        }

        if (github !== undefined) {
            updates.github = String(github).trim();
        }

        if (skills !== undefined) {
            if (
                !Array.isArray(skills) ||
                !skills.every(skill => typeof skill === "string")
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Skills must be provided as a list of text values."
                });
            }

            updates.skills = [
                ...new Set(
                    skills
                        .map(skill => skill.trim())
                        .filter(Boolean)
                )
            ];
        }

        if (
            updates.firstName !== undefined &&
            !updates.firstName
        ) {
            return res.status(400).json({
                success: false,
                message: "First name is required."
            });
        }

        if (
            updates.lastName !== undefined &&
            !updates.lastName
        ) {
            return res.status(400).json({
                success: false,
                message: "Last name is required."
            });
        }

        if (
            updates.bio !== undefined &&
            updates.bio.length > 1000
        ) {
            return res.status(400).json({
                success: false,
                message: "Your bio cannot exceed 1000 characters."
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            {
                new: true,
                runValidators: true
            }
        ).select(
            "-password -resetPasswordToken -resetPasswordExpires"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User profile not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMyProfile,
    updateMyProfile
};
