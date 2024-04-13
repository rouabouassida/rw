import express from "express";
const userRouter = express.Router();
import * as userController from "../controllers/userController.js";

userRouter.post("/account", userController.rhAccount);
userRouter.post("/login", userController.login);
userRouter.post("/ajouterEmploye", userController.ajouterEmploye);
userRouter.delete("/supprimerEmploye", userController.supprimerEmploye);

export default userRouter;
