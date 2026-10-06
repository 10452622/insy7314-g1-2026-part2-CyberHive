//Error handling (IIE, 2026)
const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: "The requested endpoint was not found."
    });
};

const errorHandler = (err, req, res, next) => {
    console.error(err);

    const statusCode = res.statusCode >= 400
        ? res.statusCode
        : 500;

    res.status(statusCode).json({
        success: false,
        message: statusCode === 500
            ? "An internal server error occurred."
            : err.message
    });
};

module.exports = {
    notFound,
    errorHandler
};

/*Reference List
- The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of 
  Education: Unpublished.
*/ 