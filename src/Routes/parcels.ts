import { Router } from "express";
import {
  deleteParcel,
  getAllClientsFromTheDb,
  getAllDeliveredParcels,
  getallParcels,
  getAllParcelsOnDelivery,
  insertParcel,
  updateParcel,
  updateParcelOnDelivery,
} from "../controllers/parcels";
import { requireAuth } from "../middleware/authMiddleware";

const parcelRouter = Router();

parcelRouter.post("/", requireAuth, insertParcel);
parcelRouter.get("/", requireAuth, getallParcels);
parcelRouter.get("/ondelivery", requireAuth, getAllParcelsOnDelivery);
parcelRouter.get("/delivered", requireAuth, getAllDeliveredParcels);
parcelRouter.put("/:id", requireAuth, updateParcel);
parcelRouter.get("/clients", requireAuth, getAllClientsFromTheDb);
parcelRouter.delete("/:id", requireAuth, deleteParcel);
parcelRouter.put("/delivered/:id", requireAuth, updateParcelOnDelivery);

export default parcelRouter;
