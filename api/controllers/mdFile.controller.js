import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
export const uploadMdFile = async (req, res) => {
  //let fileUrl = '';
  console.log('Controller req', req);
  console.log('req.file', req.file);
  if (!req.file) {
    return res.status(400).json({ code: 1, message: '上传失败' });
  }
  const storage = getStorage(app);
  console.log('storage', storage);
  const fileName = new Date().getTime() + "-" + req.file.originalname;
  //生成ref
  const storageRef = ref(storage, fileName);
  console.log(req.file.buffer);
  //创建上传任务
  const uploadTask = uploadBytesResumable(storageRef, req.file.buffer,{contentType: req.file.mimetype});
  uploadTask.on(
  "state_changed",
    //通过快照获取上传进度
    (snapshot) => {
      console.log('snapshot', snapshot);
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    },
    (error) => {
      console.log('error uploading file in md.controller.js',error);
      res.status(400);
    },
    //上传到firebase后获取下载链接
    () => {
      console.log('before');
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        //fileUrl = downloadURL;
        console.log('fileUrl in controller', fileUrl);
          // 返回图片的访问 URL
        res.json({
          code: 0,
          fileUrl: downloadURL,
        })
      });
    }
  );


  /*
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }
    
      // 生成一个唯一文件名并上传到 Firebase Storage
      const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
      const file = bucket.file(fileName);
    
      try {
        // 将文件上传到 Firebase Storage
        await file.save(req.file.buffer, {
          metadata: {
            contentType: req.file.mimetype,
          },
        });
    
        // 获取文件的访问 URL
        const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
    
        // 将图片的 URL 存储到 Firestore
        const docRef = await db.collection('images').add({
          imageUrl: downloadURL,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
    
        // 返回上传成功的信息
        res.json({ message: 'File uploaded successfully', imageUrl: downloadURL, docId: docRef.id });
      } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Something went wrong while uploading the file' });
      }
    */
}