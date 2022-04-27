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
const schedule_1 = __importDefault(require("../models/schedule"));
const lodash_1 = require("lodash");
const async_mutex_1 = require("async-mutex");
const express = __importStar(require("express"));
const router = express.Router();
let requested = false;
const mutex = new async_mutex_1.Mutex();
const schedulesMap = {};
router.get('/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!requested) {
        const schedules = yield schedule_1.default.find({});
        schedules.map((schedule) => (schedulesMap[schedule._id] = (0, lodash_1.cloneDeep)(schedule)));
        requested = true;
    }
    return res.status(200).json(Array.from(Object.values(schedulesMap)));
}));
router.post('/createSchedule', (req, res) => {
    const schedule = new schedule_1.default(req.body.schedule);
    mutex.acquire().then((release) => {
        schedule
            .save()
            .then((savedSchedule) => {
            if (requested)
                schedulesMap[savedSchedule._id] = (0, lodash_1.cloneDeep)(savedSchedule.toJSON());
            release();
            return res
                .status(201)
                .json({ message: 'Agendamento cadastrado com sucesso!' });
        })
            .catch((err) => {
            release();
            return res.status(500).json({
                message: 'Erro ao cadastrar agendamento!',
                error: err,
            });
        });
    });
});
exports.default = router;
//# sourceMappingURL=schedule.js.map