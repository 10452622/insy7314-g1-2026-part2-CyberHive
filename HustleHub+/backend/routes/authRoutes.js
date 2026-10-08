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

const router = express.Router();


router.post(
    "/register",
    registerValidation,
    handleValidationErrors,
    register
); //(IIE, 2026)


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
); //(IIE, 2026)


module.exports = router;
/*Reference List
1. The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of 
  Education: Unpublished.
*/  