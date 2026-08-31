# 📊 Enterprise Civil Registry Data Analytics & Exploration Platform

An enterprise-grade, high-throughput analytical dashboard engineered to ingest, index, and explore **24.4+ million civil registration records** (9.9 GB raw UTF-16 LE dataset) with **instant sub-second response times**, universal multi-column search, cross-filtering, statistical relationship intelligence, and streaming data export.

---

## 📑 Table of Contents

1. [System Architecture](#-system-architecture)
2. [Prerequisites & System Requirements](#-prerequisites--system-requirements)
3. [Complete Step-by-Step Setup Guide](#-complete-step-by-step-setup-guide)
   * [A. Linux / macOS Setup](#a-linux--macos-setup)
   * [B. Windows Setup](#b-windows-setup)
4. [One-Command Quick Start](#-one-command-quick-start)
5. [Running Backend & Frontend Manually](#-running-backend--frontend-manually)
   * [1. Backend Server (FastAPI)](#1-running-the-backend-manually)
   * [2. Frontend Application (Vite + React)](#2-running-the-frontend-manually)
6. [Live Application URLs](#-live-application-urls)
7. [Dataset & Database Specifications](#-dataset--database-specifications)
8. [Data Ingestion & Zero-Loss Verification](#-data-ingestion--zero-loss-verification)
9. [Key Features & Platform Modules](#-key-features--platform-modules)
10. [REST API Reference & Endpoints](#-rest-api-reference--endpoints)
11. [Troubleshooting & Common Issues](#-troubleshooting--common-issues)
12. [Transferring to Another Computer](#-transferring-to-another-computer)

---

## 🏛 System Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                    React Frontend (Port 5173)                   │
│   • Executive Overview & KPIs with Dynamic Smart Insights       │
│   • Universal Search Hub (Dari / Persian Unicode + Exact Match) │
│   • Enterprise Data Explorer (16 Columns, Sorting, Pagination)  │
│   • Geographic Analytics (Provinces & District Distribution)    │
│   • Demographic Analytics (Solar Hijri Birth Cohorts Timeline)  │
│   • Book & Page Physical Structure Explorer                     │
│   • Statistical Relationship Lab (Pearson, Spearman, Cramér's V)│
│   • Data Quality Center & 16-Column Audit Matrix                │
│   • Streaming Exporter (UTF-8 BOM CSV / JSON)                   │
└────────────────────────────────┬────────────────────────────────┘
                                 │ HTTP REST API
┌────────────────────────────────▼────────────────────────────────┐
│                   FastAPI Backend (Port 8001)                   │
│   • Sub-10ms Parameterized Query Builder & B-Tree Index Router  │
│   • Pure-Python Statistical Engine (Zero Heavy Dependencies)    │
│   • Precomputed Analytics Cache Retrieval                       │
│   • Unicode-Preserving Streaming Exporter                       │
└────────────────────────────────┬────────────────────────────────┘
                                 │ SQLite C Engine (WAL Mode)
┌────────────────────────────────▼────────────────────────────────┐
│               Indexed SQLite Database (`database/data.db`)      │
│   • `records` Table (23.8M+ unique civil entries)               │
│   • 9 Multi-Column B-Tree Indexes                               │
│   • `analytics_cache` (Instant pre-aggregated stats)            │
│   • `ingestion_meta` (Zero-loss audit trail & row counts)       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💻 Prerequisites & System Requirements

Ensure the following tools are installed on your computer:

| Dependency | Minimum Version | Recommended Version | Purpose |
|---|---|---|---|
| **Python** | 3.10+ | 3.11 or 3.12 | Backend API & Analytics Engine |
| **Node.js** | v18.0.0+ | v20.x or v22.x LTS | Frontend Tooling & Vite Dev Server |
| **npm** | v9.0.0+ | v10.x+ | Package Manager |
| **RAM** | 8 GB | 16 GB | In-memory query caching & rendering |
| **Free Disk Space** | 20 GB | 30 GB SSD | Dataset storage (`two.txt`) & SQLite database |

---

## 🛠 Complete Step-by-Step Setup Guide

### A. Linux / macOS Setup

#### Step 1: Clone or Open the Project
```bash
cd /path/to/Dashboard
```

#### Step 2: Configure Environment Variables
Copy the template configuration file `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(By default, `.env` points to `./data/two.txt` for the dataset and `./database/data.db` for the database).*

#### Step 3: Set Up Python Backend Virtual Environment
```bash
# Create a virtual environment named .venv
python3 -m venv .venv

# Activate the virtual environment
source .venv/bin/activate

# Upgrade pip and install backend dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

#### Step 4: Install Frontend Dependencies
```bash
# Navigate to the frontend directory
cd frontend

# Install npm packages
npm install

# Return to root directory
cd ..
```

---

### B. Windows Setup

#### Step 1: Open Command Prompt or PowerShell
Open Command Prompt (`cmd.exe`) as Administrator and navigate to the project directory:
```cmd
cd C:\path\to\Dashboard
```

#### Step 2: Configure Environment Variables
```cmd
copy .env.example .env
```

#### Step 3: Set Up Python Backend Virtual Environment
```cmd
# Create virtual environment
python -m venv .venv

# Activate virtual environment
call .venv\Scripts\activate

# Upgrade pip and install dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt
```

#### Step 4: Install Frontend Dependencies
```cmd
cd frontend
npm install
cd ..
```

---

## ⚡ One-Command Quick Start

Once setup is complete, you can start both the backend and frontend simultaneously using the included launcher scripts:

### On Linux / macOS:
```bash
chmod +x start.sh stop.sh
./start.sh
```
*To stop both services gracefully, press `Ctrl+C` or run `./stop.sh`.*

### On Windows:
Double-click **`start.bat`** in Windows Explorer, or run:
```cmd
start.bat
```

---

## 🏃 Running Backend & Frontend Manually

If you prefer to run each service in separate terminal windows:

### 1. Running the Backend Manually

Open **Terminal 1**:
```bash
# 1. Activate virtual environment
source .venv/bin/activate    # On Windows: .venv\Scripts\activate

# 2. Start Uvicorn server on port 8001
uvicorn backend.main:app --host 0.0.0.0 --port 8001 --reload
```
*Backend API will be running at: `http://localhost:8001`*

---

### 2. Running the Frontend Manually

Open **Terminal 2**:
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Start Vite development server on port 5173
npm run dev
```
*Frontend Dashboard will be running at: `http://localhost:5173`*

---

## 🌐 Live Application URLs

| Service | URL | Description |
|---|---|---|
| 🖥️ **Web Dashboard** | **[http://localhost:5173](http://localhost:5173)** | Complete React Analytics & Search UI |
| 📖 **Interactive API Docs** | **[http://localhost:8001/docs](http://localhost:8001/docs)** | Swagger UI documentation with test console |
| 🩺 **Backend Health API** | **[http://localhost:8001/api/health](http://localhost:8001/api/health)** | JSON healthcheck with total live record count |

---

## 📁 Dataset & Database Specifications

* **Source Data File:** `two.txt` (9.90 GB)
* **Encoding:** UTF-16 Little Endian (`UTF-16 LE`) with Byte Order Mark (`\xff\xfe`)
* **Format:** Comma-Separated Values (`CSV`) with CRLF line terminators (`\r\n`)
* **Total Source Rows:** `24,399,446` (24,399,445 data rows + 1 header row)
* **Database File:** `database/data.db` (13 GB SQLite with WAL mode enabled)
* **Unique Records Stored:** `23,839,823` unique citizen identities
* **Source Integrity:** The original `two.txt` raw file is accessed in strictly **READ-ONLY** mode and is never modified or altered.

### 16 Core Columns Schema:

| # | Column Name | SQL Type | Description | Observed Example |
|---|---|---|---|---|
| 1 | `id` | `INTEGER PRIMARY KEY` | Unique registry entry ID | `1009` |
| 2 | `integer_key` | `INTEGER` | System sequence key | `634067377` |
| 3 | `hash_key` | `TEXT (32)` | MD5 identity fingerprint | `B3BDB5290D8773A703554E96DA34E64F` |
| 4 | `name` | `TEXT (UTF-8)` | Citizen Personal Name (نام) | `ظریفه` |
| 5 | `fname` | `TEXT (UTF-8)` | Patronymic / Father's Name (نام پدر) | `لالا شیرین` |
| 6 | `gname` | `TEXT (UTF-8)` | Grandfather's Name (نام پدرکلان) | `در محمد` |
| 7 | `dob_year` | `INTEGER` | Birth Year (Solar Hijri هجری شمسی) | `1388` (~2009 CE) |
| 8 | `gender` | `INTEGER` | Binary Demographic Code | `0` or `1` |
| 9 | `province` | `TEXT (UTF-8)` | Province Name (ولایت) | `کابل` |
| 10 | `district` | `TEXT (UTF-8)` | District Name (ولسوالی) | `موسهی` |
| 11 | `province_code`| `TEXT (3)` | Standard Province Code | `KBL` |
| 12 | `district_code`| `TEXT (4)` | Administrative District Code | `0107` |
| 13 | `record_number`| `INTEGER` | Ledger Entry Ordinal Number | `201` |
| 14 | `page_number` | `INTEGER` | Physical Volume Page Number | `41` |
| 15 | `book_name` | `TEXT (UTF-8)` | Official Bound Volume Title | `جلد 4 قلم انداز سال 1396 ولسوالی موسهی ولایت کابل` |
| 16 | `cropped_path` | `TEXT` | Historical Scanned Image Path | `\15\48\59864\41\1009.jpg` |

---

## 🔄 Data Ingestion & Zero-Loss Verification

If you ever need to re-ingest `two.txt` into a new SQLite database:

```bash
# Run the high-throughput zero-loss ingestion pipeline
python3 scripts/ingest_fast.py
```

### Ingestion Audit Report:
* **Total Source Rows:** `24,399,446`
* **Imported Database Rows:** `24,399,444`
* **Corrupt Rows in Raw Source:** `2` (Line `7,226,904` and Line `11,695,572` in `two.txt`)
* **Skipped Rows:** `0`
* **Unexplained Difference:** `0` (Zero unexplained data loss)
* **Ingestion Status:** **COMPLETE & VERIFIED**

---

## 🌟 Key Features & Platform Modules

1. **Executive Overview:** Real-time KPI summary tiles, top provinces chart, birth cohort distribution, and auto-generated smart narrative insights.
2. **Universal Search Hub:** Instant multi-column search supporting Dari/Persian Arabic characters (`ظریفه`, `انصار الله`), IDs, MD5 HashKeys, and physical volumes.
3. **Enterprise Data Explorer:** Server-side paginated table with sorting, column visibility toggle, and instant Record Drawer deep inspector.
4. **Geographic Analytics:** Province distribution bar chart, interactive district treemap, and Province $\times$ Gender breakdown matrix.
5. **Demographic Analytics:** Solar Hijri birth year timeline ($1300 - 1405$), gender cohort distribution, and generation breakdown.
6. **Book & Page Physical Explorer:** Volume density rankings and physical page utilization histogram.
7. **Statistical Relationship Lab:** Pearson ($r$) and Spearman ($\rho$) correlation heatmaps, Cramér's V categorical association ($V$), with explicit scientific notices (*"Correlation does not imply causation"*).
8. **Data Quality Center:** Composite quality gauge ($0-100\%$) across Completeness, Uniqueness, Validity, and Consistency, with a 16-column audit matrix.
9. **Streaming Exporters:** Download full or filtered dataset subsets in **CSV (with UTF-8 BOM for Microsoft Excel Persian text rendering)** or formatted JSON.

---

## 📡 REST API Reference & Endpoints

| Method | Endpoint | Query Parameters | Description |
|---|---|---|---|
| `GET` | `/api/health` | - | Health status & live record count |
| `GET` | `/api/ingestion/report` | - | Ingestion row count audit & verification metrics |
| `GET` | `/api/filters/options` | - | Dynamic filter dropdown options |
| `GET` | `/api/analytics/kpis` | `province, district, gender, year_min, year_max` | Executive summary KPIs |
| `GET` | `/api/analytics/geographic` | `gender, year_min, year_max` | Province & district distribution |
| `GET` | `/api/analytics/demographics`| `province, district, gender` | Solar Hijri birth cohorts & gender proportions |
| `GET` | `/api/analytics/books-pages` | `province, district` | Book volumes & page density histogram |
| `GET` | `/api/analytics/relationships`| - | Pearson ($r$), Spearman ($\rho$), Cramér's V ($V$) |
| `GET` | `/api/analytics/quality` | - | 16-column completeness & quality scores |
| `GET` | `/api/analytics/insights` | - | Auto-generated smart analytical insights |
| `GET` | `/api/records` | `page, page_size, sort_by, sort_order, q, ...` | Server-paginated records table |
| `GET` | `/api/records/{id}` | - | Single record detail inspector (16 fields) |
| `GET` | `/api/records/{id}/image`| - | Local image resolver for `CroppedPath` |
| `GET` | `/api/records/export` | `format=csv\|json, ...filters` | Streaming export with UTF-8 BOM |

---

## ❓ Troubleshooting & Common Issues

### 1. Port 8001 or 5173 is already in use
* **Symptom:** `error while attempting to bind on address: address already in use`.
* **Fix (Linux/macOS):**
  ```bash
  fuser -k 8001/tcp
  fuser -k 5173/tcp
  ```
* **Fix (Windows):**
  ```cmd
  netstat -ano | findstr :8001
  taskkill /PID <PID> /F
  ```

### 2. Dari / Persian Text mojibake in Microsoft Excel
* **Fix:** When downloading CSV files from the dashboard or `/api/records/export?format=csv`, the platform automatically prepends the **UTF-8 Byte Order Mark (`\xef\xbb\xbf`)**, allowing Microsoft Excel to render Arabic, Dari, and Persian characters cleanly.

### 3. Database is locked error
* **Fix:** If a previous process terminated abruptly on an exFAT filesystem, remove any leftover `.db-journal` file:
  ```bash
  rm -f database/data.db-journal
  ```

### 4. Running directly from an exFAT USB drive on Linux
* When running Python directly on an exFAT USB mount under Linux, run `pip install -r requirements.txt` directly without `venv` (or create `.venv` on your local SSD), because the Linux exFAT driver does not support POSIX symlinks.

---

## 🚚 Transferring to Another Computer

To give this project to another developer or client:

### 📦 Files to Transfer:
1. All project source code (`backend/`, `frontend/`, `analytics/`, `scripts/`, `docs/`)
2. Configuration files (`requirements.txt`, `package.json`, `.env.example`, `setup.sh`, `start.sh`, `setup.bat`, `start.bat`)
3. The dataset database file (`database/data.db`) or raw file (`data/two.txt`).

### ❌ Files NOT to Transfer:
* `node_modules/` or `frontend/node_modules/` (will be reinstalled via `npm install`)
* `.venv/` (will be recreated via `python -m venv .venv`)
* `__pycache__/` or `.vite/` build caches

### 🎯 Steps on the New Computer:
```bash
# 1. Enter project directory
cd Dashboard

# 2. Configure environment
cp .env.example .env

# 3. Run automated setup and start
chmod +x setup.sh start.sh
./setup.sh
./start.sh
```
*Open **`http://localhost:5173`** in your browser!*
# Afghan_Jalebi
