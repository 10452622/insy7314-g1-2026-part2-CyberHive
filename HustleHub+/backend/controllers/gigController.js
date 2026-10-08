
const Gig = require("../models/Gig");
const fs = require("fs");
const path = require("path");

const usersFilePath = path.join(__dirname, "../data/users.json");

const findUserById = (id) => {
    const users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
    return users.find(user => user.id === id);
};

const getGigs = async (req, res, next) => {
    try {
        const { search, category } = req.query;
        const filter = { isActive: true };

        if (search) {
            const safeSearch = String(search)
                .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            filter.$or = [
                { title: { $regex: safeSearch, $options: "i" } },
                { description: { $regex: safeSearch, $options: "i" } },
                { category: { $regex: safeSearch, $options: "i" } }
            ];
        }

        if (category) {
            const safeCategory = String(category)
                .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            filter.category = {
                $regex: `^${safeCategory}$`,
                $options: "i"
            };
        }

        const gigs = await Gig.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: gigs.length,
            gigs
        });
    } catch (error) {
        next(error);
    }
};

const getGigById = async (req, res, next) => {
    try {
        const gig = await Gig.findOne({
            _id: req.params.id,
            isActive: true
        });

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: "Gig not found."
            });
        }

        res.status(200).json({ success: true, gig });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid gig ID."
            });
        }

        next(error);
    }
};

const createGig = async (req, res, next) => {
    try {
        const freelancer = findUserById(req.user.id);

        if (!freelancer || freelancer.role !== "Freelancer") {
            return res.status(403).json({
                success: false,
                message: "Freelancer account not found."
            });
        }

        const {
            title,
            description,
            category,
            price,
            deliveryDays,
            imageUrl
        } = req.body;

        const freelancerName = [
            freelancer.firstName || freelancer.username,
            freelancer.lastName
        ].filter(Boolean).join(" ");

        const gig = await Gig.create({
            title,
            description,
            category,
            price,
            deliveryDays,
            imageUrl: imageUrl || "",
            freelancer: freelancer.id,
            freelancerName
        });

        res.status(201).json({
            success: true,
            message: "Gig created successfully.",
            gig
        });
    } catch (error) {
        next(error);
    }
};

const updateGig = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id);

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: "Gig not found."
            });
        }

        if (gig.freelancer !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You cannot update another freelancer's gig."
            });
        }

        const allowedFields = [
            "title",
            "description",
            "category",
            "price",
            "deliveryDays",
            "imageUrl"
        ];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                gig[field] = req.body[field];
            }
        }

        await gig.save();

        res.status(200).json({
            success: true,
            message: "Gig updated successfully.",
            gig
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid gig ID."
            });
        }

        next(error);
    }
};

const deleteGig = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id);

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: "Gig not found."
            });
        }

        if (gig.freelancer !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You cannot delete another freelancer's gig."
            });
        }

        gig.isActive = false;
        await gig.save();

        res.status(200).json({
            success: true,
            message: "Gig deleted successfully."
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid gig ID."
            });
        }

        next(error);
    }
};

module.exports = {
    getGigs,
    getGigById,
    createGig,
    updateGig,
    deleteGig
};
