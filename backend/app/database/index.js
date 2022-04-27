"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoURI = process.env.MONGO_URI;
function connectToMongoDB() {
    if (mongoURI) {
        mongoose_1.default.connect(mongoURI, {
            autoIndex: false,
            maxPoolSize: 250,
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000,
        }, () => console.log('Connected to MongoDB'));
    }
    else {
        console.log('Failed to connect to MongoDB');
    }
}
exports.default = connectToMongoDB;
//# sourceMappingURL=index.js.map