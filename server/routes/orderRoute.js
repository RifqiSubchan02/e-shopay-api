import { Router } from "express";
import { orderController } from "../controllers/indexController";

const router = Router();

router.post("/:cart_id", orderController.checkoutOrder);

export default router;