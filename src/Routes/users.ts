import { Router } from "express";
import { createUser, getAllParcelsAsSender, getAllParelsAsSender, getAllUsers, loginUser, logoutUser } from "../controllers/User";

const userRoutes = Router()


userRoutes.post("/", createUser);
userRoutes.get("/", getAllUsers);
userRoutes.post("/login", loginUser);
userRoutes.get("/logout", logoutUser);
userRoutes.get("/receivedParcels/:username", getAllParelsAsSender);
userRoutes.get("/sentParcels/:username", getAllParcelsAsSender);


export default userRoutes;loginUser;