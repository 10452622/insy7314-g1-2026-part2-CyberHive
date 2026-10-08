
const express = require("express");

const {
    getGigs,
    getGigById,
    createGig,
    updateGig,
    deleteGig
} = require("../controllers/gigController");

const {
    authenticateToken
} = require("../middleware/authMiddleware");

const {
    authorizeRoles
} = require("../middleware/roleMiddleware");

const {
    validateGig,
    validateGigUpdate
} = require("../middleware/validationMiddleware");

const router = express.Router();

router.get("/", getGigs);
router.get("/:id", getGigById);

router.post(
    "/",
    authenticateToken,
    authorizeRoles("Freelancer"),
    validateGig,
    createGig
);

router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("Freelancer"),
    validateGigUpdate,
    updateGig
);

router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("Freelancer"),
    deleteGig
);

module.exports = router;
