# 📊 Enterprise Civil Registry Data Analytics & Exploration Platform

An enterprise-grade, high-throughput analytical dashboard engineered to ingest, index, and explore **24.4+ million civil registration records** (9.9 GB raw UTF-16 LE dataset) with **instant sub-second response times**, universal multi-column search, verified family tree lineage reconstruction, cross-filtering, statistical relationship intelligence, and multi-format streaming export (PDF, Excel, CSV, JSON).

---

## ⚡ Enterprise Cyber-HUD Upgrade & Unified Reference Capabilities

This platform has been upgraded with the **Reference Cyber-HUD Architecture**, seamlessly integrating advanced biometric vector matching, neural translation, emergency relief records, and operator credential audits alongside the core 24.4M civil archives:

### 🌟 Unified Feature Matrix
1. **Dual-Stream Translation Studio (`/api/translate`):**
   - Side-by-side workbench for RTL native Afghan scripts (Dari `prs_Arab` / Pashto `pus_Arab`) and English `eng_Latn`.
   - Instant lexical translation dictionary + lazy-loaded Meta NLLB-200 3.3B neural model fallback.
   - One-click benchmark presets for Tazkira records, NSIA ledgers, and official verifications.
2. **128D Biometric Face Studio with Vector Arrow HUD (`/api/biometrics/*`):**
   - 128-dimensional Euclidean vector matching against biometric embeddings.
   - **Interactive Vector Arrow HUD (`TargetScanHUD.tsx`):** 8 multi-directional vector arrows dynamically flying in to impact facial landmarks with concentric shockwave rings, 128D Delaunay facial triangulation mesh, and 1-to-N candidate rankings.
3. **34-Province Geocartography GIS Matrix (`/api/analytics/provinces`):**
   - High-resolution cartography map showcase (`afghanistan-map.png` & `kochi-leaks.png`) with province dossier cards and quick jump navigation.
   - Live ECharts Treemaps and province-by-gender distribution analytics.
4. **Humanitarian RTP Relief Registry (`/api/rtp/records`):**
   - 626K emergency relief survey database across all 23 schema columns (PID, rations, bread loaves, vulnerability, nahya, gozar).
5. **IVP Security & Operator Credential Audit (`/api/ivp/audit`):**
   - 1,112 portal operator accounts across 48 regional offices with PBKDF2 hash inspection and role privilege controls.
6. **Cross-Domain Statistical Radar (`/api/stats/radar`):**
   - Multi-domain analytical telemetry unifying NSIA civil registries, RTP beneficiaries, and IVP operator accounts.

---

### 🚀 Quickstart & Verification Commands

```bash
# 1. Automated Dependency Setup
./setup.sh

# 2. Execute 13-Point Automated Verification Suite (100% Pass)
python3 tests/verify_upgrade.py

# 3. Launch Platform (FastAPI on :8001 + Vite on :5173)
./start.sh

# 4. Clean Process Termination
./stop.sh
```

---

## 📑 Table of Contents

1. [📂 Repository Files & Folder Structure Tree](#-repository-files--folder-structure-tree)
2. [⚙️ Path & Configuration Reference (Where to Change Paths)](#️-path--configuration-reference-where-to-change-paths)
3. [💻 Prerequisites & System Requirements](#-prerequisites--system-requirements)
4. [🚀 Complete Setup Guide by Operating System](#-complete-setup-guide-by-operating-system)
   * [A. Linux Setup (Ubuntu / Debian / Fedora / CentOS)](#a-linux-setup-ubuntu--debian--fedora)
   * [B. macOS Setup (Apple Silicon & Intel)](#b-macos-setup-apple-silicon--intel)
   * [C. Windows 10 / 11 Setup (PowerShell / Command Prompt)](#c-windows-10--11-setup)
5. [⚡ How to Run the Platform](#-how-to-run-the-platform)
   * [Option 1: One-Command Automated Start (Recommended)](#option-1-one-command-automated-start-recommended)
   * [Option 2: Manual Dual-Terminal Execution](#option-2-manual-dual-terminal-execution)
6. [📱 Accessing from Other Devices on Local Network (Wi-Fi / LAN)](#-accessing-from-other-devices-on-local-network-wi-fi--lan)
7. [📦 Transferring the Project to Another Computer or USB Drive](#-transferring-the-project-to-another-computer-or-usb-drive)
8. [💾 Database vs Raw Dataset Scenarios](#-database-vs-raw-dataset-scenarios)
9. [🏛 System Architecture](#-system-architecture)
10. [📋 16 Core Columns Schema](#-16-core-columns-schema)
11. [🌟 Key Platform Modules](#-key-platform-modules)
12. [📡 REST API Reference](#-rest-api-reference)
13. [🛠 Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 📂 Repository Files & Folder Structure Tree

Below is the complete architectural layout of the project:

```text
Dashboard/
├── .env.example                     # Environment configuration template (paths, ports, hosts)
├── .env                             # Active environment configuration (created during setup)
├── requirements.txt                 # Python backend package dependencies
├── setup.sh                         # Automated one-click setup script for Linux & macOS
├── start.sh                         # Automated dual-server startup script for Linux & macOS
├── stop.sh                          # Process shutdown utility for background instances
├── setup.bat                        # Automated setup script for Windows
├── start.bat                        # Automated dual-server launcher for Windows
├── README.md                        # Complete project documentation & setup manual
│
├── data/                            # Raw dataset directory (Optional if using pre-built database)
│   └── two.txt                      # Raw source dataset (9.9 GB, 24.4M lines, UTF-16 LE CSV)
│
├── database/                        # Database storage directory
│   ├── data.db                      # Primary SQLite database (23.8M records, B-Tree indexed)
│   ├── analytics.db                 # Cache database for precomputed aggregates & metrics
│   └── test.db                      # Temporary test database for unit test fixtures
│
├── backend/                         # FastAPI Python REST API Backend
│   ├── __init__.py
│   ├── database.py                  # Database connection pool, PRAGMA optimizations, path resolver
│   └── main.py                      # REST endpoints, search router, family lineage engine, export center
│
├── analytics/                       # Analytical & Statistical Processing Core
│   ├── __init__.py
│   └── engine.py                    # Pure-Python statistical engine (Pearson, Spearman, Cramér's V)
│
├── scripts/                         # Maintenance & Data Pipeline Scripts
│   ├── ingest_fast.py               # High-speed bulk CSV ingestor with zero-loss audit tracking
│   └── ingest_dataset.py            # Alternate batch streaming ingestion script
│
├── tests/                           # Quality Assurance & Pipeline Tests
│   └── test_pipeline.py             # Ingestion & data integrity verification tests
│
├── docs/                            # Deep Architectural & Engineering Documentation
│   ├── ARCHITECTURE.md              # System design, data flow, and performance benchmarks
│   ├── DATA_DICTIONARY.md           # Field-by-field definitions, encoding, and valid values
│   ├── DATA_PIPELINE.md             # Ingestion pipeline specifications & throughput analysis
│   ├── DATA_QUALITY.md              # 16-column completeness & uniqueness audit matrix
│   ├── PERFORMANCE.md               # SQLite indexing, memory usage, and caching strategies
│   ├── SEARCH.md                    # Dari/Persian Unicode normalization & B-Tree search architecture
│   └── SECURITY.md                  # Input sanitization, SQL injection prevention, read-only guarantees
│
└── frontend/                        # React + TypeScript + Vite Web Dashboard
    ├── index.html                   # HTML entry point with Persian/Dari web font support
    ├── package.json                 # Frontend dependencies (React, Lucide, ECharts, Tailwind)
    ├── package-lock.json
    ├── tsconfig.json                # TypeScript compiler configuration
    ├── vite.config.ts               # Vite build tool config with backend API reverse proxy
    ├── tailwind.config.js           # Tailwind CSS theme & custom styling rules
    ├── postcss.config.js
    └── src/
        ├── main.tsx                 # React application mounting point
        ├── App.tsx                  # Top-level shell, global route views, export & modal triggers
        ├── index.css                # Global CSS styles, custom scrollbars, animations
        │
        ├── types/
        │   └── index.ts             # TypeScript interfaces (RecordItem, FamilyTreeData, KPIs, etc.)
        │
        ├── services/
        │   └── api.ts               # Axios / Fetch client communicating with backend endpoints
        │
        ├── context/
        │   └── FilterContext.tsx    # Synchronized global filter state (Province, District, Book, Year, Gender)
        │
        ├── utils/
        │   └── geoTranslation.ts    # Dual English & Dari/Persian province/district mapping dictionaries
        │
        └── components/
            ├── common/              # Reusable UI widgets & Modals
            │   ├── RecordDrawer.tsx # Centered Record Inspector Modal (two-column attributes card)
            │   ├── ExportModal.tsx  # Universal Multi-Format Export Center (PDF, Excel, CSV, JSON)
            │   └── ExplainModal.tsx # Statistical definition tooltip & documentation modals
            │
            ├── layout/              # Persistent UI scaffolding
            │   ├── Header.tsx       # Top navigation, record search trigger, system status
            │   ├── Sidebar.tsx      # Platform module navigation bar
            │   └── GlobalFilterBar.tsx # Synchronized multi-page filter controls
            │
            └── views/               # Primary platform feature modules
                ├── ExecutiveOverview.tsx     # High-level KPIs, province charts, year distribution
                ├── AdvancedSearch.tsx        # Universal search hub (Name, ID, MD5, Book)
                ├── DataExplorer.tsx          # 23.8M record data grid with sorting & page jump
                ├── RelationshipLab.tsx       # Verified Family Tree & Generational Lineage Explorer
                ├── GeographicAnalytics.tsx   # Province breakdown & interactive district treemap
                └── BookPageExplorer.tsx      # Archival volume catalog & page utilization
```

---

## ⚙️ Path & Configuration Reference (Where to Change Paths)

All paths and network configurations are centralized in the `.env` file at the root of the project.

### 1. `.env` Configuration File
Create or modify `.env` in the root directory:

```env
# ==============================================================================
# Enterprise Data Analytics & Exploration Platform - Configuration
# ==============================================================================

# 1. Path to Raw Dataset (Only required if re-ingesting two.txt)
# Can be relative to project root or an absolute path:
# Examples:
#   Linux/macOS: DATA_FILE=./data/two.txt or DATA_FILE=/mnt/storage/two.txt
#   Windows:     DATA_FILE=C:\data\two.txt or DATA_FILE=D:\Datasets\two.txt
DATA_FILE=./data/two.txt

# 2. Path to SQLite Database
# Point this to where your data.db file is stored:
# Examples:
#   Linux/macOS: DATABASE_FILE=./database/data.db or DATABASE_FILE=/var/data/data.db
#   Windows:     DATABASE_FILE=C:\Dashboard\database\data.db
DATABASE_FILE=./database/data.db

# 3. Server Network Bindings
HOST=0.0.0.0
BACKEND_PORT=8001
FRONTEND_PORT=5173
```

### 2. Changing the Backend Port
If port `8001` is already in use on your system:
1. Change `BACKEND_PORT=8005` in your `.env` file.
2. Update the proxy target in `frontend/vite.config.ts`:
   ```ts
   proxy: {
     '/api': {
       target: 'http://127.0.0.1:8005', // <-- Set matching port here
       changeOrigin: true
     }
   }
   ```
3. Update `start.sh` or `start.bat` port arguments accordingly.

### 3. Moving `data.db` to an External Drive or SSD
If you want to place the 13 GB database on an external SSD or another drive:
1. Move `database/data.db` to your target path (e.g., `/mnt/fast_ssd/data.db` or `D:\data.db`).
2. Update `DATABASE_FILE` in `.env`:
   ```env
   DATABASE_FILE=/mnt/fast_ssd/data.db
   ```
3. Restart the backend. The system will immediately bind to the new location.

---

## 💻 Prerequisites & System Requirements

Ensure the following tools are installed on your host system:

| Dependency | Minimum Version | Recommended | Notes |
|---|---|---|---|
| **Python** | 3.10+ | 3.11 or 3.12 | Required for FastAPI & analytical processing |
| **Node.js** | v18.0.0+ | v20.x or v22.x LTS | Required for Vite & React frontend |
| **npm** | v9.0.0+ | v10.x+ | Distributed with Node.js |
| **RAM** | 8 GB | 16 GB | In-memory indexing & ECharts rendering |
| **Disk Space** | 15 GB SSD | 30 GB SSD | 13 GB for `data.db` (+ 10 GB if raw `two.txt` kept) |

---

## 🚀 Complete Setup Guide by Operating System

### A. Linux Setup (Ubuntu / Debian / Fedora)

#### 1. Install System Dependencies
```bash
# Ubuntu / Debian
sudo apt update
sudo apt install -y python3 python3-pip python3-venv nodejs npm git

# Fedora / RHEL
sudo dnf install -y python3 python3-pip nodejs npm git
```

#### 2. Clone / Open the Project
```bash
cd /path/to/Dashboard
```

#### 3. Configure `.env`
```bash
cp .env.example .env
```
*(Optionally edit `.env` with `nano .env` if your database is in a custom path).*

#### 4. Create Python Virtual Environment & Install Dependencies
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

#### 5. Install Frontend Dependencies & Build Assets
```bash
cd frontend
npm install
npm run build
cd ..
```

#### 6. Make Scripts Executable
```bash
chmod +x setup.sh start.sh stop.sh
```

---

### B. macOS Setup (Apple Silicon & Intel)

#### 1. Install Dependencies via Homebrew
```bash
brew install python node
```

#### 2. Clone / Open the Project
```bash
cd /path/to/Dashboard
```

#### 3. Configure `.env`
```bash
cp .env.example .env
```

#### 4. Set Up Python Virtual Environment
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

#### 5. Install Frontend Packages
```bash
cd frontend
npm install
npm run build
cd ..
```

#### 6. Make Scripts Executable
```bash
chmod +x setup.sh start.sh stop.sh
```

---

### C. Windows 10 / 11 Setup

#### 1. Install Required Software
* Download & install **Python 3.11+** from [python.org](https://www.python.org/downloads/) (*Check the box "Add python.exe to PATH"*).
* Download & install **Node.js LTS** from [nodejs.org](https://nodejs.org/).

#### 2. Open Command Prompt or PowerShell
Navigate to the project folder:
```cmd
cd C:\path\to\Dashboard
```

#### 3. Configure `.env`
```cmd
copy .env.example .env
```

#### 4. Set Up Python Virtual Environment
```cmd
python -m venv .venv
call .venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

#### 5. Install Frontend Packages
```cmd
cd frontend
npm install
npm run build
cd ..
```

---

## ⚡ How to Run the Platform

### Option 1: One-Command Automated Start (Recommended)

#### On Linux / macOS:
```bash
./start.sh
```
* Both the FastAPI backend and Vite frontend will start in parallel.
* Logs are automatically streamed to `backend.log` and `frontend.log`.
* To stop both services gracefully, press `Ctrl+C` in the terminal or run `./stop.sh`.

#### On Windows:
Double-click **`start.bat`** in Windows Explorer, or execute in Command Prompt:
```cmd
start.bat
```

---

### Option 2: Manual Dual-Terminal Execution

If you wish to run backend and frontend in separate dedicated terminal windows:

#### Terminal 1 — Backend (FastAPI API Server):
```bash
# Linux / macOS:
source .venv/bin/activate
uvicorn backend.main:app --host 0.0.0.0 --port 8001 --reload

# Windows:
call .venv\Scripts\activate
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8001 --reload
```
* **API URL:** `http://localhost:8001`
* **Swagger Docs:** `http://localhost:8001/docs`
* **Healthcheck:** `http://localhost:8001/api/health`

#### Terminal 2 — Frontend (Vite Development Server):
```bash
cd frontend
npm run dev
```
* **Dashboard UI:** `http://localhost:5173`

---

## 📱 Accessing from Other Devices on Local Network (Wi-Fi / LAN)

Both the FastAPI backend and Vite frontend bind to `0.0.0.0` by default, allowing you to access the dashboard from any **mobile phone, tablet, or another laptop** connected to the same Wi-Fi or office network.

### Step 1: Find your Host Computer's Local IP Address
* **On Linux:**
  ```bash
  ip -br a
  # or: hostname -I
  ```
* **On Windows:**
  ```cmd
  ipconfig
  ```
  *(Look for the **IPv4 Address**, typically starting with `192.168.x.x` or `10.x.x.x`).*
* **On macOS:**
  ```bash
  ipconfig getifaddr en0
  ```

### Step 2: Open from Any Other Device
On your phone, tablet, or secondary laptop connected to the same Wi-Fi network:
* Open any browser (Chrome, Safari, Edge) and navigate to:
  ```text
  http://<HOST_IP>:5173
  ```
  *(For example: `http://192.168.1.150:5173`)*

### Step 3: Firewall Access (If page doesn't load)
* **Linux (UFW):**
  ```bash
  sudo ufw allow 5173/tcp
  sudo ufw allow 8001/tcp
  ```
* **Windows Defender Firewall:** When first running `start.bat`, click **"Allow Access"** on the Windows Firewall prompt for Python and Node.js.

---

## 📦 Transferring the Project to Another Computer or USB Drive

To share this project with a colleague or set it up on another workstation:

### 1. Files to Copy
* The entire project directory including all source code (`backend/`, `frontend/`, `analytics/`, `scripts/`, `docs/`).
* Configuration and launcher files (`.env.example`, `requirements.txt`, `setup.sh`, `start.sh`, `setup.bat`, `start.bat`).
* **The database file:** `database/data.db` (13 GB).

### 2. Files to SKIP (Do NOT copy)
To avoid multi-gigabyte transfers and binary OS incompatibilities, do NOT copy:
* ❌ `node_modules/` or `frontend/node_modules/` (will be reinstalled cleanly via `npm install`)
* ❌ `.venv/` (will be recreated cleanly on the target OS)
* ❌ `dist/` or `__pycache__/`

### 3. Setup on the New Computer (1-Click)
Once files are copied to the new computer:

* **On Linux / macOS:**
  ```bash
  cd Dashboard
  chmod +x setup.sh start.sh stop.sh
  ./setup.sh
  ./start.sh
  ```
* **On Windows:**
  Double-click **`setup.bat`**, then double-click **`start.bat`**.

---

## 💾 Database vs Raw Dataset Scenarios

### Scenario 1: You Already Have `database/data.db` (Most Common)
If `database/data.db` (13 GB) is already provided in the folder:
* **No ingestion needed!**
* Simply run `./start.sh` (or `start.bat`), and the platform will load instantly with all 23.8M records ready for sub-second querying.

### Scenario 2: You Only Have the Raw `two.txt` Dataset File
If you have the raw 9.9 GB file (`two.txt`) and need to generate a new database:
1. Place `two.txt` inside `data/two.txt` (or set `DATA_FILE=/path/to/two.txt` in `.env`).
2. Run the high-speed streaming ingestion pipeline:
   ```bash
   source .venv/bin/activate
   python3 scripts/ingest_fast.py
   ```
3. The script will:
   * Process all 24.4M lines in binary streaming chunks.
   * Verify character encodings and strip corrupt bytes.
   * Build 9 high-performance multi-column B-Tree indexes.
   * Generate `ingestion_meta` zero-loss audit counts.

---

## 🏛 System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                       React Frontend (Port 5173)                       │
│  • Executive Overview (KPIs, Province Charts, Cohort Analysis)         │
│  • Universal Search Hub (Dari / Persian Unicode + Exact / Prefix)      │
│  • Enterprise Data Explorer (16 Columns, Sorting, Page Jump)           │
│  • Relationship Lab (Verified Generational Family Tree Lineage)        │
│  • Geographic & Demographic Visual Analytics (Treemaps, ECharts)       │
│  • Data Quality Center (Completeness, Uniqueness, 16-Column Audit)     │
│  • Multi-Format Export Modal (PDF with Persian Shaping, Excel, CSV)    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP REST API (/api/*)
┌───────────────────────────────────▼────────────────────────────────────┐
│                      FastAPI Backend (Port 8001)                       │
│  • Parameterized Query Engine with dynamic B-Tree Index Routing        │
│  • Strict Genealogical Verification Algorithm (Lineage & Age Validation│
│  • In-Memory Precomputed Analytics Retrieval (< 10ms response)         │
│  • Arabic/Dari RTL Shaping & ReportLab PDF Exporter Engine             │
│  • OpenPyXL Styled Excel Generator with Metadata Audit Sheet           │
│  • Streaming UTF-8 BOM CSV Engine (Excel-Compatible mojibake fix)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ SQLite C Engine (WAL Mode, 64MB Cache)
┌───────────────────────────────────▼────────────────────────────────────┐
│                  Indexed SQLite Database (`database/data.db`)          │
│  • `records` Table (23,839,823 unique civil entries)                   │
│  • 9 Multi-Column B-Tree Indexes (idx_records_names, idx_geo, etc.)    │
│  • `analytics_cache` (Instant pre-calculated metrics)                  │
│  • `ingestion_meta` (Zero-loss row count verification ledger)          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 16 Core Columns Schema

Every citizen identity record contains 16 verified civil attributes:

| # | Column Name | SQLite Type | Description | Example |
|---|---|---|---|---|
| 1 | `id` | `INTEGER PRIMARY KEY` | Unique registry entry ID | `1009` |
| 2 | `integer_key` | `INTEGER` | System sequence key | `634067377` |
| 3 | `hash_key` | `TEXT (32)` | MD5 identity fingerprint | `B3BDB5290D8773A703554E96DA34E64F` |
| 4 | `name` | `TEXT (UTF-8)` | Citizen Personal Name (نام) | `ظریفه` |
| 5 | `fname` | `TEXT (UTF-8)` | Father's Name (نام پدر) | `لالا شیرین` |
| 6 | `gname` | `TEXT (UTF-8)` | Grandfather's Name (نام پدرکلان) | `در محمد` |
| 7 | `dob_year` | `INTEGER` | Birth Year (Solar Hijri هجری شمسی) | `1388` (~2009 CE) |
| 8 | `gender` | `INTEGER` | Demographic Code (`0` = Male, `1` = Female) | `1` |
| 9 | `province` | `TEXT (UTF-8)` | Province Name (ولایت) | `کابل` |
| 10 | `district` | `TEXT (UTF-8)` | District Name (ولسوالی) | `موسهی` |
| 11 | `province_code`| `TEXT (3)` | Standard Province Code | `KBL` |
| 12 | `district_code`| `TEXT (4)` | Administrative District Code | `0107` |
| 13 | `record_number`| `INTEGER` | Ledger Entry Ordinal Number | `201` |
| 14 | `page_number` | `INTEGER` | Physical Volume Page Number | `41` |
| 15 | `book_name` | `TEXT (UTF-8)` | Official Bound Volume Title | `جلد 4 قلم انداز سال 1396 ولسوالی موسهی ولایت کابل` |
| 16 | `cropped_path` | `TEXT` | Historical Scanned Image Path | `\15\48\59864\41\1009.jpg` |

---

## 🌟 Key Platform Modules

1. **Executive Overview:** High-level KPIs, province charts, and birth cohort distribution across 23.8M records.
2. **Universal Search Hub:** Sub-second search across Persian/Dari names, national IDs, MD5 hash fingerprints, and volume names.
3. **Enterprise Data Explorer:** Server-side paginated table with sorting, column customization, and centered **Record Inspector Modal**.
4. **Verified Family Tree & Lineage Reconstruction (Relationship Lab):**
   * Visualizes 4 verified generational tiers:
     $$\text{Grandfather (پدرکلان)} \longrightarrow \text{Father (پدر)} \longrightarrow \text{Target Subject \& Siblings} \longrightarrow \text{Children (Sons \& Daughters)}$$
   * **Strict Verification:** Eliminates arbitrary heuristics or fake spouses. Children require verified patrilineal lineage (`fname == target.name` AND `gname == target.fname`) and biological age gap validation ($\ge 15$ years).
5. **Geographic Analytics:** Province distribution rankings, district treemaps, and regional gender breakdowns.
6. **Book & Physical Page Explorer:** Archival volume rankings and physical ledger documentation metrics.
7. **Statistical Relationship Lab:** Pearson ($r$), Spearman ($\rho$), and Cramér's V categorical association.
8. **Data Quality Center:** 16-column completeness & uniqueness audit matrix.
9. **Universal Multi-Format Export Center:** Export custom subsets up to 25,000 rows in **PDF** (with proper right-to-left Persian shaping), **Excel `.xlsx`** (styled with summary audit tab), **CSV** (with UTF-8 BOM preventing Excel encoding bugs), or **JSON**.

---

## 📡 REST API Reference

| Method | Endpoint | Query Parameters | Description |
|---|---|---|---|
| `GET` | `/api/health` | - | Health status, database connection, and total record count |
| `GET` | `/api/filters/options` | - | Dynamic filter options for provinces, districts, books, and years |
| `GET` | `/api/analytics/kpis` | `province, district, gender, year_min, year_max` | Live KPI calculations reflecting active filters |
| `GET` | `/api/records` | `page, page_size, sort_by, sort_order, q, ...` | Server-paginated records table query |
| `GET` | `/api/records/{id}` | - | Single citizen record inspector (16 verified fields) |
| `GET` | `/api/records/{id}/family-tree` | - | Verified generational lineage reconstruction |
| `GET` | `/api/records/export` | `format=csv\|json\|xlsx\|pdf, limit, columns, ...` | Universal multi-format streaming export |
| `GET` | `/api/reports/executive-summary-pdf` | - | Executive C-level summary report in PDF format |

---

## 🛠 Troubleshooting & FAQ

### 1. Port `8001` or `5173` is already in use
* **Linux / macOS:**
  ```bash
  fuser -k 8001/tcp
  fuser -k 5173/tcp
  ```
* **Windows:**
  ```cmd
  netstat -ano | findstr :8001
  taskkill /PID <PID> /F
  ```

### 2. Dari / Persian text looks corrupted in Microsoft Excel
* **Fix:** When downloading CSV files from the dashboard or API, the platform automatically includes the **UTF-8 Byte Order Mark (`\xef\xbb\xbf`)**, which tells Excel to render Dari, Pashto, and Persian characters cleanly. Alternatively, export directly as **Excel (`.xlsx`)** from the Export Modal.

### 3. Database is locked (`database is locked`)
* **Fix:** Occurs if an ungraceful shutdown occurred while a write transaction was open. Run:
  ```bash
  rm -f database/data.db-journal
  ```

### 4. Running from an exFAT USB Drive on Linux
* The Linux `exFAT` filesystem driver does not support POSIX symlinks needed by virtual environments.
* **Fix:** Create `.venv` on your local SSD drive (`~/.venv_dashboard`) and point your execution to it, while keeping `data.db` on the USB drive configured in `.env`.
