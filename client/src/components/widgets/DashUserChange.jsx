import { Table } from "flowbite-react";
import { useEffect } from "react";

import { FaCheck, FaTimes } from "react-icons/fa";
import ModalChange from "./ModalChange";

export default function DashUserChange({
  currentUser,
  setShowMore,
  showMore,
  setUsers,
  users,
  setUserIdToDelete,
  userIdToDelete,
  setShowModal,
  showModal,
}) {
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return currentUser.isAdmin && users.length > 0 ? (
    <>
      <Table hoverable className="shadow-md mt-1">
        <Table.Head>
          <Table.HeadCell>创建日期</Table.HeadCell>
          <Table.HeadCell>用户头像</Table.HeadCell>
          <Table.HeadCell>用户名</Table.HeadCell>
          <Table.HeadCell>邮箱地址</Table.HeadCell>
          <Table.HeadCell>用户权限</Table.HeadCell>
          <Table.HeadCell>删除账户</Table.HeadCell>
        </Table.Head>
        {users.map((user) => (
          <Table.Body className="divide-y" key={user._id}>
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell>
                {new Date(user.createdAt).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell>
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                />
              </Table.Cell>
              <Table.Cell>{user.username}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>
                {user.isAdmin ? (
                  <span className="text-red-500">管理员</span>
                ) : (
                  <span className="text-green-500">普通用户</span>
                )}
              </Table.Cell>
              <Table.Cell>
                <span
                  onClick={() => {
                    setShowModal(true);
                    setUserIdToDelete(user._id);
                  }}
                  className="font-medium text-red-500 hover:underline cursor-pointer"
                >
                  删除账户
                </span>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        ))}
      </Table>
      {showMore && (
        <button
          onClick={handleShowMore}
          className="w-full text-teal-500 self-center text-sm py-7"
        >
          显示更多
        </button>
      )}
      <ModalChange
        currentUser={currentUser}
        setUsers={setUsers}
        setShowMore={setShowMore}
        userIdToDelete={userIdToDelete}
        setShowModal={setShowModal}
        showModal={showModal}
      ></ModalChange>
    </>
  ) : (
    <p>You have no users yet!</p>
  );
}
