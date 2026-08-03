import { Router } from "express";
import { UserController } from "./controller/UserController";

const usercontroller = new UserController();

export const router = Router();

router.post("/create", usercontroller.store);
