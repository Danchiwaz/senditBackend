import { LogError } from "concurrently";
import { request, Request, Response } from "express";
import pool from "../Database/config/config";
import parseDbData, {
  parseDataToRow,
  parseSendReceivedParcels,
} from "../Helpers/DatabaseHelpers/parseDbData";
import { ParcelSavingSchema } from "../Helpers/ParcelValidation/parcelVlaidation";

export interface ExtendedRequest extends Request {
  body: {
    sender: string;
    receiver: string;
    weight: string;
    price: number;
    fromlocation: any;
    tolocation: any;
    trackingno: string;
    pickdate: string;
    arrivaldate: string;
  };
}
// function to insert a parcel using stored procedure


export const insertParcel = async (req: ExtendedRequest, res: Response) => {
  try {
    const { value } = ParcelSavingSchema.validate(req.body);
    await pool.query(`CALL public.parcelSave(
	NULL,
	'${value.sender}',
	'${value.receiver}',
	'${value.weight}',
	${value.price},
	'${JSON.stringify(value.fromlocation)}',
	'${JSON.stringify(value.tolocation)}',
 '${value.trackingno}',
 '${value.pickdate}',
 '${value.arrivaldate}',
	0
)`);
    res.status(200).json({
      message: "Parcel Saved successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Parcels Failed to Save",
    });
  }
};
// end of function to insert a parcel using stored procedure

// start of the function get all parcels in the database
export const getallParcels = async (req: Request, res: Response) => {
  try {
    let parcels = await pool.query(
      "SELECT * FROM parcels where isDeleted='no'"
    );

    parcels = parseDataToRow(parcels);
    parcels.forEach((parcel: any) => {
      parcel.fromlocation = JSON.parse(parcel.fromlocation);
      parcel.tolocation = JSON.parse(parcel.tolocation);
    });

    res.json(parcels);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
// end  of the function get all parcels in the database





// start of the function update a specific parcel in the database
export const updateParcel = async (req: ExtendedRequest, res: Response) => {
  try {
    let id = req.params.id;
    const { value } = ParcelSavingSchema.validate(req.body);
    const updatedParcel = await pool.query(
      `CALL public.parcelSave(
	'${id}',
	'${value.sender}',
	'${value.receiver}',
	'${value.weight}',
	 ${value.price},
	'${JSON.stringify(value.fromlocation)}',
	'${JSON.stringify(value.tolocation)}',
  '${value.trackingno}',
  '${value.pickdate}',
  '${value.arrivaldate}',
	1
)`
    );
    console.log(updatedParcel);
    res.status(200).json({
      message: "You have Updated the project successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to Update the Parcel",
    });
  }
};
// start of the function update a specific parcel in the database

// function to update parcel on delivery

// end of the function to update parcel on delivery

export const updateParcelOnDelivery = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await pool.query(`CALL public.UpdateParcelOnDelivery('${id}')`);
    res.status(200).json({
      message: "Parcel Delivered Successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
// end of the function to update the parcel


// start of the function to soft delete a parcel


export const deleteParcel = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await pool.query(`CALL public.DeleteParcel('${id}')`);
    res.status(200).json({
      message: "Parcel Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while deleting the parcel",
    });
  }
};


// end of the function to update a parcel using soft delete

// function to getll all users from the database

export const getAllClientsFromTheDb = async (req: Request, res: Response) => {
  try {
    let allUsers = await pool.query(`SELECT public.GetAllUsersInTheDb()`);
    allUsers = parseSendReceivedParcels(allUsers, "getallusersinthedb");
    return res.status(200).json(allUsers);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// end of the function to get all users from the database
