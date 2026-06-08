import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getLinks,
  createLink,
  modifyLink,
  toggleLink,
  deleteLink,
} from "../controllers/links.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", getLinks);
router.post("/", createLink);
router.put("/update", modifyLink);
router.patch("/toggle", toggleLink);
router.delete("/delete/:id", deleteLink);

export default router;
