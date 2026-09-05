/**
 * Vgo 原生交互与硬件能力桥接器
 */
(function () {
  const App = window.Capacitor?.Plugins?.App;
  const Geo = window.Capacitor?.Plugins?.Geolocation;

  // 1. Android 原生物理/手势返回键智能路由
  if (App) {
    let lastBackPress = 0;
    App.addListener('backButton', ({ canGoBack }) => {
      // 检查是否有打开的模态弹窗，优先关闭弹窗
      const activeModal = document.querySelector('.modal-active, [id*="modal"]:not(.hidden)');
      if (activeModal && !activeModal.classList.contains('hidden')) {
        activeModal.classList.add('hidden');
        return;
      }

      // 如果浏览器历史可后退，则后退
      if (window.history.length > 1 && canGoBack) {
        window.history.back();
      } else {
        // 根路由：2秒内连按两次退出应用
        const now = Date.now();
        if (now - lastBackPress < 2000) {
          App.exitApp();
        } else {
          lastBackPress = now;
          if (window.VgoPush?.showInAppBanner) {
            window.VgoPush.showInAppBanner("提示", "再按一次退出 Vgo");
          } else {
            console.log("再按一次退出应用");
          }
        }
      }
    });
    console.log("🛡️ [Vgo Native] 原生手势与物理返回键监听器已挂载");
  }

  // 2. 全局高精度定位工具方法
  window.VgoGeo = {
    async getCurrentPosition() {
      if (Geo) {
        try {
          const perm = await Geo.checkPermissions();
          if (perm.location !== 'granted') {
            await Geo.requestPermissions();
          }
          const pos = await Geo.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
          return {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            source: 'NATIVE_GPS'
          };
        } catch (e) {
          console.warn("原生定位获取失败，启用沙巴核心区模拟坐标:", e);
        }
      }
      // 缺省/浏览器模式：默认定位到亚庇市中心 Asia City
      return { lat: 5.9753, lng: 116.0734, source: 'DEFAULT_KK' };
    }
  };
})();
