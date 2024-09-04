import { useState, useRef, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import "react-circular-progressbar/dist/styles.css";
import { Alert } from "flowbite-react";

//
export default function ProfileImageUploader({ currentUser, setFormData }) {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageURL] = useState(null);


  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(0);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  //创建引用 在别处调用
  const filePickerRef = useRef(null);

  console.log(currentUser);

  //filechange 就上传
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageURL(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
   //开始上传
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + imageFile.name;
    //生成ref
    const storageRef = ref(storage, fileName);
    //创建上传任务
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      //通过快照获取上传进度
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadingProgress(0);
        setImageFile(null);
        setImageURL(null);
        setImageFileUploading(false);
      },
      //上传到firebase后获取下载链接
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageURL(downloadURL);
          setFormData((prevData) => ({
            ...prevData,
            profilePicture: downloadURL,
          }));
          setImageFileUploading(false);
        });
      }
    );
  };

  console.log(imageFileUploading);
  return (
    <div className="flex justify-center items-center">
      <div
        className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
        onClick={() => filePickerRef.current.click()}
      >
        {/* 文件上传 通过引用转移到对该div的点击 */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        {imageFileUploadingProgress > 0 && (
          <CircularProgressbar
            value={imageFileUploadingProgress}
            text={`${imageFileUploadingProgress}%`}
            strokeWidth={1}
            styles={{
              root: {
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
              },
              path: {
                stroke: `rgba(62,152,199, ${
                  imageFileUploading ? imageFileUploadingProgress / 100 : 1
                })`,
              },
            }}
          />
        )}
        <img
          src={imageFileURL || currentUser.profilePicture}
          alt="user"
          className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
            imageFileUploading
              ? imageFileUploadingProgress < 100 && "opacity-60"
              : ""
          }`}
        />
        {imageFileUploadError && (
          <Alert color="failure" className="mt-2">
            {imageFileUploadError}
          </Alert>
        )}
      </div>
    </div>
  );
}
