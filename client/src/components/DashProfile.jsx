import { useSelector } from "react-redux";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useState, React, useRef, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbar } from "react-circular-progressbar";
import {
  updateStart,
  updateFailure,
  updateSuccess,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signoutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashProfile() {
  const { currentUser, error } = useSelector((state) => state.user);

  //上传profilePicture
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
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  // console.log(formData);
  console.log(currentUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    console.log(formData);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(
        `api/user/update/${
          currentUser.rest ? currentUser.rest._id : currentUser._id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
    console.log({ currentUser });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageURL(URL.createObjectURL(file));
    }
  };
  const dispatch = useDispatch();

  //后端上传图片
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  const uploadImage = async () => {
    setImageFileUploading(true);
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
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageURL(downloadURL);
          // 上传成功后，将图片地址存储到formData中
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
    //需要
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/
        ${currentUser.rest ? currentUser.rest._id : currentUser._id}`,
      {
        method: "DELETE",
      });
      const data = await res.json();
      if(!res.ok){
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess());
        
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try{
      console.log("signout");
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if(!res.ok){
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        
      }
    } catch (error){
      console.log(error);
    }
  };
  //currentUser里面有rest 要用 currentUser.rest.username
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            src={
              currentUser.rest
                ? imageFileURL || currentUser.rest.profilePicture
                : imageFileURL || currentUser.profilePicture
            }
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
          defaultValue={
            currentUser.rest ? currentUser.rest.username : currentUser.username
          }
          onChange={handleChange}
        ></TextInput>
        <TextInput
          type="email "
          id="email"
          placeholder="email"
          defaultValue={
            currentUser.rest ? currentUser.rest.email : currentUser.email
          }
          onChange={handleChange}
        ></TextInput>
        <TextInput
          type="password "
          id="password"
          placeholder="password"
          defaultValue="*********"
          onChange={handleChange}
        ></TextInput>
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span onClick={handleSignout} className="cursor-pointer">Sign Out</span>
      </div>
      {updateUserSuccess && <Alert color="success">{updateUserSuccess}</Alert>}
      {updateUserError && <Alert color="failure">{updateUserError}</Alert>}
      {error && <Alert color="failure">{error}</Alert>}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle
              className="h-14 w-14 text-5xl text-gray-400
             dark:text-gray-200 mb-4 mx-auto"
            />
            <h3
              className="mb-5 text-lg text-gray-500 
            dark:text-gray-400"
            >
              Are you sure to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
