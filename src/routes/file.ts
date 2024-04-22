import { Router } from "express";
import { FileController } from "../controllers";

const router = Router();

router.post("/", FileController.uploadedFile, FileController.uploadFile);
router.get("/:filename", FileController.showUploadedFile);

export { router as FileRouter };
