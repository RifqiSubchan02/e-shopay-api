import { Router } from "express";
import { cartController, lineItemController } from "../controllers/indexController";

const router = Router();

router.get("/", cartController.findAllCart);
router.get("/:user_id", cartController.findCartByUserIdAndStatus);
router.post("/:user_id", cartController.checkCartExist, lineItemController.addLineItem);

export default router;