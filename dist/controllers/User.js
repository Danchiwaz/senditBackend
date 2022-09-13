"use strict";
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
exports.getAllUsers = exports.createUser = void 0;
const config_1 = __importDefault(require("../Database/config/config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userValidation_1 = require("../Helpers/userValidation/userValidation");
const parseDbData_1 = __importDefault(require("../utils/parseDbData"));
// logic to add new user or user registration
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, username, email, password } = req.body;
        const { error, value } = userValidation_1.userRegistrationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }
        const results = yield config_1.default.query(`SELECT public.getUserByUsername('${value.username}')`);
        const checkUserEmail = yield config_1.default.query(`SELECT public.GetUserByEmail('${value.email}')`);
        const result = (0, parseDbData_1.default)(results, "getuserbyusername");
        if (result) {
            return res.json({
                message: "username already exists",
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(value.password, 10);
        yield config_1.default.query(`CALL public.userSave(
            NULL,
        '${value.fullname}',
        '${value.username}',
        '${value.email}',
        '${hashedPassword}',
        0
        )`);
        res.json({
            message: "You have successfully registered",
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            message: "Email already exist",
        });
    }
});
exports.createUser = createUser;
// end of logic for user registration
// logic to get all users
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let usernames = yield config_1.default.query(`SELECT username FROM users WHERE isdeleted = 'no'`);
        usernames = usernames.rows;
        res.json(usernames);
    }
    catch (error) {
        res.json({
            error: error,
        });
    }
});
exports.getAllUsers = getAllUsers;
// logic to get all users from the db
