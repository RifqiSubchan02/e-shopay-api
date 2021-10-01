import { Router } from "express";
import { productController, productImageController } from "../controllers/indexController";
import upDownloadHelper from "../helpers/upDownloadHelper";

const router = Router();

router.get("/", productController.findAllProduct);
router.get("/images/:filename", upDownloadHelper.showProductImage);
router.post("/", productController.createProduct);
router.post("/multipart", productController.createProductImage, productImageController.createProducImage, productImageController.findProdImagesById);
router.put("/:prod_id", productController.updateProuct);

export default router;