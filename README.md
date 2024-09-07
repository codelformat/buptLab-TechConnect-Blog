# buptLab-TechConnect-Blog

## 项目简介

BUPT-SE, JavaEE小学期项目，基于 **MERN (MongoDB, Express, React, Node.js)** 技术栈开发。

## 项目功能

- 用户注册与登录（基于JWT的认证）
- 博客发布与展示
- 评论系统
- 消息通知系统（RabbitMQ + WebSocket）
- 文件上传（Firebase）

## 环境配置

在开始之前，请确保你的计算机上已经安装了以下工具：

- **Node.js** (推荐版本 v22.7.0 及以上)
- **MongoDB** 数据库
- **RabbitMQ** 消息队列
- **Firebase** 云存储 (可选，如果你需要使用文件上传功能)

### 1. 克隆项目

```bash
git clone https://github.com/your-username/buptLab-TechConnect-Blog.git
cd buptLab-TechConnect-Blog
```

### 2. 安装依赖

在项目根目录下运行以下命令以安装所需依赖：

```bash
npm i
cd client
npm i
```

### 3. 配置环境变量

在项目根目录下创建 `.env` 文件，并根据以下示例进行配置：

```bash
# MongoDB 配置
MONGO=mongodb://your_mongo_path

# nodemailer配置，确保163邮箱已开启SMTP服务
EMAIL_USER=user_163
EMAIL_PASS=pass_163

# JWT 配置
JWT_SECRET=your_jwt_secret

# RabbitMQ 配置
RABBITMQ_URL=amqp://localhost
```

在项目/client目录下创建 `.env` 文件，并根据以下示例进行配置：

```bash
# Firebase 配置
VITE_FIREBASE_API_KEY=your_firebase_key
```

### 4. 启动 MongoDB 和 RabbitMQ

请确保 MongoDB 和 RabbitMQ 服务已经安装并启动。

## 运行步骤

### 1. 启动后端服务

两个终端，在项目根目录下分别运行以下命令：

```bash
npm run start
npm run start:notification
```

默认情况下，后端服务将运行在 `http://localhost:3000`，通知微服务在`http://localhost:6666`。

### 2. 启动前端服务

在项目/client目录下运行以下命令：

```bash
npm run start
```


## 项目结构

```
/api
│
├── controllers           # 业务逻辑控制器
├── models                # 数据模型 (MongoDB)
├── routes                # 路由定义
├── services              # 服务层（如通知服务）
├── utils                 # 工具函数与中间件
├── .env                  # 环境变量配置文件
├── index.js              # 项目入口文件
├── package.json          # 项目依赖及脚本
└── README.md             # 项目说明文件

/client
|
├── src                   # 页面组件
├── ...                   # 懒得写了
```

## 主要依赖

- **Express**: Web 后端框架
- **React**: Web 前端框架
- **Redux Toolkit**: Web前端工具
- **Mongoose**: MongoDB ODM
- **RabbitMQ**: 消息队列
- **WebSocket**: 实时通信
- **Firebase**: 云存储服务