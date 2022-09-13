import { Router } from "express";
import { deleteParcel, getallParcels, insertParcel, updateParcel } from "../controllers/parcels";

const parcelRouter = Router()


parcelRouter.post("/", insertParcel);
parcelRouter.get("/", getallParcels);
parcelRouter.put("/:id", updateParcel);
parcelRouter.delete("/:id", deleteParcel);




export default parcelRouter;