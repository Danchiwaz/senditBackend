import { Router } from "express";
import { deleteParcel, getAllClientsFromTheDb, getallParcels, insertParcel, updateParcel, updateParcelOnDelivery } from "../controllers/parcels";
import { requireAuth } from "../middleware/authMiddleware";

const parcelRouter = Router()


parcelRouter.post("/", requireAuth,insertParcel);
parcelRouter.get("/", requireAuth,getallParcels);
parcelRouter.put("/:id", requireAuth,updateParcel);
parcelRouter.get("/clients", requireAuth,getAllClientsFromTheDb);
parcelRouter.delete("/:id", requireAuth, deleteParcel);
parcelRouter.put("/delivered/:id", requireAuth, updateParcelOnDelivery);




export default parcelRouter;