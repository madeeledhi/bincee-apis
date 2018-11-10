const errorHandler = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res
            .status(200)
            .json({ status: 403, data: { message: 'Forbidden' } })
    }
    if (err.name === 'ApiError') {
        return res
            .status(200)
            .json({ status: 404, data: { message: err.message } })
    } // default to 500 server error
    return res.status(200).json({ status: 500, data: { message: err.message } })
}

export default errorHandler
