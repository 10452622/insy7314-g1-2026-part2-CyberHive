const express = require("express");

const {
    getGigs,
    getGigById,
    getMyGigs,
    createGig,
    updateGig,
    deleteGig,
    setGigActive
} = require("../controllers/gigController"); //(IIE, 2026)

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

// Private route for freelancers to view their own created gigs (Page 14)
router.get(
    "/my-gigs", 
    authenticateToken, 
    authorizeRoles("Freelancer"), 
    getMyGigs
); 
router.get("/:id", getGigById); //(IIE, 2026)

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
); //(IIE, 2026)

router.patch(
    "/:id/active",
    authenticateToken,
    authorizeRoles("Freelancer"),
    setGigActive
);

router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("Freelancer"),
    deleteGig
);

module.exports = router;

/*Reference List

The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of 
  Education: Unpublished.
*/