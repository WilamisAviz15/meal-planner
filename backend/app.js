"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./app/routes/user"));
const schedule_1 = __importDefault(require("./app/routes/schedule"));
const login_1 = __importDefault(require("./app/routes/login"));
const auth_1 = __importDefault(require("./app/routes/auth"));
const typegoose_1 = require("@typegoose/typegoose");
class MealPlannerAPI {
    constructor() {
        this.mongoURI = process.env.MONGO_URI;
        this.app = (0, express_1.default)();
        if (this.mongoURI) {
            typegoose_1.mongoose
                .connect(this.mongoURI, {
                autoIndex: false,
                maxPoolSize: 250,
                serverSelectionTimeoutMS: 15000,
                connectTimeoutMS: 15000,
            })
                .then(() => console.log('Connected to MongoDB'));
        }
        else {
            console.log('Failed to connect to MongoDB');
        }
        typegoose_1.mongoose.set('returnOriginal', false);
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json({ limit: '50mb' }));
        this.app.use(express_1.default.urlencoded({ extended: false, limit: '50mb' }));
        this.app.use('/api/users', user_1.default);
        this.app.use('/api/login', login_1.default);
        this.app.use('/api/schedules', auth_1.default, schedule_1.default);
    }
}
exports.default = { express: new MealPlannerAPI().app, db: typegoose_1.mongoose.connection };
//# sourceMappingURL=app.js.map