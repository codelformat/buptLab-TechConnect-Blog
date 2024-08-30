import { useSelector } from "react-redux";
import { Alert, Button, TextInput } from "flowbite-react";
import { useState, React, useRef, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { set } from "mongoose";
import { app } from "../firebase";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbar } from "react-circular-progressbar";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  //上传profiePicture
  const [imageFile, setImageFile] = useState(null);
  //不直接传图片 而是给出地址
  const [imageFileURL, setImageURL] = useState(null);
  //转换链接 把对fileInput的引用传给filePickerRef
  const filePickerRef = useRef(null);
  // 图片上传进度钩子
  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(0);
  // 图片上传错误钩子
  const [imageFileUploadError, setImageFileUploadError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageURL(URL.createObjectURL(file));
    }
  };
  //后端上传图片
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  const uploadImage = async () => {
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageURL(downloadURL);
        });
      }
    );
    //需要
  };

  //currentUser里面有rest 要用 currentUser.rest.username
  //数据库里没有profilePicture 有profiePicture
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadingProgress && (
            <CircularProgressbar
              value={imageFileUploadingProgress || 0}
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
                    imageFileUploadingProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileURL || currentUser.rest.profiePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] 
            ${
              imageFileUploadingProgress &&
              imageFileUploadingProgress < 100 &&
              "opacity-60"
            }`}
          ></img>
        </div>

        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}

        <TextInput
          type="text "
          id="username"
          placeholder="username"
          defaultValue={currentUser.rest.username}
        ></TextInput>
        <TextInput
          type="email "
          id="email"
          placeholder="email"
          defaultValue={currentUser.rest.email}
        ></TextInput>
        <TextInput
          type="password "
          id="password"
          placeholder="password"
          defaultValue="*********"
        ></TextInput>
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
        <div className="text-red-500 flex justify-between mt-5">
          <span className="cursor-pointer">Delete Account</span>
          <span className="cursor-pointer">Sign Out</span>
        </div>
      </form>
    </div>
  );
}
