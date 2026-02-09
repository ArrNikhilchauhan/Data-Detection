🛡️ Data Quality, Anomaly & Drift Detection Platform

(Production-Grade | Explainable | Deterministic | No Deep Learning)

Overview

This project is a production-grade data quality and reliability platform designed to detect:

Data quality issues

Statistical anomalies

Dataset drift over time

Overall dataset health

Operational risks with actionable decisions

Unlike notebook-based or black-box ML approaches, this system is built with engineering rigor, deterministic behavior, and auditability as first-class concerns.

It is designed as a backend platform component, similar to what would run behind ML pipelines, ETL systems, or data platforms in real companies.

🎯 Problem This System Solves

In real-world data systems:

Data silently degrades

Distributions drift without alerts

Pipelines continue running on bad data

Failures are detected after damage is done

Most teams either:

rely on ad-hoc scripts, or

use opaque ML tools that are hard to trust and debug

This system provides a defensive, explainable, and operationally safe alternative.

🧠 Core Design Philosophy

❌ No deep learning

❌ No black-box decisions

❌ No silent failures

Instead:

✅ Deterministic statistical methods

✅ Strong invariants and guards

✅ Explainable decisions

✅ Production-ready architecture

🏗️ High-Level Architecture
Client
  ↓
FastAPI (Auth, Validation, Limits)
  ↓
Runners (Pure Computation)
  ↓
Core Guards (Invariants, Budgets, Circuit Breakers)
  ↓
PostgreSQL (History, Trends, Rate Limits)

Layered Design
Layer	Responsibility
API	Validation, auth, orchestration
Runner	Profiling, anomaly, drift, health logic
Core	Invariants, execution budgets, guards
DB	Persistence, history, rate limiting
Observability	Logs, metrics, tracing
🔍 What This System Detects
1️⃣ Data Profiling

Column-level statistics

Null rates, uniqueness

Distribution summaries

Percentiles (used downstream)

2️⃣ Anomaly Detection

IQR-based outliers

Z-score based anomalies

Column-wise anomaly rates

Severity classification

3️⃣ Drift Detection

PSI (Population Stability Index) — magnitude of drift

KS Test — statistical validation

Combined verdict logic to avoid false positives

4️⃣ Dataset Health Score

Score ∈ [0, 100]

Deterministic deductions

Capped impact per signal

Fully explainable breakdown

5️⃣ Operational Decisions

Examples:

NO_ACTION

MONITOR

WARN

BLOCK_PIPELINE

Every decision is:

explainable

reproducible

auditable

📊 Explainability (First-Class Feature)

If the system returns an action like BLOCK_PIPELINE, it also returns:

Which signals caused it

Severity of each signal

Score impact

Recommended next steps

No free-text summaries.
Everything is machine-readable and contract-stable.

🧱 Production-Grade Guarantees
Invariants (Things That Can NEVER Happen)

No report persisted without full computation

No operational action without explanation

No duplicate runs per dataset

No unbounded computation

No silent partial failures

Violating any invariant → request fails safely.

🔐 Security & Abuse Protection

API key–based authentication

No anonymous access

Request size limits (CSV uploads)

Dataset-level rate limiting

Execution budgets (columns & metrics)

Circuit breakers for repeated failures

Swagger disabled in production

📈 Observability

Built-in observability from day one:

Structured JSON logs

Request correlation IDs

Prometheus metrics

Latency histograms

Health score telemetry

SLO definitions

Alert conditions documented

This system explains itself when it fails.

🗄️ Persistence & History

PostgreSQL as the single source of truth

Historical health scores

Trend detection

Previous vs current comparisons

No duplicate entries

Strong identity model (dataset_name + run_id)

🚀 How to Run Locally
1️⃣ Clone the repo
git clone https://github.com/your-username/data-quality-platform.git
cd data-quality-platform

2️⃣ Create environment variables
cp .env.example .env


Required:

API_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

3️⃣ Install dependencies
pip install -r requirements.txt

4️⃣ Run the server
uvicorn app.main:app --reload

📡 API Usage (Example)
Health Report
curl -X POST http://localhost:8000/health \
  -H "x-api-key: your-secret-key" \
  -F "reference=@reference.csv" \
  -F "current=@current.csv" \
  -F "dataset_name=customer_metrics"

Operational Report
curl -X POST http://localhost:8000/operational \
  -H "x-api-key: your-secret-key" \
  -F "reference=@reference.csv" \
  -F "current=@current.csv" \
  -F "dataset_name=customer_metrics"

🖥️ Frontend (Planned)

A React-based frontend will be added to:

Upload datasets

View profiling summaries

Inspect drift & anomaly signals

Track health score trends

Visualize operational decisions

The frontend will act as a thin visualization layer over this backend — no business logic duplication.

❌ What This Project Does NOT Do (By Design)

No deep learning models

No auto-fixing of data

No UI-first design

No streaming ingestion (yet)

These are conscious trade-offs to preserve explainability, determinism, and safety.

🧪 Testing Philosophy

Unit tests for pure computation

Invariant-based failure testing

Transactional safety checks

Deterministic outputs for same inputs

🧠 Key Design Decisions

Why PSI + KS?
PSI captures drift magnitude; KS validates statistical difference. Together they reduce false positives.

Why no deep learning?
Black-box models break auditability and trust for data quality systems.

Why DB-backed rate limits?
In-memory counters fail on restarts and horizontal scaling.

Why dataset-level identity?
Ensures historical continuity and prevents duplication.
