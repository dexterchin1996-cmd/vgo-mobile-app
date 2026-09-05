/**
 * Vgo Enterprise Production Application Server
 * 整合：HTTP 静态托管、REST API、WebSocket 调度集群与高精度距离广播
 */
const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { WebSocketServer } = require('ws');
const apiRoutes = require('./routes/api');

const app = express();
app.use(express.json());

// 注册企业级 API 路由
app.use('/api/v1', apiRoutes);

// 静态前端资源托管 (四大端口)
const publicDir = path.join(__dirname, '../public');
app.use(express.static(publicDir));
app.get('/', (req, res) => res.sendFile(path.join(publicDir, 'customer/index.html')));

const server = http.createServer(app);

// 挂载 WebSocket 实时调度集群
const wss = new WebSocketServer({ server, path: '/ws/dispatch' });
const activeArtisans = new Map(); // artisanId -> ws socket

wss.on('connection', (ws, req) => {
  let boundArtisanId = null;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'REGISTER_ARTISAN') {
        boundArtisanId = data.artisanId;
        activeArtisans.set(boundArtisanId, { ws, lat: data.lat, lng: data.lng, category: data.category });
        ws.send(JSON.stringify({ type: 'REGISTER_OK', message: '已成功接入 Vgo 全城调度大盘' }));
      }
    } catch (e) {
      console.error('[WS ERROR]', e.message);
    }
  });

  ws.on('close', () => {
    if (boundArtisanId) activeArtisans.delete(boundArtisanId);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Vgo 企业级生产架构服务已启动 (Port: ${PORT})`);
  console.log(`  • REST API 网关     : http://localhost:${PORT}/api/v1/health`);
  console.log(`  • WebSocket 调度集群: ws://localhost:${PORT}/ws/dispatch`);
  console.log(`  • 顾客端服务大厅   : http://localhost:${PORT}/customer/`);
  console.log(`  • 手艺人工作台中枢 : http://localhost:${PORT}/partner/`);
  console.log(`  • 实体商户数字中台 : http://localhost:${PORT}/merchant/`);
  console.log(`  • 总控决策大脑     : http://localhost:${PORT}/admin/`);
  console.log(`======================================================\n`);
});
