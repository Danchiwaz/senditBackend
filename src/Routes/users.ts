import { Router } from "express";
import { createUser, getAllUsers } from "../controllers/User";

const userRoutes = Router()


userRoutes.post("/", createUser);
userRoutes.get("/", getAllUsers);


export default userRoutes;