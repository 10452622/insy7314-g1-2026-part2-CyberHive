const express = require("express");

// Routes Handling
const {
    register,
    login,
    forgotPassword
} = require("../controllers/authController"); //(IIE, 2026)

const {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    handleValidationErrors
} = require("../middleware/validationMiddleware");

const {
    registerLimiter,
    loginLimiter,
    forgotPasswordLimiter
} = require("../middleware/rateLimiters");

const router = express.Router();

// POST /api/auth/register
router.post(
    "/register",
    registerLimiter,
    registerValidation,
    handleValidationErrors,
    register
); //(IIE, 2026)

// POST /api/auth/login
router.post(
    "/login",
    loginLimiter,
    loginValidation,
    handleValidationErrors,
    login
);

// POST /api/auth/forgot-password
router.post(
    "/forgot-password",
    forgotPasswordLimiter,
    forgotPasswordValidation,
    handleValidationErrors,
    forgotPassword
); //(IIE, 2026)

module.exports = router;

/*Reference List
1. The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of
  Education: Unpublished.
*/
