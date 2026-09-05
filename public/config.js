(function () {
  // 检测当前是否运行在 Capacitor / 原生 App 容器中
  const isCapacitor = !!(window.Capacitor || window.location.protocol === 'capacitor:' || window.location.protocol === 'file:' || (window.location.hostname === 'localhost' && window.location.port === ''));
  
  // 原生 App 打包请求地址（手机局域网 IP / 生产环境域名）
  const REMOTE_API = "http://10.107.208.66:3000";

  window.VGO_CONFIG = {
    API_BASE: isCapacitor ? REMOTE_API : "",
    VERSION: "1.0.0",
    DEFAULT_REGION: "MY"
  };

  // 包装全局 fetch 请求，实现全透明 URL 自动适配
  const originalFetch = window.fetch;
  window.fetch = function (url, options) {
    let finalUrl = url;
    if (typeof url === 'string' && url.startsWith('/api/')) {
      finalUrl = window.VGO_CONFIG.API_BASE + url;
    }
    return originalFetch(finalUrl, options);
  };
  console.log("🚀 [Vgo Native Bridge] API Base 网关已激活:", window.VGO_CONFIG.API_BASE || "当前同源相对路径");
})();
