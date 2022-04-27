"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
require("dotenv/config");
function default_1(req, res, next) {
    const token = req.header('authorization-token');
    if (!token)
        return res.status(401).send('Access denied.');
    try {
        const userVerified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.body.user = userVerified;
        next();
    }
    catch (error) {
        return res.status(401).send('Access denied.');
    }
}
exports.default = default_1;
//# sourceMappingURL=auth.js.map