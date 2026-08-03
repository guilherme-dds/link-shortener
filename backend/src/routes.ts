import { Router } from "express";
import { UserController } from "./controller/UserController";
import { AuthController } from "./controller/AuthController";

const usercontroller = new UserController();
const authcontroller = new AuthController();

export const router = Router();

router.post("/create", usercontroller.store);
router.get("/users", usercontroller.index);
router.post("/auth", authcontroller.authenticate);
