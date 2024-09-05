// /api/routes/notification.routes.js
import express from 'express';
import {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
}  from '../controllers/notification.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// 创建通知
router.post('/', createNotification);

// 获取某用户的通知
router.get('/:userId', getNotifications);

// 标记通知为已读
router.patch('/:id/read', markAsRead);

// 删除通知
router.delete('/:id', deleteNotification);

export default router;