import { request, Request, Response } from "express";
import pool from "../Database/config/config";
import { parseDataToRow } from "../Helpers/DatabaseHelpers.ts/parseDbData";

export interface ExtendedRequest extends Request {
  body: {
    sender: string;
    receiver: string;
    weight: string;
    price: number;
    fromlocation: any;
    tolocation: any;
    trackingno: string;
  };
}
// function to insert a parcel using stored procedure
export const insertParcel = async (req: ExtendedRequest, res: Response) => {
  try {
    const {
      sender,
      receiver,
      weight,
      price,
      fromlocation,
      tolocation,
      trackingno,
    } = req.body;
    const newParcel = await pool.query(`CALL public.parcelSave(
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
  } catch (error) {
    console.log(error);
    res.json({
      message: "Parcels Failed to Save",
    });
  }
};
// end of function to insert a parcel using stored procedure

// start of the function get all parcels in the database
export const getallParcels = async (req: Request, res: Response) => {
  try {
    let projects = await pool.query(
      "SELECT * FROM parcels where isDeleted='no'"
    );

    projects = parseDataToRow(projects);
    res.json(projects);
  } catch (error) {
    res.json({
      error: error,
    });
  }
};
// end  of the function get all parcels in the database

// start of the function update a specific parcel in the database
export const updateParcel = async (req: ExtendedRequest, res: Response) => {
  try {
    let id = req.params.id;
    const {
      sender,
      receiver,
      weight,
      price,
      fromlocation,
      tolocation,
      trackingno,
    } = req.body;
    const updatedParcel = await pool.query(
      `CALL public.parcelSave(
	'${id}',
	'${sender}',
	'${receiver}',
	'${weight}',
	${price},
	'${JSON.stringify(fromlocation)}',
	'${JSON.stringify(tolocation)}',
    '${trackingno}',
	1
)`
    );
    res.json({
      message: "You have Updated the project successfully",
    });
  } catch (error) {
    res.json({
      error: "Failed to Updat the Parcel",
    });
  }
};
// start of the function update a specific parcel in the database

// start of the function to soft delete a parcel
export const deleteParcel = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await pool.query(`CALL public.DeleteParcel('${id}')`);
    res.json({
      message: "Parcel Deleted Successfully",
    });
  } catch (error) {
    res.json({
      message: "An error occurred while deleting the parcel",
    });
  }
};
// end of the function to update a parcel using soft delete
