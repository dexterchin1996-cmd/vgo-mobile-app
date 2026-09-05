const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('[1/3] 检查并确保证书文件存在...');
const certDir = path.join(__dirname, '../certs');
if (!fs.existsSync(certDir)) fs.mkdirSync(certDir, { recursive: true });

const keystorePath = path.join(certDir, 'vgo-release-key.jks');
if (!fs.existsSync(keystorePath)) {
  console.log('生成 RSA 4096-bit 生产商业密钥库...');
  execSync(`keytool -genkeypair -v \
    -keystore "${keystorePath}" \
    -keyalg RSA \
    -keysize 4096 \
    -validity 10000 \
    -alias vgo-release \
    -storepass "VgoSuperApp2026SecurePass" \
    -keypass "VgoSuperApp2026SecurePass" \
    -dname "CN=Vgo Platform Engineering, OU=Technology, O=Vgo Technologies SDN BHD, L=Kota Kinabalu, ST=Sabah, C=MY" \
    -noprompt`);
}

console.log('[2/3] 配置 android/app/build.gradle 商业签名规范...');
const buildGradlePath = path.join(__dirname, '../android/app/build.gradle');

if (!fs.existsSync(buildGradlePath)) {
  console.log('未检测到 android/app/build.gradle，等待 Capacitor 初始化后注入。');
  process.exit(0);
}

let content = fs.readFileSync(buildGradlePath, 'utf8');

const signingConfigBlock = `
    signingConfigs {
        release {
            storeFile file('../../certs/vgo-release-key.jks')
            storePassword 'VgoSuperApp2026SecurePass'
            keyAlias 'vgo-release'
            keyPassword 'VgoSuperApp2026SecurePass'
            v1SigningEnabled true
            v2SigningEnabled true
        }
    }
`;

if (!content.includes('signingConfigs {')) {
  // 注入 signingConfigs 到 android 块
  content = content.replace(/android\s*\{/, 'android {\n' + signingConfigBlock);
  // 为 release 构建绑定签名配置
  content = content.replace(/buildTypes\s*\{\s*release\s*\{/, 'buildTypes {\n        release {\n            signingConfig signingConfigs.release');
  fs.writeFileSync(buildGradlePath, content, 'utf8');
  console.log('✅ 商业签名成功挂载至 release 构建块！');
} else {
  console.log('ℹ️ signingConfigs 已存在，无需重复注入。');
}

console.log('[3/3] 签名配置流程执行完毕。');
