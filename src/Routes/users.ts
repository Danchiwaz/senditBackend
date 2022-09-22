import { Router } from "express";
import { createUser, getAllParcelsAsSender, getAllParelsAsReceiver, getAllUserParcels, getAllUsers, loginUser, logoutUser } from "../controllers/User";
import { requireAuth } from "../middleware/authMiddleware";

const userRoutes = Router()


userRoutes.post("/", createUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/logout", logoutUser);
userRoutes.get("/allparcels/:username",requireAuth, getAllUserParcels);
userRoutes.get("/", requireAuth, getAllUsers);
userRoutes.get( "/receivedParcels/:username",requireAuth,getAllParelsAsReceiver);
userRoutes.get("/sentParcels/:username", requireAuth, getAllParcelsAsSender);


export default userRoutes;loginUser;