// /api/services/notificationService.js
import mongoose from 'mongoose';
import amqp from 'amqplib';
import Notification from '../models/notification.model.js';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws'; // 引入 WebSocketServer

dotenv.config();

const startNotificationService = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log('Connected to MongoDB for Notification Service');

        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue('notificationQueue', { durable: true });

        console.log('Notification Service is waiting for messages...');

        // WebSocket 服务器设置
        const wss = new WebSocketServer({ port: 6666 }); // 创建 WebSocket 服务器
        wss.on('connection', (ws) => {
            console.log('New WebSocket client connected');
            ws.on('close', () => {
                console.log('WebSocket client disconnected');
            });
        });

        channel.consume('notificationQueue', async (msg) => {
            if (msg !== null) {
                const { userId, message } = JSON.parse(msg.content.toString());
                const notification = new Notification({ userId, message });
                await notification.save();
                console.log('Notification saved:', notification);

                // 向所有 WebSocket 连接发送通知
                wss.clients.forEach((client) => {
                    if (client.readyState === client.OPEN) {
                        client.send(JSON.stringify({ userId, message }));
                    }
                });

                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('Error in Notification Service:', error);
    }
};

startNotificationService();