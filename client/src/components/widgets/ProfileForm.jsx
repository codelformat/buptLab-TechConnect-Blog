import { useState } from "react";
import { TextInput, Button, Alert } from "flowbite-react";
import { useDispatch } from "react-redux";
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
}) {
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

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
          currentUser._id
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
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={
            currentUser.username
          }
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={
            currentUser.email
          }
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          defaultValue="*********"
          onChange={handleChange}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
        {updateUserSuccess && (
          <Alert color="success">{updateUserSuccess}</Alert>
        )}
        {updateUserError && <Alert color="failure">{updateUserError}</Alert>}
      </form>
    </div>
  );
}
