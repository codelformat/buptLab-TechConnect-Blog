import React, {useEffect, useState}from "react";
import { useSelector } from "react-redux";
import { Button, Table } from "flowbite-react";

export default function DashNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const tempUser = useSelector((state) => state.user);
  const currentUser = tempUser.currentUser.rest? tempUser.currentUser.rest : tempUser.currentUser;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`/api/notifications/${currentUser._id}`);
        const data = await res.json();
        console.log(data);
        setNotifications(data);
        
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser]);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
      });
      if (res.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification._id === id
              ? { ...notification, isRead: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => notification._id !== id)
        );
      }
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">通知</h1>
      {notifications.length === 0 ? (
        <p>暂无通知</p>
      ) : (
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>消息</Table.HeadCell>
            <Table.HeadCell>操作</Table.HeadCell>
          </Table.Head>
          {notifications.map((notification) => (
            <Table.Body className="divide-y" key={notification._id}>
              <Table.Row className={notification.isRead ? "bg-gray-100" : ""}>
                <Table.Cell>{notification.message}</Table.Cell>
                <Table.Cell>
                  {!notification.isRead && (
                    <Button
                      onClick={() => markAsRead(notification._id)}
                      size="xs"
                    >
                      标记为已读
                    </Button>
                  )}
                  <Button
                    onClick={() => deleteNotification(notification._id)}
                    size="xs"
                    color="failure"
                    className="ml-2"
                  >
                    删除
                  </Button>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      )}
    </div>
  );
}
