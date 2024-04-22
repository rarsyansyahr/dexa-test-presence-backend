import { Router } from "express";
import { PresenceController } from "../controllers";

const router = Router();

router.get("/:employee_id", PresenceController.getAll);
router.post("/", PresenceController.presence);
router.get("/:employee_id/status", PresenceController.checkPresence);

export { router as PresenceeRouter };
