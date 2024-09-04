import { useDispatch } from "react-redux";
import { useState } from "react";
import { Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { deleteUserStart, deleteUserFailure, deleteUserSuccess, signoutSuccess } from "../../redux/user/userSlice";

export default function AccountActions({ currentUser }) {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess());
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="text-red-500 flex justify-between mt-5">
      <span className="cursor-pointer" onClick={() => setShowModal(true)}>
        删除账户
      </span>
      <span onClick={handleSignout} className="cursor-pointer">登出</span>
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-5xl text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
            您确定要删除您的账户吗？
            </h3>
            <div className="flex justify-center gap-8">
              <Button color="failure" onClick={handleDeleteUser}>
              是，确定
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
              不，取消
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}