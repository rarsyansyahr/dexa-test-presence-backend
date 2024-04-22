import { Router } from "express";
import { PositionController } from "../controllers";

const router = Router();

router.get("/", PositionController.getAll);

export { router as PositionRouter };
