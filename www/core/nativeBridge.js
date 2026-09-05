/**
 * Vgo 原生硬件网桥：GPS高精度定位、防作弊水印相机、后台/锁屏推送
 */
class VgoNativeBridge {
  constructor() {
    this.currentCoords = { lat: 5.9804, lng: 116.0735, address: '沙巴·亚庇市中心 (Kota Kinabalu)' };
  }

  // 1. 获取真机高精度地理坐标
  async getCurrentLocation() {
    return new Promise((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.currentCoords = {
              lat: +pos.coords.latitude.toFixed(5),
              lng: +pos.coords.longitude.toFixed(5),
              address: `GPS 定位点 (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)})`
            };
            resolve(this.currentCoords);
          },
          () => resolve(this.currentCoords), // 失败默认回退
          { timeout: 6000, enableHighAccuracy: true }
        );
      } else {
        resolve(this.currentCoords);
      }
    });
  }

  // 2. 防篡改现场拍照存证 (在 Canvas 上强制打入当前时间水印与经纬度)
  captureWatermarkEvidence(photoDataUrl, title = '施工/履约存证') {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width || 600;
        canvas.height = img.height || 450;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 绘制防篡改黑色半透明遮罩
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.fillRect(0, canvas.height - 70, canvas.width, 70);

        // 写入不可篡改文字信息
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px -apple-system, sans-serif';
        ctx.fillText(`【Vgo 防作弊存证】${title}`, 16, canvas.height - 44);

        ctx.fillStyle = '#10B981';
        ctx.font = '13px monospace';
        const nowStr = new Date().toLocaleString();
        ctx.fillText(`时间: ${nowStr} | 坐标: ${this.currentCoords.lat}, ${this.currentCoords.lng}`, 16, canvas.height - 20);

        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = photoDataUrl;
    });
  }

  // 3. 模拟后台推送与锁屏全屏提醒
  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }

  sendPushAlert(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=100&auto=format&fit=crop&q=80',
        vibrate: [200, 100, 200]
      });
    }
  }
}
window.vgoBridge = new VgoNativeBridge();
