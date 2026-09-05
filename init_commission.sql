
CREATE TABLE IF NOT EXISTS commission_rules (
    id SERIAL PRIMARY KEY,
    service_type VARCHAR(32) UNIQUE,
    platform_take_rate NUMERIC(5,2) DEFAULT 20.00,
    technician_rate NUMERIC(5,2) DEFAULT 80.00,
    cap_amount NUMERIC(10,2) DEFAULT NULL,
    night_surcharge_rate NUMERIC(5,2) DEFAULT 30.00,
    lead_fee_fixed NUMERIC(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO commission_rules (service_type, platform_take_rate, technician_rate, cap_amount, night_surcharge_rate, lead_fee_fixed)
VALUES 
    ('WELLNESS_STORE', 20.00, 80.00, NULL, 0.00, 0.00),
    ('WELLNESS_OUTCALL', 15.00, 85.00, NULL, 30.00, 0.00),
    ('REPAIR', 10.00, 90.00, 50.00, 50.00, 5.00)
ON CONFLICT (service_type) DO NOTHING;
