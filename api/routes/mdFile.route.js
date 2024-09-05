// /api/routes/mdFile.route.js
import express from 'express';
import multer from  'multer';
import { uploadMdFile } from '../controllers/mdFile.controller.js';
const upload = multer({ storage: multer.memoryStorage() });  // 将文件保存在内存中，便于直接上传到 Firebase

const router = express.Router();
router.post("/mdfile", upload.single('file'), uploadMdFile);
export default router;