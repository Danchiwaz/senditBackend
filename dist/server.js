"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const parcels_1 = __importDefault(require("./Routes/parcels"));
const app = (0, express_1.default)();
// cor headers to enable node receive request from external sources 
const corsOptions = { credentials: true, origin: process.env.URL || "*" };
app.use(express_1.default.json()); //explicitly define the expected results 
app.use((0, cors_1.default)(corsOptions));
app.use('/parcels', parcels_1.default);
app.use((error, req, res, next) => {
    res.json({
        Error: error.message,
    });
});
// starting the server 
app.listen(5000, () => {
    console.log("Serve is Listening to port 5000");
});
