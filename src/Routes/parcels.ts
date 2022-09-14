import { Router } from "express";
import { deleteParcel, getallParcels, insertParcel, updateParcel } from "../controllers/parcels";
import { requireAuth } from "../middleware/authMiddleware";

const parcelRouter = Router()


parcelRouter.post("/", requireAuth, insertParcel);
parcelRouter.get("/",requireAuth, getallParcels);
parcelRouter.put("/:id", requireAuth, updateParcel);
parcelRouter.delete("/:id", requireAuth, deleteParcel);




export default parcelRouter;