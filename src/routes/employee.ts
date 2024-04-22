import { Router } from "express";
import { EmployeController } from "../controllers";

const router = Router();

router.get("/", EmployeController.getAll);
router.get("/:id", EmployeController.getOne);
router.post("/", EmployeController.create);
router.put("/:id", EmployeController.update);

export { router as EmployeeRouter };
