import os
import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

ENV_PATH = BASE_DIR / ".env"
if ENV_PATH.exists():
    with open(ENV_PATH, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                os.environ.setdefault(key.strip(), val.strip().strip("\"'"))

def resolve_data_file() -> Path:
    env_data = os.getenv("DATA_FILE")
    if env_data:
        try:
            p = Path(env_data)
            if p.exists():
                return p
            p_rel = BASE_DIR / env_data
            if p_rel.exists():
                return p_rel
        except Exception:
            pass
    
    candidates = [
        BASE_DIR / "data" / "two.txt",
        BASE_DIR / "two.txt",
        BASE_DIR.parent / "two.txt",
        Path("/media/albaloshi/USB_SHARED/two.txt")
    ]
    for c in candidates:
        try:
            if c.exists():
                return c
        except Exception:
            pass
    return BASE_DIR / "data" / "two.txt"

def resolve_db_file() -> Path:
    default_db = BASE_DIR / "database" / "data.db"
    env_db = os.getenv("DATABASE_FILE")
    if env_db:
        try:
            p = Path(env_db)
            if not p.is_absolute():
                p = BASE_DIR / env_db
            if p.exists():
                return p
            # If default_db exists and env path doesn't, prefer default_db
            if default_db.exists():
                return default_db
            p.parent.mkdir(parents=True, exist_ok=True)
            return p
        except Exception:
            if default_db.exists():
                return default_db
    
    try:
        default_db.parent.mkdir(parents=True, exist_ok=True)
    except Exception:
        pass
    return default_db

DATA_FILE_PATH = resolve_data_file()
DATABASE_FILE_PATH = resolve_db_file()

def get_db_connection(timeout: float = 30.0) -> sqlite3.Connection:
    conn = sqlite3.connect(str(DATABASE_FILE_PATH), timeout=timeout)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA synchronous = NORMAL;")
    conn.execute("PRAGMA cache_size = -100000;")
    conn.execute("PRAGMA temp_store = MEMORY;")
    return conn

def init_db(conn: sqlite3.Connection = None):
    close_after = False
    if conn is None:
        conn = get_db_connection()
        close_after = True
    
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS records (
        id INTEGER PRIMARY KEY,
        integer_key INTEGER,
        hash_key TEXT,
        name TEXT,
        fname TEXT,
        gname TEXT,
        dob_year INTEGER,
        gender INTEGER,
        province TEXT,
        district TEXT,
        province_code TEXT,
        district_code TEXT,
        record_number INTEGER,
        page_number INTEGER,
        book_name TEXT,
        cropped_path TEXT
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS analytics_cache (
        cache_key TEXT PRIMARY KEY,
        cache_data TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ingestion_meta (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_file TEXT,
        total_source_rows INTEGER,
        imported_rows INTEGER,
        failed_rows INTEGER,
        skipped_rows INTEGER,
        duplicate_rows INTEGER,
        duration_seconds REAL,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS saved_searches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        query_params TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("CREATE INDEX IF NOT EXISTS idx_records_prov_dist ON records (province, district);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_records_district ON records (district);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_records_dob ON records (dob_year);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_records_gender ON records (gender);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_records_hash ON records (hash_key);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_records_name ON records (name);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_records_fname ON records (fname);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_records_book ON records (book_name);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_records_prov_code ON records (province_code);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_records_dist_code ON records (district_code);")

    conn.commit()
    if close_after:
        conn.close()

if __name__ == "__main__":
    print(f"Data File Path: {DATA_FILE_PATH} (exists: {DATA_FILE_PATH.exists()})")
    print(f"Database File Path: {DATABASE_FILE_PATH}")
    init_db()
    print("Database initialized successfully.")
