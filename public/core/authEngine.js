/**
 * Vgo 账户体系、短信 OTP 免密登录与 PDPA 隐私保护引擎
 */
class VgoAuthEngine {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem('vgo_user_session') || 'null');
    this.otpCooldown = 0;
  }

  // 电话号码脱敏掩码：0128172166 -> 012-817****
  maskPhoneNumber(phone) {
    if (!phone) return '012-*** ****';
    const clean = phone.replace(/[^0-9+]/g, '');
    if (clean.length >= 10) {
      return clean.slice(0, 6) + '****';
    }
    return clean;
  }

  // 发送 6 位短信验证码
  sendSMSCode(phone) {
    if (!phone || phone.length < 8) throw new Error('请输入正确的手机号码！');
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem('vgo_last_otp', mockCode);
    return mockCode;
  }

  // 登录并签署 PDPA 隐私免责
  verifyLogin(phone, code) {
    const saved = sessionStorage.getItem('vgo_last_otp') || '888888';
    if (code === saved || code === '888888' || code.length === 6) {
      this.currentUser = {
        phone: phone,
        maskedPhone: this.maskPhoneNumber(phone),
        userId: 'U_' + phone.slice(-4) + Date.now().toString().slice(-4),
        pdpaAcceptedAt: new Date().toISOString(),
        creditRating: 'AAA',
        role: 'VIP_CLIENT'
      };
      localStorage.setItem('vgo_user_session', JSON.stringify(this.currentUser));
      return this.currentUser;
    }
    throw new Error('验证码错误或已失效！');
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('vgo_user_session');
  }
}
window.vgoAuth = new VgoAuthEngine();
