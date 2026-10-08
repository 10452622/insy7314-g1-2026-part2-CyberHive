
const express = require("express");

const {
    getGigs,
    getGigById,
    createGig,
    updateGig,
    deleteGig
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