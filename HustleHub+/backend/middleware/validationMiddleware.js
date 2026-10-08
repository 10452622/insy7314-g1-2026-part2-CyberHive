
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


// Handle validation errors
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

const buildGigFields = () => [

    body("title")
        .isString()
        .withMessage("Title must be text.")
        .bail()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage("Title must be between 3 and 100 characters."),

    body("description")
        .isString()
        .withMessage("Description must be text.")
        .bail()
        .trim()
        .isLength({ min: 1, max: 2000 })
        .withMessage("Description must be between 1 and 2000 characters."),

    body("category")
        .isString()
        .withMessage("Category must be text.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Category is required."),

    body("price")
        .isFloat({ min: 0 })
        .withMessage("Price must be zero or greater."),

    body("deliveryDays")
        .isInt({ min: 1 })
        .withMessage("Delivery days must be at least 1."),

    body("imageUrl")
        .optional({ values: "falsy" })
        .isURL({ require_protocol: true })
        .withMessage("Image URL must be a valid URL.")

];


// Validate a new gig
const validateGig = [
    ...buildGigFields(),
    handleValidationErrors
];


// Validate an existing gig being updated
const validateGigUpdate = [

    ...buildGigFields().map(validator => validator.optional()),

    body().custom(value => {
        const allowedFields = [
            "title",
            "description",
            "category",
            "price",
            "deliveryDays",
            "imageUrl"
        ];

        if (
            !value ||
            typeof value !== "object" ||
            Array.isArray(value) ||
            !allowedFields.some(field =>
                Object.prototype.hasOwnProperty.call(value, field)
            )
        ) {
            throw new Error(
                "Provide at least one gig field to update."
            );
        }

        return true;
    }),

    handleValidationErrors
];


module.exports = {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    handleValidationErrors,
    validateGig,
    validateGigUpdate
};

/*Reference List
1. The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of
   Education: Unpublished.
*/
