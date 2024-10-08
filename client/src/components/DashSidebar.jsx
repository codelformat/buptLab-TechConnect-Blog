import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import  DashSidebarChange  from "./widgets/DashSiderbarChange"
export default function DashSidebar() {

  const tempUser = useSelector((state) => state.user.currentUser);
  console.log(tempUser);
  const currentUser = tempUser.rest ? tempUser.rest : tempUser;
  console.log(currentUser);
  const [tab, setTab] = useState("");

  console.log("dashsidebar rendering")
  return (
    <DashSidebarChange currentUser={currentUser} tab={tab} setTab={setTab} />
  );
}
