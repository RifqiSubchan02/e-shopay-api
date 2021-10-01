import { Router } from "express";
import { userController } from "../controllers/indexController";

const router = Router();

router.get("/", userController.findAllUser);
router.get("/raw-sql", userController.findUserBySQL);
router.get("/:user_id", userController.findUserById);
router.post("/", userController.createUser);
router.put("/:user_id", userController.updateUser);
router.delete("/:user_id", userController.deleteUser);

export default router;