import { Router } from "express";
import { PresenceController } from "../controllers";

const router = Router();

router.post("/", PresenceController.presence);
router.get("/", PresenceController.getAll);
router.get("/:employee_id", PresenceController.getAll);
router.get("/:employee_id/status", PresenceController.checkPresence);

export { router as PresenceeRouter };
