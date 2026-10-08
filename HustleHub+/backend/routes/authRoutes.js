const express = require("express");

// Routes Handling (IIE, 2026)
const {
    register,
    login,
    forgotPassword
} = require("../controllers/authController");

const {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    handleValidationErrors
} = require("../middleware/validationMiddleware");

const router = express.Router();


router.post(
    "/register",
    registerValidation,
    handleValidationErrors,
    register
);


router.post(
    "/login",
    loginValidation,
    handleValidationErrors,
    login
);


router.post(
    "/forgot-password",
    forgotPasswordValidation,
    handleValidationErrors,
    forgotPassword
);


module.exports = router;
/*Reference List
- The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of 
  Education: Unpublished.
*/  