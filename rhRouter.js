import express from "express";
import * as rhController from "../controllers/rhController.js";
const rhRouter = express.Router();

rhRouter.post("/login", rhController.login);
rhRouter.post("/ajouterRh", rhController.ajouterRh);

export default rhRouter;
