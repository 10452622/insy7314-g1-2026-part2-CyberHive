const { body, validationResult } = require("express-validator");

// Input validation and sanitisation 
const registerValidation = [

    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("First name is required.")
        .isLength({ min: 2, max: 50 })
        .withMessage("First name must be between 2 and 50 characters.")
        .matches(/^[A-Za-zÀ-ÿ' -]+$/)
        .withMessage("Please provide a valid first name."), //(IIE, 2026)

    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Last name is required.")
        .isLength({ min: 2, max: 50 })
        .withMessage("Last name must be between 2 and 50 characters.")
        .matches(/^[A-Za-zÀ-ÿ' -]+$/)
        .withMessage("Please provide a valid last name."),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please provide a valid email address.")
        .normalizeEmail(), //(IIE, 2026)

    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 8, max: 128 })
        .withMessage("Password must be between 8 and 128 characters.")
        .matches(/[a-z]/)
        .withMessage("Password must contain a lowercase letter.")
        .matches(/[A-Z]/)
        .withMessage("Password must contain an uppercase letter.")
        .matches(/[0-9]/)
        .withMessage("Password must contain a number.")
        .matches(/[^A-Za-z0-9]/)
        .withMessage("Password must contain a special character."),

    body("role")
        .trim()
        .notEmpty()
        .withMessage("Role is required.")
        .isIn(["Client", "Freelancer"])
        .withMessage("Role must be Client or Freelancer.")
]; //(IIE, 2026)


const loginValidation = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please provide a valid email address.")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")
]; //(IIE, 2026)


const forgotPasswordValidation = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please provide a valid email address.")
        .normalizeEmail()

];


const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    // Error Handling (IIE, 2026)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg
            }))
        });
    }

    next();
}; //(IIE, 2026)


module.exports = {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    handleValidationErrors
};

/*Reference List
1. The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of 
  Education: Unpublished.
*/  