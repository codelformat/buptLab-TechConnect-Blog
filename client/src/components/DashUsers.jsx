import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ModalChange from "./widgets/ModalChange";
import DashUserChange from "./widgets/DashUserChange";

export default function DashUsers() {
  // const { currentUser } = useSelector((state) => state.user);
  const tempUser = useSelector((state) => state.user);
  // const error = tempUser.error;
  const currentUser = tempUser.currentUser.rest? tempUser.currentUser.rest : tempUser.currentUser;
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {
        <DashUserChange
          currentUser={currentUser}
          setShowMore={setShowMore}
          setUsers={setUsers}
          users={users}
          showMore={showMore}
          userIdToDelete={userIdToDelete}
          setUserIdToDelete={setUserIdToDelete}
          setShowModal={setShowModal}
          showModal={showModal}
        ></DashUserChange>
      }
    </div>
  );
}
