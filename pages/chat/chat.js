App({
  globalData: {
    socketOpen: false, // WebSocket 是否打开
    socketTask: null,  // WebSocket 任务
  },

  // 初始化 WebSocket 连接
  connectWebSocket(url) {
    const app = this;
    app.globalData.socketTask = wx.connectSocket({
      url: url, // WebSocket 服务器地址
      success: (res) => {
        console.log("WebSocket 连接成功:", res);
      },
      fail: (err) => {
        console.error("WebSocket 连接失败:", err);
      }
    });

    // 监听 WebSocket 打开事件
    app.globalData.socketTask.onOpen(() => {
      console.log("WebSocket 已打开");
      app.globalData.socketOpen = true;
    });

    // 监听 WebSocket 消息事件
    app.globalData.socketTask.onMessage((msg) => {
      console.log("收到服务器消息:", msg.data);
      // 可将消息分发到对应的页面
      eventBus.emit("socketMessage", msg.data); // 触发事件
    });

    // 监听 WebSocket 错误事件
    app.globalData.socketTask.onError((err) => {
      console.error("WebSocket 错误:", err);
      app.globalData.socketOpen = false;
    });

    // 监听 WebSocket 关闭事件
    app.globalData.socketTask.onClose(() => {
      console.log("WebSocket 已关闭");
      app.globalData.socketOpen = false;
    });
  },

  // 发送消息
  sendMessage(msg) {
    const app = this;
    if (app.globalData.socketOpen) {
      app.globalData.socketTask.send({
        data: JSON.stringify(msg),
        success: () => {
          console.log("消息发送成功:", msg);
        },
        fail: (err) => {
          console.error("消息发送失败:", err);
        }
      });
    } else {
      console.warn("WebSocket 未连接，消息发送失败");
    }
  },

  // 关闭连接
  closeWebSocket() {
    const app = this;
    if (app.globalData.socketTask) {
      app.globalData.socketTask.close();
      console.log("WebSocket 连接已关闭");
    }
  }
});
const eventBus = require("../../common/utils/eventBus");

Page({
  data: {
    messages: [], // 聊天记录
    inputMessage: '' // 当前输入的内容
  },
  onLoad() {
    const app = getApp();
    const serverUrl = "ws://localhost:8089/websocket/1"; // 替换为你的 WebSocket 服务器地址
    app.connectWebSocket(serverUrl);
    // 订阅 WebSocket 消息事件
    eventBus.on("socketMessage", (message)=>this.handleSocketMessage(message));
  },

  onUnload() {
    const app = getApp();
    app.closeWebSocket(); // 页面卸载时关闭 WebSocket
    // 页面卸载时取消订阅
    eventBus.off("socketMessage", (message)=>this.handleSocketMessage(message));
  },

  // 发送消息
  sendMessage() {
    const app = getApp();
    const { inputMessage } = this.data;

    if (inputMessage.trim() === "") {
      wx.showToast({ title: "请输入消息", icon: "none" });
      return;
    }

    const message = {
      isUser:true,
      type: "chat",
      message: inputMessage,
      sid: 2,
      timestamp: Date.now(),
    };

    app.sendMessage(message);

    // 将发送的消息显示在页面
    this.setData({
      messages: [...this.data.messages, message],
      inputMessage: "",
    });
  },

  // 处理输入框内容变化
  handleInput(e) {
    this.setData({
      inputMessage: e.detail.value
    });
  },

  // 处理 WebSocket 消息
  handleSocketMessage(message) {
    //const msg = JSON.parse(message);
    console.log("页面收到消息:", message);

    // 更新消息列表
    this.setData({
      messages: [...this.data.messages, {
        isUser:false,
        type: "chat",
        message: message,
        sid: 2,
        timestamp: Date.now(),
      }],
    });
  },

});
