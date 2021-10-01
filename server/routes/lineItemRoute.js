import { Router } from "express";
import { lineItemController } from "../controllers/indexController";

const router = Router();

router.get("/", lineItemController.findAllLineItems);
router.get("/:cart_id", lineItemController.findLineItemsByCartId);
router.put("/:cart_id", lineItemController.updateLineItemsQuantity);
router.delete("/:cart_id", lineItemController.deleteLineItem)


export default router;