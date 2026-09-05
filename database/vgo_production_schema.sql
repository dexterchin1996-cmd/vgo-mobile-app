CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. 用户核心表 (PDPA 脱敏与国际 E.164 规范)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_e164 VARCHAR(20) NOT NULL UNIQUE,
    masked_phone VARCHAR(20) NOT NULL,
    full_name VARCHAR(120),
    role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'ARTISAN', 'MERCHANT', 'ADMIN')),
    country_code VARCHAR(2) NOT NULL DEFAULT 'MY' CHECK (country_code IN ('MY', 'SG')),
    credit_rating VARCHAR(5) NOT NULL DEFAULT 'AAA',
    pdpa_consented_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. 手艺人专业资质与准证合规表 (PLKS / 阶梯费率)
CREATE TABLE IF NOT EXISTS artisan_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skills_category VARCHAR(30) NOT NULL CHECK (skills_category IN ('massage', 'beauty', 'pet', 'handyman')),
    permit_type VARCHAR(20) NOT NULL DEFAULT 'CITIZEN' CHECK (permit_type IN ('CITIZEN', 'PR', 'LEGAL_PLKS')),
    permit_number VARCHAR(60),
    permit_expiry_date DATE,
    compliance_status VARCHAR(20) NOT NULL DEFAULT 'APPROVED' CHECK (compliance_status IN ('PENDING', 'APPROVED', 'SUSPENDED', 'EXPIRED_FROZEN')),
    commission_tier VARCHAR(20) NOT NULL DEFAULT 'STANDARD_15' CHECK (commission_tier IN ('STANDARD_15', 'SENIOR_12', 'CHAMPION_8')),
    completed_orders_count INT NOT NULL DEFAULT 0,
    rating_avg NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    cash_deposit_balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    current_lat NUMERIC(9, 6),
    current_lng NUMERIC(9, 6),
    is_active_listening BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. 实体数字化商户表 (SSM / ACRA 审查备案)
CREATE TABLE IF NOT EXISTS merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    business_reg_no VARCHAR(50) NOT NULL UNIQUE,
    store_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    address_text TEXT NOT NULL,
    lat NUMERIC(9, 6) NOT NULL,
    lng NUMERIC(9, 6) NOT NULL,
    platform_take_rate NUMERIC(4, 2) NOT NULL DEFAULT 0.10,
    settlement_bank_name VARCHAR(50) NOT NULL,
    settlement_account_no VARCHAR(50) NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. 核心工单表 (原子状态流与多币种税费)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_sn VARCHAR(32) NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    artisan_id UUID REFERENCES artisan_profiles(id) ON DELETE SET NULL,
    merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,
    service_type VARCHAR(50) NOT NULL,
    order_mode VARCHAR(20) NOT NULL DEFAULT 'DOOR_TO_DOOR' CHECK (order_mode IN ('DOOR_TO_DOOR', 'IN_STORE')),
    status VARCHAR(30) NOT NULL DEFAULT 'AWAITING_PAYMENT' CHECK (status IN (
        'AWAITING_PAYMENT', 'PENDING_DISPATCH', 'ASSIGNED', 'EN_ROUTE', 'ARRIVED', 
        'WORKING', 'AWAITING_VERIFY', 'COMPLETED', 'SETTLED', 'DISPUTED', 'CANCELLED'
    )),
    currency VARCHAR(3) NOT NULL CHECK (currency IN ('MYR', 'SGD')),
    base_service_amount NUMERIC(10, 2) NOT NULL,
    tax_type VARCHAR(10) NOT NULL DEFAULT 'SST' CHECK (tax_type IN ('SST', 'GST', 'EXEMPT')),
    tax_rate NUMERIC(4, 2) NOT NULL DEFAULT 0.08,
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    insurance_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    final_customer_paid NUMERIC(10, 2) NOT NULL,
    platform_commission NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    artisan_net_payout NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    verification_code_hash VARCHAR(100) NOT NULL,
    is_ladies_only BOOLEAN NOT NULL DEFAULT FALSE,
    is_airbnb_emergency BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. 现场二次加价锁记录表 (Secondary Quote Lock)
CREATE TABLE IF NOT EXISTS secondary_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    part_name VARCHAR(150) NOT NULL,
    extra_amount NUMERIC(10, 2) NOT NULL,
    damage_evidence_url TEXT NOT NULL,
    customer_approval_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (customer_approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. 防纠纷水印存证表 (Evidence Vault)
CREATE TABLE IF NOT EXISTS order_evidences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    evidence_type VARCHAR(20) NOT NULL CHECK (evidence_type IN ('PRE_WORK', 'POST_WORK', 'DAMAGE_REPORT', 'RECEIPT')),
    file_url TEXT NOT NULL,
    sha256_hash VARCHAR(64) NOT NULL,
    lat NUMERIC(9, 6) NOT NULL,
    lng NUMERIC(9, 6) NOT NULL,
    device_captured_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. 严密双记账财务账簿表 (Double-Entry Financial Ledger)
CREATE TABLE IF NOT EXISTS financial_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_ref VARCHAR(64) NOT NULL UNIQUE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    account_type VARCHAR(30) NOT NULL CHECK (account_type IN (
        'PLATFORM_ESCROW_VAULT', 'PLATFORM_REVENUE', 'TAX_RESERVE_LHDN_SST', 
        'TAX_RESERVE_IRAS_GST', 'ARTISAN_WALLET', 'INSURANCE_RESERVE'
    )),
    debit_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    credit_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL CHECK (currency IN ('MYR', 'SGD')),
    narrative TEXT NOT NULL,
    posted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. 马来西亚内税局 LHDN MyInvois 电子发票表
CREATE TABLE IF NOT EXISTS lhdn_einvoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    uuid_myinvois VARCHAR(100) UNIQUE,
    buyer_tin VARCHAR(30) NOT NULL,
    buyer_brn VARCHAR(30) NOT NULL,
    buyer_company_name VARCHAR(200) NOT NULL,
    submission_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (submission_status IN ('PENDING', 'VALIDATED', 'REJECTED')),
    qr_validation_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 高并发核心索引
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_artisan ON orders(artisan_id);
CREATE INDEX IF NOT EXISTS idx_artisan_geo ON artisan_profiles(current_lat, current_lng) WHERE is_active_listening = TRUE;
