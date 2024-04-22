import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  return res.json({
    name: "Precense Backend App",
    status: "running",
  });
});

export { router as AppRouter };
