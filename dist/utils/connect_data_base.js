"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
// const mongoose = require('mongoose')
const mongoose_1 = __importDefault(require("mongoose"));
const connect = async () => {
    try {
        const db = await mongoose_1.default.connect("mongodb+srv://anwarpluton:VMfEfEQymYL4ssZt@cluster0.q7gvt.mongodb.net/Credo");
        console.log(`DB connected: ${db.connection.host} `);
    }
    catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if connection fails
    }
};
exports.connect = connect;
//# sourceMappingURL=connect_data_base.js.map