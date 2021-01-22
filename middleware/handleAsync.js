//Middleware to handle the repeated code of Try Catch
const handleAsync = fn => (req, res, next) => 
    Promise
        .resolve(fn(req, res, next))
        .catch(next)

module.exports = handleAsync