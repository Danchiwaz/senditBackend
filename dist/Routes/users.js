"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../controllers/User");
const userRoutes = (0, express_1.Router)();
userRoutes.post("/", User_1.createUser);
userRoutes.get("/", User_1.getAllUsers);
exports.default = userRoutes;
