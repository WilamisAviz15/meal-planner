"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
require("dotenv/config");
const express = __importStar(require("express"));
const secret_token = process.env.TOKEN_SECRET;
const router = express.Router();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const selectedUser = yield user_1.default.findOne({ mail: req.body.user.mail });
    if (!selectedUser)
        return res.status(400).send('Email or Password incorrect');
    const passwordAndUserMatch = bcryptjs_1.default.compareSync(req.body.user.password, selectedUser.password);
    if (!passwordAndUserMatch)
        return res.status(400).send('Email or Password incorrect');
    const token = jsonwebtoken_1.default.sign({ _id: selectedUser._id, admin: selectedUser.isAdmin }, secret_token);
    res.header('authorization-token', token);
    const { _id } = selectedUser;
    const userWithToken = {
        user: _id,
        token: token,
    };
    res.status(201).json(token);
}));
router.post('/parseTokenToId', (req, res) => {
    const tokenConverted = jsonwebtoken_1.default.verify(req.body.token, secret_token);
    res.status(201).json(Array.from(Object.values(tokenConverted))[0]);
});
exports.default = router;
//# sourceMappingURL=login.js.map