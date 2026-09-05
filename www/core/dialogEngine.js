/**
 * Vgo 平台原生级弹窗与触感反馈引擎
 */
class VgoDialogEngine {
  constructor() {
    this.initDOM();
  }

  initDOM() {
    if (document.getElementById('vgoDialogContainer')) return;
    const div = document.createElement('div');
    div.id = 'vgoDialogContainer';
    div.innerHTML = `
      <div id="vgoDialogScrim" class="dialog-scrim">
        <div class="dialog-panel">
          <div id="vgoDialogIconWrap" class="dialog-icon-wrap">
            <i id="vgoDialogIcon" class="fas fa-check"></i>
          </div>
          <h3 id="vgoDialogTitle" style="font-size: 17px; font-weight: 900; margin-bottom: 8px;">提示</h3>
          <p id="vgoDialogMsg" style="font-size: 13px; color: #64748B; line-height: 1.45;"></p>
          <div class="dialog-btn-row">
            <button id="vgoDialogCancelBtn" class="dialog-btn btn-press" style="background:#F1F5F9; color:#64748B; display:none;">取消</button>
            <button id="vgoDialogConfirmBtn" class="dialog-btn btn-press" style="background:#0D9488; color:#fff;">确定</button>
          </div>
        </div>
      </div>
      <div id="vgoToastPill" class="global-toast-pill">
        <i id="vgoToastIcon" class="fas fa-circle-check"></i>
        <span id="vgoToastMsg">提示信息</span>
      </div>
    `;
    document.body.appendChild(div);

    this.scrim = document.getElementById('vgoDialogScrim');
    this.iconWrap = document.getElementById('vgoDialogIconWrap');
    this.icon = document.getElementById('vgoDialogIcon');
    this.title = document.getElementById('vgoDialogTitle');
    this.msg = document.getElementById('vgoDialogMsg');
    this.cancelBtn = document.getElementById('vgoDialogCancelBtn');
    this.confirmBtn = document.getElementById('vgoDialogConfirmBtn');
    this.toastEl = document.getElementById('vgoToastPill');
    this.toastMsg = document.getElementById('vgoToastMsg');
    this.toastIcon = document.getElementById('vgoToastIcon');
  }

  vibrate(ms = 15) {
    if (window.navigator && window.navigator.vibrate) {
      try { window.navigator.vibrate(ms); } catch (e) {}
    }
  }

  toast(message, type = 'success') {
    this.vibrate(12);
    this.toastMsg.innerText = message;
    if (type === 'success') {
      this.toastIcon.className = 'fas fa-circle-check';
      this.toastIcon.style.color = '#10B981';
    } else if (type === 'warn') {
      this.toastIcon.className = 'fas fa-triangle-exclamation';
      this.toastIcon.style.color = '#F59E0B';
    } else {
      this.toastIcon.className = 'fas fa-circle-info';
      this.toastIcon.style.color = '#0284C7';
    }
    this.toastEl.classList.add('active');
    setTimeout(() => { this.toastEl.classList.remove('active'); }, 2500);
  }

  confirm(title, message, options = {}) {
    this.vibrate(20);
    return new Promise((resolve) => {
      this.title.innerText = title;
      this.msg.innerHTML = message;
      this.iconWrap.style.background = options.iconBg || '#CCFBF1';
      this.icon.className = options.iconClass || 'fas fa-question';
      this.icon.style.color = options.iconColor || '#0D9488';

      this.cancelBtn.style.display = 'block';
      this.cancelBtn.innerText = options.cancelText || '返回';
      this.confirmBtn.innerText = options.confirmText || '确定';
      this.confirmBtn.style.background = options.confirmBg || '#0D9488';

      const handleConfirm = () => { cleanup(); resolve(true); };
      const handleCancel = () => { cleanup(); resolve(false); };

      const cleanup = () => {
        this.scrim.classList.remove('active');
        this.confirmBtn.removeEventListener('click', handleConfirm);
        this.cancelBtn.removeEventListener('click', handleCancel);
      };

      this.confirmBtn.addEventListener('click', handleConfirm);
      this.cancelBtn.addEventListener('click', handleCancel);
      this.scrim.classList.add('active');
    });
  }

  showModalAlert(title, message, options = {}) {
    this.vibrate(15);
    return new Promise((resolve) => {
      this.title.innerText = title;
      this.msg.innerHTML = message;
      this.iconWrap.style.background = options.iconBg || '#E0F2FE';
      this.icon.className = options.iconClass || 'fas fa-circle-info';
      this.icon.style.color = options.iconColor || '#0284C7';

      this.cancelBtn.style.display = 'none';
      this.confirmBtn.innerText = options.btnText || '我知道了';
      this.confirmBtn.style.background = options.btnBg || '#0284C7';

      const handleConfirm = () => {
        this.scrim.classList.remove('active');
        this.confirmBtn.removeEventListener('click', handleConfirm);
        resolve(true);
      };

      this.confirmBtn.addEventListener('click', handleConfirm);
      this.scrim.classList.add('active');
    });
  }
}
window.vgoDialog = new VgoDialogEngine();
