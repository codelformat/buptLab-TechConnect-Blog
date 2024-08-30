import { useSelector } from "react-redux";
import { Button, TextInput } from "flowbite-react";
import { useState, React, useRef, useEffect } from "react";
import { set } from "mongoose";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  //上传profiePicture
  const [imageFile, setImageFile] = useState(null);
  //不直接传图片 而是给出地址
  const [imageFileURL, setImageURL] = useState(null);
  //转换链接 把对fileInput的引用传给filePickerRef
  const filePickerRef = useRef(null);

  const [formdata, setFormdata] = useState({});
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
    console.log("uploading image");
    //需要
  };
  const   handleChange = (e) => {};

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
          className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          <img
            src={imageFileURL || currentUser.rest.profiePicture}
            alt="user"
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
          ></img>
        </div>
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
          onChange={handleChange}
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
