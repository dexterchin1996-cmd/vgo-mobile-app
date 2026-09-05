/**
 * Vgo 企业级统一通信总线 (REST API + WebSocket 全双工)
 */
class VgoApiClient {
  constructor() {
    this.baseUrl = window.location.origin + '/api/v1';
    this.wsUrl = (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host + '/ws/dispatch';
    this.socket = null;
    this.reconnectAttempts = 0;
    this.listeners = new Map();
    this.initWebSocket();
  }

  // REST 统一请求包装
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `HTTP ${response.status}`);
      return data;
    } catch (err) {
      console.warn(`[API REQUEST FAILED] ${endpoint}:`, err.message);
      throw err;
    }
  }

  // 初始化 WebSocket 调度长连接
  initWebSocket() {
    try {
      this.socket = new WebSocket(this.wsUrl);

      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
        console.log('[WS CONNECTED] 已连通 Vgo 企业级全城调度集群');
      };

      this.socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const handlers = this.listeners.get(payload.type) || [];
          handlers.forEach(fn => fn(payload));
        } catch (e) {
          console.error('[WS PARSE ERROR]', e);
        }
      };

      this.socket.onclose = () => {
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 15000);
        this.reconnectAttempts++;
        setTimeout(() => this.initWebSocket(), delay);
      };
    } catch (e) {
      console.warn('[WS INIT ERROR]', e.message);
    }
  }

  // 监听调度事件 (派单、二次加价、核销)
  on(eventType, handler) {
    if (!this.listeners.has(eventType)) this.listeners.set(eventType, []);
    this.listeners.get(eventType).push(handler);
  }

  // 发送调度消息
  send(type, payload = {}) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, ...payload, timestamp: Date.now() }));
    }
  }
}
window.vgoApi = new VgoApiClient();
