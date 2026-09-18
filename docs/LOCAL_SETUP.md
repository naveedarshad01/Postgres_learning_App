> Account-enabled Vercel edition: first complete ACCOUNT_SETUP.md for login and cloud progress. The PostgreSQL steps below set up a separate practice server, not account authentication.

# Local PostgreSQL setup

The browser app, pgAdmin and DBeaver are different clients. A native server is required for the latter two. Do not use production data for these drills.

## pgadmin

### 1. Install the database server

Install a supported PostgreSQL release (16 or later) from postgresql.org/download. pgAdmin is a client; it needs the PostgreSQL server too. Keep the port (usually 5432), username (often postgres) and the password you choose during installation.

### 2. Register your local server

Open pgAdmin. If the server is not already listed, right-click Servers → Register → Server. Name it Local PostgreSQL. Under Connection use host localhost, port 5432, maintenance database postgres, and your installation username/password.

### 3. Create an empty practice database

Right-click Databases → Create → Database. Name it pg_workbench and save. Alternatively open Query Tool on postgres and run CREATE DATABASE pg_workbench; by itself, outside any transaction.

### 4. Load the practice dataset

Open Query Tool on pg_workbench. Download academy.sql below, open it in the editor, and execute the entire script. Do not use the Restore dialog: this is plain SQL, not a custom-format backup. It creates academy and lab schemas.

### 5. Verify and begin

Refresh Schemas and run the verification query below. You should see 10,000 orders, 30,000 order items and 600 cells. Open an exercise in the app, copy its task or SQL, and run it in Query Tool. Use academy.table_name explicitly.

## dbeaver

### 1. Install PostgreSQL separately

Install a PostgreSQL server (16+) before connecting. DBeaver Community is a database client and does not create a PostgreSQL server on its own. Start the database service.

### 2. Create a connection

In DBeaver choose Database → New Database Connection → PostgreSQL. Enter host localhost, port 5432, database postgres and your installation username/password. Accept the PostgreSQL driver download if requested, then Test Connection.

### 3. Create the database

Open SQL Editor on the postgres connection with auto-commit enabled. Run CREATE DATABASE pg_workbench; as a single statement outside a transaction. Edit or duplicate the connection so its Database field is pg_workbench, then reconnect.

### 4. Run the SQL script

Download academy.sql. Open it in SQL Editor and confirm the active connection is pg_workbench. Choose Execute SQL Script for the full file; executing only the current statement will not load the full dataset.

### 5. Browse and practice

Refresh the connection, expand schemas academy and lab, and inspect tables or the built-in ER diagram. Run the verification query below. Copy exercise SQL into this connection; use lab for your design tables.

## docker

### 1. Optional server with Docker

Use this route if Docker Desktop or Docker Engine is already installed. Copy .env.example to .env and choose a local practice password. Keep that file private.

### 2. Start the supplied service

From the extracted application folder run docker compose up -d. The compose file starts PostgreSQL 16 on localhost:5433 and loads academy.sql into a fresh pg_workbench database. Initial startup takes a few moments.

### 3. Connect your preferred client

In pgAdmin or DBeaver use host localhost, port 5433, database pg_workbench, user learner and the password from .env. The alternate port avoids a common collision with a native PostgreSQL installation.

### 4. Keep your database

docker compose stop stops the service without deleting the named volume. docker compose up -d starts it again. Do not remove the volume unless you intend to erase this practice database. Initial SQL scripts run only when the volume is empty.

## Verify your import

```sql
SELECT (SELECT count(*) FROM academy.orders) AS orders,
       (SELECT count(*) FROM academy.order_items) AS order_items,
       (SELECT count(*) FROM academy.cells) AS cells;
```

Expected counts: 10,000 orders, 30,000 items, 600 cells.

## Full-server drills

### Observe a row lock with two connections

1. In connection A, run BEGIN; UPDATE academy.inventory SET quantity=quantity+1 WHERE warehouse_id=1 AND product_id=1; Leave the transaction open.

2. In connection B, run SET lock_timeout='3s'; followed by the same UPDATE. Observe the lock timeout rather than assuming the server has crashed.

3. ROLLBACK connection A. Repeat the update in B: it should now succeed. Undo the increment if you want to keep the original data.

4. Explain why this needs two independent connections and how consistent lock ordering reduces deadlocks.

### Back up and restore into a separate database

1. Run pg_dump -h localhost -U postgres -Fc -f pg_workbench.dump pg_workbench using the appropriate user/port for your installation.

2. Create a different empty database: createdb -h localhost -U postgres pg_workbench_restore.

3. Restore with pg_restore -h localhost -U postgres -d pg_workbench_restore pg_workbench.dump. Do not overwrite your working database.

4. Run the verification query on the restored database. Compare table counts and a known report total. Record how long recovery took.

### Prove a reporting role is read-only

1. As an administrator in your dedicated practice database, create role report_reader NOLOGIN. Grant USAGE on schema academy and SELECT on all its current tables.

2. Run BEGIN; SET LOCAL ROLE report_reader; then SELECT count(*) FROM academy.orders; It should succeed.

3. Try an INSERT into academy.orders. It should fail with insufficient privilege. ROLLBACK to clear the aborted transaction.

4. Explain why new tables need default privileges configured for the role that creates them. Do not use the administrator account in a real application.

### Measure a query plan before and after indexing

1. Run EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM academy.orders WHERE order_date>=DATE '2025-11-01' AND order_date<DATE '2025-12-01'; Record the plan.

2. Create an index on academy.orders(order_date), run ANALYZE academy.orders, then run the same EXPLAIN again.

3. Compare actual/estimated rows, scan choice, buffers and execution time. The planner may legitimately prefer a sequential scan.

4. Document the data size and why a 10,000-order result does not prove the same improvement at production scale.

### Publish a reproducible commerce analysis locally

1. Save the module 29 queries and document date window, status exclusions, currency and metric grain.

2. Add at least three checks: duplicate keys, payment reconciliation and explicit NULL handling.

3. Write a one-page interpretation of the results with two business questions to investigate next.

4. Package your SQL and README so another person can load the provided seed and reproduce every number.

### Deliver a network KPI investigation

1. Save module 28 SQL with the PRB, throughput and availability thresholds clearly stated.

2. Add a calendar-based data completeness check and compare cell-day counts by region.

3. Explain which cells should be investigated, which evidence is missing, and why correlation does not prove the root cause.

4. Include a schema description, query plan and a short validation note with your analysis.

## Reporting-role SQL

Run as an administrator only inside your dedicated practice database. Use a role name that does not already exist.

```sql
CREATE ROLE report_reader NOLOGIN;
GRANT USAGE ON SCHEMA academy TO report_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA academy TO report_reader;
-- Run default-privilege setup as the role that will create new tables.
ALTER DEFAULT PRIVILEGES IN SCHEMA academy GRANT SELECT ON TABLES TO report_reader;
BEGIN;
SET LOCAL ROLE report_reader;
SELECT count(*) FROM academy.orders;
-- Expected error: insufficient privilege
INSERT INTO academy.orders VALUES (999999,1,DATE '2025-01-01','pending','web',0);
ROLLBACK;
```

## Official references

- [PostgreSQL installation](https://www.postgresql.org/download/)
- [pgAdmin Query Tool](https://www.pgadmin.org/docs/pgadmin4/latest/query_tool.html)
- [DBeaver connections](https://dbeaver.com/docs/dbeaver/Create-Connection/)
- [PostgreSQL backup and restore](https://www.postgresql.org/docs/current/backup-dump.html)
- [Vercel Vite deployment](https://vercel.com/docs/frameworks/frontend/vite)
- [PGlite engine](https://pglite.dev/docs/)
