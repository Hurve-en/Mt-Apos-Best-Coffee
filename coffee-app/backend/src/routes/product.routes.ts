import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from "../controllers/product.controller.ts";
import { upload } from "../config/multer.config.ts";
import { requireAdmin, requireAuth } from "../middleware/auth.middleware.ts";

const router = Router();

router.use(requireAuth);

router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", requireAdmin, upload.single("image"), createProduct);
router.put("/:id", requireAdmin, upload.single("image"), updateProduct);
router.delete("/:id", requireAdmin, deleteProduct);

export default router;
