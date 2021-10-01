import formidable from "formidable";
import fs from "fs";
import path from "path";
import { nextTick } from "process";
import upDownloadHelper from "../helpers/upDownloadHelper";

const findAllProduct = async (req, res) => {
  try {
    const result = await req.context.models.products.findAll();
    return res.send(result);
  } catch (error) {
    return res.sendStatus(404).send("Data not found");
  }
}

const createProduct = async (req, res) => {
  // process.cwd return value working directory
  // __dir return value module directory
  const uploadDir = process.cwd() + process.env.UPLOAD_DIR;

  const options = {
    multiples: true,
    keepExtensions: true,
    uploadDir: uploadDir,
    maxFileSize: 50 * 1024 * 1024, // 5MB
  };

  // object formidable
  const form = formidable(options);

  // onPart override stream sebelum di write ke folder
  form.onPart = function (part) {
    if (!part.filename || part.filename.match(/\.(jpg|jpeg|png)$/i)) {
      this.handlePart(part);
    } else {
      form._error(new Error("File type is not supported"));
    }
  }

  form.parse(req, async (error, fields, files) => {
    if (error) {
      return res.status(400).json({
        status: "Error",
        message: error.message,
        error: null
      })
    }

    if (files.uploadFile.length > 1) {
      return res.status(400).json({
        status: "Error",
        message: "Only 1 file allowed",
        error: null
      })
    }

    const uploadFile = files.uploadFile.path;
    const sep = path.sep;
    const urlImage = uploadFile.substr(uploadFile.lastIndexOf(sep), uploadFile.length).replace(sep, "");

    try {
      const result = await req.context.models.products.create({
        prod_name: fields.prod_name,
        prod_price: fields.prod_price,
        prod_desc: fields.prod_desc,
        prod_rating: parseInt(fields.prod_rating),
        prod_view_count: parseInt(fields.prod_view_count),
        prod_stock: parseInt(fields.prod_stock),
        prod_user_id: parseInt(fields.prod_user_id),
        prod_cate_id: parseInt(fields.prod_cate_id),
        prod_url_image: urlImage
      });

      return res.send(result);
    } catch (err) {
      return res.status(400).json({
        status: "Failed",
        message: "Bad",
        error: err
      });
    }
  })
};

const updateProuct = async (req, res) => {
  const { prod_id } = req.params;
  try {
    const singlePart = await upDownloadHelper.uploadSingleFile(req);
    const { attrb: { file, fields, filename }, status: { status } } = singlePart;
    if (status === "Succeed") {
      try {
        const result = await req.context.models.products.update(
          {
            prod_name: fields.prod_name,
            prod_price: fields.prod_price,
            prod_desc: fields.prod_desc,
            prod_rating: parseInt(fields.prod_rating),
            prod_view_count: parseInt(fields.prod_view_count),
            prod_stock: parseInt(fields.prod_stock),
            prod_user_id: parseInt(fields.prod_user_id),
            prod_cate_id: parseInt(fields.prod_cate_id),
            prod_url_image: filename
          },
          {
            returning: true,
            where: {
              prod_id: parseInt(prod_id)
            }
          }
        );
        return res.send(result);
      } catch (error) {
        return res.sendStatus(404).send(error);
      }
    }
  } catch (error) {
    return res.sendStatus(404).send(error);
  }
}

const createProductImage = async (req, res, next) => {
  try {
    const multiPart = await upDownloadHelper.uploadMultipleFile(req);
    const { attrb: { files, fields }, status: { status } } = multiPart;
    try {
      const result = await req.context.models.products.create({
        prod_name: fields.prod_name,
        prod_price: fields.prod_price,
        prod_desc: fields.prod_desc,
        prod_rating: parseInt(fields.prod_rating),
        prod_view_count: parseInt(fields.prod_view_count),
        prod_stock: parseInt(fields.prod_stock),
        prod_user_id: parseInt(fields.prod_user_id),
        prod_cate_id: parseInt(fields.prod_cate_id),
        prod_url_image: ""
      });

      // simpan prodId di object req
      req.prodId = result.dataValues.prod_id;
      req.files = files;
      next();
    } catch (error) {

    }
  } catch (error) {

  }
}

export default { findAllProduct, createProduct, updateProuct, createProductImage };