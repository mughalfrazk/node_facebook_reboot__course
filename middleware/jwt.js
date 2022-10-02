const jwt = require('jsonwebtoken');

const jwtDecode = (req, res, next) => {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) return res.status(401).send({ status: 401, message: "Authorization failed" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.tokenPayload = decoded; 
    next();
}

module.exports = { jwtDecode }