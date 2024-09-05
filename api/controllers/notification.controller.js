// /api/controllers/notification.controller.js
import Notification from "../models/notification.model.js";

// 创建通知
export const createNotification = async (req, res) => {
  const { userId, message } = req.body;

  try {
    const notification = new Notification({
      userId,
      message,
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 获取用户的所有通知
export const getNotifications = async (req, res) => {
  try {
    console.log(req.params.userId)
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 标记通知为已读
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: '通知未找到' });
    }

    notification.isRead = true;
    await notification.save();
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 删除通知
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: '通知未找到' });
    }
    res.status(200).json({ message: '通知已删除' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};