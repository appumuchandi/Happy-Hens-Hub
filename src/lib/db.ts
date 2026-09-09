
import Database from 'better-sqlite3';
import path from 'path';
import { decrypt } from './encryption';

// Initialize the SQLite database
const dbPath = path.resolve(process.cwd(), 'poultry.db');
const db = new Database(dbPath);

/**
 * IDEMPOTENT INITIALIZATION
 */
db.exec(`
  CREATE TABLE IF NOT EXISTS onboarding_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    serialNo TEXT NOT NULL,
    submissionDate TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL,
    contactNumber TEXT NOT NULL,
    country TEXT,
    poultryName TEXT NOT NULL,
    poultryType TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    website TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    fullName TEXT,
    secondaryContactNumber TEXT,
    plotNo TEXT,
    village TEXT,
    taluka TEXT,
    district TEXT,
    state TEXT,
    postcode TEXT,
    googleMapLink TEXT,
    gstNo TEXT
  );

  CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tutorials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    youtubeUrl TEXT NOT NULL,
    youtubeVideoId TEXT NOT NULL,
    thumbnail TEXT NOT NULL,
    role TEXT NOT NULL,
    keywords TEXT,
    displayOrder INTEGER DEFAULT 0,
    isPublished INTEGER DEFAULT 1,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  -- 2FA Storage
  CREATE TABLE IF NOT EXISTS admin_otp (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    code TEXT NOT NULL,
    expiresAt TEXT NOT NULL
  );

  -- Performance optimizations
  CREATE INDEX IF NOT EXISTS idx_status ON onboarding_requests(status);
  CREATE INDEX IF NOT EXISTS idx_submission_date ON onboarding_requests(submissionDate DESC);
  CREATE INDEX IF NOT EXISTS idx_poultry_type ON onboarding_requests(poultryType);
  CREATE INDEX IF NOT EXISTS idx_tutorial_role ON tutorials(role);
  CREATE INDEX IF NOT EXISTS idx_tutorial_order ON tutorials(displayOrder);
`);

/**
 * SCHEMA MIGRATIONS
 * Ensures existing databases are updated with new columns if they were created with an older version.
 */
try {
  db.exec("ALTER TABLE onboarding_requests ADD COLUMN firstName TEXT;");
} catch (e) {
  // Column already exists, ignore
}
try {
  db.exec("ALTER TABLE onboarding_requests ADD COLUMN lastName TEXT;");
} catch (e) {
  // Column already exists, ignore
}
try {
  db.exec("ALTER TABLE onboarding_requests ADD COLUMN country TEXT;");
} catch (e) {
  // Column already exists, ignore
}

/**
 * Helper to get ALL system settings.
 * Use ONLY in Server Actions or internal server-side logic.
 */
export function getAllSettings(): Record<string, string> {
  const rows = db.prepare('SELECT * FROM system_settings').all() as { key: string, value: string }[];
  const settings: Record<string, string> = {};
  
  Object.keys(process.env).forEach(key => {
    if (key.startsWith('NEXT_PUBLIC_') || key === 'RESEND_API_KEY' || key === 'TELEGRAM_BOT_TOKEN' || key.startsWith('EMAIL_') || key === 'SUPER_ADMIN_USERID' || key === 'TWO_FACTOR_AUTH') {
      settings[key] = process.env[key] || '';
    }
  });

  rows.forEach(row => {
    if (row.key === 'RESEND_API_KEY' || row.key === 'TELEGRAM_BOT_TOKEN') {
      settings[row.key] = decrypt(row.value);
    } else {
      settings[row.key] = row.value;
    }
  });

  return settings;
}

/**
 * Helper to get ONLY public/safe system settings.
 * Safe to pass to Client Components or use in Layouts.
 */
export function getPublicSettings(): Record<string, string> {
  const all = getAllSettings();
  const publicSettings: Record<string, string> = {};

  const SENSITIVE_KEYS = ['RESEND_API_KEY', 'TELEGRAM_BOT_TOKEN', 'SUPER_ADMIN_PASSWORD', 'SUPER_ADMIN_USERID'];

  Object.entries(all).forEach(([key, value]) => {
    if (!SENSITIVE_KEYS.includes(key)) {
      publicSettings[key] = value;
    }
  });

  return publicSettings;
}

export default db;
