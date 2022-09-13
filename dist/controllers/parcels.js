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
exports.deleteParcel = exports.updateParcel = exports.getallParcels = exports.insertParcel = void 0;
const config_1 = __importDefault(require("../Database/config/config"));
// function to insert a parcel using stored procedure
const insertParcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sender, receiver, weight, price, fromlocation, tolocation, trackingno, } = req.body;
        const newParcel = yield config_1.default.query(`CALL public.parcelSave(
	NULL,
	'${sender}',
	'${receiver}',
	'${weight}',
	${price},
	'${JSON.stringify(fromlocation)}',
	'${JSON.stringify(tolocation)}',
    '${trackingno}',
	0
)`);
        console.log(newParcel);
        res.json({
            message: "Parcel Saved successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            message: "Parcels Failed to Save",
        });
    }
});
exports.insertParcel = insertParcel;
// end of function to insert a parcel using stored procedure
// start of the function get all parcels in the database
const getallParcels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projects = yield config_1.default.query("SELECT * FROM parcels where isDeleted='no'");
        console.log(projects);
        projects = projects.rows;
        res.json(projects);
    }
    catch (error) {
        res.json({
            error: error,
        });
    }
});
exports.getallParcels = getallParcels;
// end  of the function get all parcels in the database
// start of the function update a specific parcel in the database
const updateParcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = req.params.id;
        const { sender, receiver, weight, price, fromlocation, tolocation, trackingno, } = req.body;
        const updatedParcel = yield config_1.default.query(`CALL public.parcelSave(
	'${id}',
	'${sender}',
	'${receiver}',
	'${weight}',
	${price},
	'${JSON.stringify(fromlocation)}',
	'${JSON.stringify(tolocation)}',
    '${trackingno}',
	1
)`);
        res.json({
            message: "You have Updated the project successfully",
        });
    }
    catch (error) {
        res.json({
            error: "Failed to Updat the Parcel",
        });
    }
});
exports.updateParcel = updateParcel;
// start of the function update a specific parcel in the database
// start of the function to soft delete a parcel
const deleteParcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const parcelForDelete = yield config_1.default.query(`CALL public.DeleteParcel('${id}')`);
        res.json({
            message: "Parcel Deleted Successfully",
        });
    }
    catch (error) {
        res.json({
            message: "An error occurred while deleting the parcel",
        });
    }
});
exports.deleteParcel = deleteParcel;
// end of the function to update a parcel using soft delete
