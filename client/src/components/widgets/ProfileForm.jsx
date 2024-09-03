import { useState } from "react";
import { TextInput, Button, Alert } from "flowbite-react";
import { useDispatch } from "react-redux";
import { HiUser, HiMail, HiLockClosed } from "react-icons/hi";
import {
  updateStart,
  updateFailure,
  updateSuccess,
} from "../../redux/user/userSlice";

export default function ProfileForm({
  currentUser,
  imageFileUploading,
  formData,
  setFormData,
  setUpdateUserError,
  updateUserError
}) {
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("未做任何更改!");
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError("请稍等，图片正在上传");
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("用户更新成功");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
          icon={HiUser}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          icon={HiMail}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          defaultValue="*********"
          onChange={handleChange}
          icon={HiLockClosed}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          className="mb-2"
        >
          更新
        </Button>
        {updateUserSuccess && (
          <Alert color="success">{updateUserSuccess}</Alert>
        )}
        
      </form>
    </div>
  );
}
