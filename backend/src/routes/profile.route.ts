import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getProfile,
  updateAppearance,
  updateBio,
  updateDisplayName,
  updatePassword,
  updateProfile,
  updateProfileVisibility,
  updateUsername,
} from "../controllers/profile.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", getProfile);
router.patch("/", updateProfile);
router.put("/preferences", updateAppearance);
router.patch("/username", updateUsername);
router.patch("/password", updatePassword);
router.patch("/visibility", updateProfileVisibility);
router.patch("/displayName", updateDisplayName);
router.patch("/updateBio", updateBio);

export default router;
