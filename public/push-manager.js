/**
 * Vgo 跨平台推送通知核心管理器
 * 兼容原生 Capacitor 运行时与 Web 浏览器本地模拟
 */
(function () {
  window.VgoPush = {
    async init(userId, role = 'CUSTOMER') {
      const Push = window.Capacitor?.Plugins?.PushNotifications;

      // 1. 浏览器环境降级模拟处理
      if (!Push) {
        console.log("ℹ️ [Vgo Push] 当前处于 Web/浏览器环境，启用模拟通知信道");
        return;
      }

      try {
        // 2. 检查并动态申请通知权限 (适配 Android 13+ 运行时授权)
        let permStatus = await Push.checkPermissions();
        if (permStatus.receive === 'prompt' || permStatus.receive === 'prompt-with-rationale') {
          permStatus = await Push.requestPermissions();
        }

        if (permStatus.receive !== 'granted') {
          console.warn("⚠️ [Vgo Push] 用户未授予系统通知权限");
          return;
        }

        // 3. 注册 FCM / APNS 通道以生成设备 Token
        await Push.register();

        // 4. 监听 Token 生成并回传至 Vgo 后端
        Push.addListener('registration', async (token) => {
          console.log("🟢 [Vgo Push] 设备 Token 注册成功:", token.value);
          try {
            await fetch('/api/v1/notifications/register-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                user_id: userId,
                role: role,
                device_token: token.value,
                platform: window.Capacitor.getPlatform()
              })
            });
          } catch (e) {
            console.error("Token 上报失败:", e);
          }
        });

        // 5. 监听错误
        Push.addListener('registrationError', (error) => {
          console.error("🔴 [Vgo Push] 推送注册失败:", JSON.stringify(error));
        });

        // 6. 前台接收推送监听（展示即时订单通知横幅）
        Push.addListener('pushNotificationReceived', (notification) => {
          console.log("📩 [Vgo Push] 收到前台推送:", notification);
          window.VgoPush.showInAppBanner(notification.title, notification.body);
        });

        // 7. 用户点击通知动作监听（精准路由至对应订单详情）
        Push.addListener('pushNotificationActionPerformed', (action) => {
          console.log("👆 [Vgo Push] 用户点击通知卡片:", action);
          const data = action.notification.data;
          if (data && data.target_url) {
            window.location.href = data.target_url;
          }
        });

      } catch (err) {
        console.error("VgoPush 初始化异常:", err);
      }
    },

    // 前台原生拟态通知条
    showInAppBanner(title, body) {
      const banner = document.createElement('div');
      banner.className = "fixed top-4 left-4 right-4 z-50 bg-slate-800 border border-teal-500/50 text-white p-3 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-0 flex items-center space-x-3";
      banner.innerHTML = `
        <div class="p-2 bg-teal-500/20 text-teal-400 rounded-lg text-lg">🔔</div>
        <div class="flex-1">
          <p class="font-bold text-xs">${title || 'Vgo 平台通知'}</p>
          <p class="text-[11px] text-slate-300">${body || ''}</p>
        </div>
      `;
      document.body.appendChild(banner);
      setTimeout(() => {
        banner.style.opacity = '0';
        setTimeout(() => banner.remove(), 300);
      }, 4000);
    }
  };
})();
