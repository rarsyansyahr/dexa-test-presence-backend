import { Request, Response } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${uuidv4()}.${ext}`);
  },
});

const upload = multer({ storage });
const uploadedFile = upload.single("photo");

const uploadFile = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.status(200).json({
    filename: req.file.filename,
  });
};

const showUploadedFile = (req: Request, res: Response) => {
  const filename = req.params.filename;
  const filePath = path.join("uploads", filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(path.resolve(filePath));
  } else {
    res.status(404).json({ error: "File not found" });
  }
};

export const FileController = { uploadFile, uploadedFile, showUploadedFile };
