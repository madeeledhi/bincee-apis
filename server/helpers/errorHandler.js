const errorHandler = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(403).json({ message: 'Forbidden' })
    }
    if (err.name === 'ApiError') {
        return res.status(404).json({ message: err.message })
    } // default to 500 server error
    return res.status(500).json({ message: err.message })
}

export default errorHandler
