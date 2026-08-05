import { Router } from "express";
import { UserController } from "./controller/UserController";
import { AuthController } from "./controller/AuthController";
import { LinkController } from "./controller/LinkController";
import { AuthMiddleware } from "./middlewares/auth";

const usercontroller = new UserController();
const authcontroller = new AuthController();
const linkcontroller = new LinkController();

export const router = Router();

router.post("/create", usercontroller.store);
router.get("/users", AuthMiddleware, usercontroller.index);
router.post("/auth", authcontroller.authenticate);

router.post("/api/links", AuthMiddleware, linkcontroller.shorten);
router.get("/api/links", AuthMiddleware, linkcontroller.findAll);
router.get("/api/links/:id", AuthMiddleware, linkcontroller.findById);

router.get("/:shortUrl", linkcontroller.redirect);
