const Gig = require("../models/Gig");
const User = require("../models/User");
const Booking = require("../models/Booking");

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
        const gig = await Gig.findOne({ // (Mongoose, n.d.)
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

// Fetch gigs created by the authenticated freelancer (Page 14)
const getMyGigs = async (req, res, next) => {
    try {
        const freelancer = await User.findById(req.user.id);

        if (!freelancer || freelancer.role !== "Freelancer") {
            return res.status(403).json({
                success: false,
                message: "Freelancer account not found."
            });
        }

        const gigs = await Gig.find({
            freelancer: req.user.id,
            isDeleted: { $ne: true }
        }).sort({ createdAt: -1 }); // (Mongoose, n.d.)
        const orderCounts = await Booking.aggregate([
            { $match: { freelancer: req.user.id } },
            { $group: { _id: "$gig", count: { $sum: 1 } } }
        ]);
        const countsByGig = new Map(orderCounts.map((item) => [String(item._id), item.count]));
        const gigsWithCounts = gigs.map((gig) => ({
            ...gig.toObject(),
            ordersCount: countsByGig.get(String(gig._id)) || 0
        }));

        res.status(200).json({
            success: true,
            count: gigsWithCounts.length,
            gigs: gigsWithCounts
        });
    } catch (error) {
        next(error);
    }
};

const createGig = async (req, res, next) => {
    try {
        const freelancer = await User.findById(req.user.id);

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
        ].filter(Boolean).join(" "); //(IIE, 2026)

        const gig = await Gig.create({
            title,
            description,
            category,
            price,
            deliveryDays,
            imageUrl: imageUrl || "",
            freelancer: freelancer._id,
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
        const gig = await Gig.findOne({ _id: req.params.id, isDeleted: { $ne: true } }); // (Mongoose, n.d.)

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
        const gig = await Gig.findOne({ _id: req.params.id, isDeleted: { $ne: true } }); // (Mongoose, n.d.)

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
            }); //(IIE, 2026)
        }

        gig.isActive = false;
        gig.isDeleted = true;
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

const setGigActive = async (req, res, next) => {
    try {
        const gig = await Gig.findOne({ _id: req.params.id, freelancer: req.user.id, isDeleted: { $ne: true } });
        if (!gig) {
            return res.status(404).json({ success: false, message: "Gig not found." });
        }

        gig.isActive = Boolean(req.body.isActive);
        await gig.save();
        res.status(200).json({ success: true, gig });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getGigs,
    getGigById,
    getMyGigs,
    createGig,
    updateGig,
    deleteGig,
    setGigActive
};

/* Reference List
The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of 
  Education: Unpublished.
  
Node.js, (n.d.). File system | Node.js v22.x Documentation. [online] Available at: https://nodejs.org/api/fs.html [Accessed: 7 October 2026].

Node.js, (n.d.). Path | Node.js v22.x Documentation. [online] Available at: https://nodejs.org/api/path.html [Accessed: 7 October 2026].

Mongoose, (n.d.). Mongoose v8.17.0 API: Model. [online] Available at: https://mongoosejs.com/docs/api/model.html [Accessed: 7 October 2026].
*/