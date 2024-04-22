import { Router } from "express";
import { AuthController } from "../controllers";
import { JwtAuth } from "../middlewares";

const router = Router();

router.post("/login", AuthController.login);
router.get("/profile", JwtAuth, AuthController.profile);

export { router as AuthRouter };
