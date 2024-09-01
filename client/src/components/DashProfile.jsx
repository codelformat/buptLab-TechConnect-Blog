import { useState } from "react";
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import ProfileImageUploader from "./widgets/ProfileImageUploader";
import ProfileForm from "./widgets/ProfileForm";
import AccountActions from "./widgets/AccountActions";
import { Alert, Button } from "flowbite-react";

export default function DashProfile() {
  const { currentUser, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false);

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-lg">Profile</h1>

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
      />
      {currentUser.isAdmin && (
          <Link to={'/create-post'}>
            <Button
              type='button'
              gradientDuoTone='purpleToPink'
              className='w-full'
            >
              Create a post
            </Button>
          </Link>
        )}
      <AccountActions currentUser={currentUser} />
      {error && <Alert color="failure">{error}</Alert>}
    </div>
  );
}
