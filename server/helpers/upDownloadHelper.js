import { rejects } from "assert";
import formidable from "formidable";
import fs from "fs";
import path from "path";


const uploadDir = process.cwd() + process.env.UPLOAD_DIR;

const uploadSingleFile = async (req) => {
  // process.cwd return value working directory
  // __dir return value module directory

  const options = {
    multiples: true,
    keepExtensions: true,
    uploadDir: uploadDir,
    maxFileSize: 50 * 1024 * 1024, // 5MB
  };

  // object formidable
  const form = formidable(options);

  // declare promises variable
  const result = new Promise((resolve, reject) => {
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
        return reject({
          status: "Error",
          message: error
        })
      }

      const uploadFile = files.uploadFile.path;
      const sep = path.sep;
      const filename = uploadFile.substr(uploadFile.lastIndexOf(sep), uploadFile.length).replace(sep, "");

      return resolve({
        attrb: {
          file: files.uploadFile,
          fields: fields,
          filename: filename
        },
        status: {
          status: "Succeed",
          message: ""
        }
      })
    })
  });

  return result;
}

const uploadMultipleFile = async (req) => {
  // process.cwd return value working directory
  // __dir return value module directory

  const options = {
    multiples: true,
    keepExtensions: true,
    uploadDir: uploadDir,
    maxFileSize: 50 * 1024 * 1024, // 5MB
  };

  // object formidable
  const form = formidable(options);

  // declare promises variable
  const result = new Promise((resolve, reject) => {
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
        return reject({
          status: "Error",
          message: error
        })
      }

      let listOfFiles = [];

      if (files) {
        let fileAttr = {
          prim_id: 0,
          prim_filename: "",
          prim_filesize: 0,
          prim_filetype: "",
          prim_url: "",
          prim_primary: false
        }

        const sep = path.sep;
        let uploadFile = "";
        let fileName = "";

        files.uploadFile.forEach((el) => {
          uploadFile = el.path;
          fileName = uploadFile.substring(uploadFile.lastIndexOf(sep), uploadFile.length).replace(sep, "");

          let fileAttr = {
            prim_id: 0,
            prim_filename: fileName,
            prim_filesize: el.size,
            prim_filetype: el.type,
            prim_url: process.env.URL_IMAGE + fileName,
            prim_primary: false
          }

          listOfFiles = [...listOfFiles, fileAttr];
        })

      }


      return resolve({
        attrb: {
          files: listOfFiles,
          fields: fields,
        },
        status: {
          status: "Succeed",
          message: ""
        }
      })
    })
  });

  return result;
}

const showProductImage = async (req, res) => {
  const fileName = req.params.filename;
  const url = process.cwd() + process.env.UPLOAD_DIR + "\\" + fileName;
  fs.createReadStream(url)
    .on("error", () => responseNotFound(req, res))
    .pipe(res);
};

function responseNotFound(req, res) {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
};


export default { uploadSingleFile, showProductImage, responseNotFound, uploadMultipleFile };