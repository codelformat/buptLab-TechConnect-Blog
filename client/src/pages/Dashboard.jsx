import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    //取出url中的tab参数
    const urlParams = new URLSearchParams(location.search);
    //转化成键值对
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    // 左右 上下
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* sidebar */}
        <DashSidebar />
      </div>
      {/* 条件渲染 */}
      {tab === "profile" && <DashProfile />}
    </div>
  );
}
