import { useState } from "react";
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import ProfileImageUploader from "./widgets/ProfileImageUploader";
import ProfileForm from "./widgets/ProfileForm";
import AccountActions from "./widgets/AccountActions";
import { Alert, Button } from "flowbite-react";

export default function DashProfile() {
  //从redux中获取用户信息
  const tempUser = useSelector((state) => state.user);
  const error = tempUser.error;
  console.log(tempUser);
  const currentUser = tempUser.currentUser.rest? tempUser.currentUser.rest : tempUser.currentUser;
  console.log(currentUser);
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserError, setUpdateUserError] = useState(null);

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-lg">用户资料</h1>

      <ProfileImageUploader
        currentUser={currentUser}
        setFormData={setFormData}
        setImageFileUploading={setImageFileUploading}
      />

      <ProfileForm
        currentUser={currentUser}
        imageFileUploading={imageFileUploading}
        formData={formData}
        setFormData={setFormData}
        updateUserError={updateUserError}
        setUpdateUserError={setUpdateUserError}
      />
      {currentUser.isAdmin && (
          <Link to={'/create-post'}>
            <Button
              type='button'
              gradientDuoTone='purpleToPink'
              className='w-full'
            >
              创建帖子
            </Button>
          </Link>
        )}
      <AccountActions currentUser={currentUser} />
      {updateUserError && <span className="text-red-700">{updateUserError}</span>}
      {error && <Alert color="failure">{error}</Alert>}
    </div>
  );
}
