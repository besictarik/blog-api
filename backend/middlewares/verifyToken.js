const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({ msg: "Not authorized. No token" });
    }

    if (req.headers.authorization.startsWith("Bearer ")) {
        const token = req.headers.authorization.split(" ")[1];
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            console.log(user);
            // user is an object with single user property: id (also creation time and expiry time)
            req.user = user;
            next();
        } catch (error) {
            res.status(403).json(error);
        }
    } else {
        return res.status(403).json({ msg: "Not authorized. No token" });
    }
};

module.exports = verifyToken;
