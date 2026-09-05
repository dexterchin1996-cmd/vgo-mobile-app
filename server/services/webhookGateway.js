/**
 * 金融网关 Webhook 验真服务 (Curlec / Razorpay / Stripe)
 * 采用 HMAC-SHA256 算法，杜绝伪造回调
 */
const crypto = require('crypto');

class VgoWebhookGateway {
  /**
   * 校验 Curlec / Razorpay Webhook 签名
   */
  verifyCurlecSignature(payloadString, signatureHeader, secret) {
    if (!signatureHeader || !secret) return false;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payloadString)
      .digest('hex');
    return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signatureHeader));
  }

  /**
   * 校验 Stripe Webhook 签名 (v1 模式)
   */
  verifyStripeSignature(payloadString, sigHeader, secret, tolerance = 300) {
    if (!sigHeader || !secret) return false;
    const components = sigHeader.split(',').reduce((accum, item) => {
      const [k, v] = item.split('=');
      accum[k.trim()] = v.trim();
      return accum;
    }, {});

    if (!components.t || !components.v1) return false;

    // 防重放攻击校验 (5分钟窗口)
    const timestamp = parseInt(components.t, 10);
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - timestamp) > tolerance) return false;

    const signedPayload = `${components.t}.${payloadString}`;
    const expected = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(components.v1));
  }
}

module.exports = new VgoWebhookGateway();
