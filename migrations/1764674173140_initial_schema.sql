CREATE TABLE IF NOT EXISTS employee_onboarding (
  id SERIAL PRIMARY KEY,
  task VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  document_name VARCHAR(255),
  assigned_to VARCHAR(255) NOT NULL,
  name_of_employee VARCHAR(255) NOT NULL,
  due_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_onboarding_assigned_to ON employee_onboarding (assigned_to);
CREATE INDEX IF NOT EXISTS idx_onboarding_due_date ON employee_onboarding (due_date);

CREATE TABLE IF NOT EXISTS leave_attendance (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  status VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL,
  duration DECIMAL(5,2) NOT NULL,
  assigned_to VARCHAR(255) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_leave_assigned_to ON leave_attendance (assigned_to);
CREATE INDEX IF NOT EXISTS idx_leave_date ON leave_attendance (date);

CREATE TABLE IF NOT EXISTS payroll (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  ssn VARCHAR(20) NOT NULL UNIQUE,
  address TEXT NOT NULL,
  occupation VARCHAR(100) NOT NULL,
  gender VARCHAR(20) NOT NULL,
  hire_date DATE NOT NULL,
  salary DECIMAL(12,2) NOT NULL,
  regular_hourly_rate DECIMAL(8,2),
  overtime_hourly_rate DECIMAL(8,2),
  exempt_from_overtime BOOLEAN,
  federal_allowances INTEGER,
  retirement_contribution DECIMAL(8,2),
  insurance_deduction DECIMAL(8,2),
  other_deductions DECIMAL(8,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_payroll_ssn ON payroll (ssn);
CREATE INDEX IF NOT EXISTS idx_payroll_name ON payroll (name);