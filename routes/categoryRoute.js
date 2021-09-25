import { Router } from "express";
import { categoryController } from "../controllers/indexController";

const router = Router();

router.get("/", categoryController.findAllCategory);
router.get("/raw-sql", categoryController.findCategoryBySQL);
router.get("/:cate_id", categoryController.findCategoryById);
router.post("/", categoryController.createCategory);
router.put("/:cate_id", categoryController.updateCategory);
router.delete("/:cate_id", categoryController.deleteCategory);

export default router;