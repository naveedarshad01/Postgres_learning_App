# PG Workbench — Complete course handbook

30 modules · 90 exercises · 60 interview cards · 20 knowledge questions

The 7-day route is intensive revision; readiness depends on demonstrated skills, not elapsed days.

## 7-day plan

7–9 hours / day. A demanding revision sprint for people who already know basic SQL. Extend the schedule if checks expose gaps.

| Day | Modules |
|---|---|
| 1 | 1. Your first PostgreSQL queries; 2. Filter precisely; 3. Sort, search and paginate; 4. Aggregate business metrics |
| 2 | 5. Group and segment; 6. Join related tables; 7. Outer, anti and self joins; 8. NULLs and conditional logic |
| 3 | 9. Dates, intervals and cohorts; 10. Subqueries and existence; 11. Readable queries with CTEs; 12. Window functions |
| 4 | 13. Top-N, frames and deduplication; 14. Set operations; 15. JSONB and arrays; 16. Clean and validate data |
| 5 | 17. Design tables and constraints; 18. Relationships and normalization; 19. Insert, update and delete safely; 20. Transactions and idempotent writes |
| 6 | 21. Indexes and execution plans; 22. Views and reporting contracts; 23. Functions and audit triggers; 24. Recursive hierarchies; 25. Time series and lateral joins |
| 7 | 26. Query tuning and scalable design; 27. Security, recovery and concurrency; 28. Telecom analytics capstone; 29. Commerce analytics capstone; 30. Final interview rehearsal |

## 15-day plan

3–4 hours / day. Two modules a day, with the same exercises and checkpoints. Best with some SQL exposure.

| Day | Modules |
|---|---|
| 1 | 1. Your first PostgreSQL queries; 2. Filter precisely |
| 2 | 3. Sort, search and paginate; 4. Aggregate business metrics |
| 3 | 5. Group and segment; 6. Join related tables |
| 4 | 7. Outer, anti and self joins; 8. NULLs and conditional logic |
| 5 | 9. Dates, intervals and cohorts; 10. Subqueries and existence |
| 6 | 11. Readable queries with CTEs; 12. Window functions |
| 7 | 13. Top-N, frames and deduplication; 14. Set operations |
| 8 | 15. JSONB and arrays; 16. Clean and validate data |
| 9 | 17. Design tables and constraints; 18. Relationships and normalization |
| 10 | 19. Insert, update and delete safely; 20. Transactions and idempotent writes |
| 11 | 21. Indexes and execution plans; 22. Views and reporting contracts |
| 12 | 23. Functions and audit triggers; 24. Recursive hierarchies |
| 13 | 25. Time series and lateral joins; 26. Query tuning and scalable design |
| 14 | 27. Security, recovery and concurrency; 28. Telecom analytics capstone |
| 15 | 29. Commerce analytics capstone; 30. Final interview rehearsal |

## 30-day plan

90–120 min / day. A paced route from your first SELECT to portfolio projects. Best for beginners.

| Day | Modules |
|---|---|
| 1 | 1. Your first PostgreSQL queries |
| 2 | 2. Filter precisely |
| 3 | 3. Sort, search and paginate |
| 4 | 4. Aggregate business metrics |
| 5 | 5. Group and segment |
| 6 | 6. Join related tables |
| 7 | 7. Outer, anti and self joins |
| 8 | 8. NULLs and conditional logic |
| 9 | 9. Dates, intervals and cohorts |
| 10 | 10. Subqueries and existence |
| 11 | 11. Readable queries with CTEs |
| 12 | 12. Window functions |
| 13 | 13. Top-N, frames and deduplication |
| 14 | 14. Set operations |
| 15 | 15. JSONB and arrays |
| 16 | 16. Clean and validate data |
| 17 | 17. Design tables and constraints |
| 18 | 18. Relationships and normalization |
| 19 | 19. Insert, update and delete safely |
| 20 | 20. Transactions and idempotent writes |
| 21 | 21. Indexes and execution plans |
| 22 | 22. Views and reporting contracts |
| 23 | 23. Functions and audit triggers |
| 24 | 24. Recursive hierarchies |
| 25 | 25. Time series and lateral joins |
| 26 | 26. Query tuning and scalable design |
| 27 | 27. Security, recovery and concurrency |
| 28 | 28. Telecom analytics capstone |
| 29 | 29. Commerce analytics capstone |
| 30 | 30. Final interview rehearsal |

## Module 1: Your first PostgreSQL queries

Foundations · Beginner

A database holds related tables. A row represents one record and a column represents an attribute. PostgreSQL uses schemas to group objects inside a database. Our sample data lives in academy; your new objects belong in lab. Use schema-qualified names so a query means the same thing in the app, pgAdmin and DBeaver.

- SELECT chooses columns; FROM identifies the source. SQL keywords are case insensitive, while quoted identifiers preserve case. Prefer lowercase snake_case names.
- A SELECT result is unordered unless you specify ORDER BY. Add a unique tie-breaker before LIMIT to make examples repeatable.
- The logical order is FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT. Write the business question and required output before the SQL.

**Watch for:** SELECT * is useful for exploration, but explicit columns make reporting contracts stable when tables change.

**Interview:** How do a database, schema and table differ?

A server can host multiple databases. A database contains schemas, which are namespaces for tables, views and functions. A table contains typed rows. A connection targets one database; a qualified name such as academy.customers selects a schema and table.

### 1.1 — Meet your customers

Return customer_id, full_name and country_code for the first 10 customers by customer_id.

Hint: List only the three requested columns, then ORDER BY and LIMIT.

Reference solution:

```sql
SELECT customer_id, full_name, country_code FROM academy.customers ORDER BY customer_id LIMIT 10;
```

### 1.2 — Read a product catalog

Return product_id, name and price for product IDs 1 through 5, ordered by product_id.

Hint: BETWEEN includes both endpoints.

Reference solution:

```sql
SELECT product_id, name, price FROM academy.products WHERE product_id BETWEEN 1 AND 5 ORDER BY product_id;
```

### 1.3 — Find the sales channels

Return each distinct channel from orders, sorted alphabetically.

Hint: DISTINCT removes duplicate result rows.

Reference solution:

```sql
SELECT DISTINCT channel FROM academy.orders ORDER BY channel;
```

## Module 2: Filter precisely

Foundations · Beginner

A WHERE clause keeps only rows whose predicate is TRUE. FALSE and UNKNOWN both fail the filter. Combine predicates with AND and OR, and use parentheses to express your intended logic. IN is a readable alternative to repeated equality checks; BETWEEN includes both bounds.

- Filter before aggregation to reduce the rows going into a report.
- NULL means missing or unknown; compare it with IS NULL or IS NOT NULL, never = NULL.
- Use half-open intervals for timestamps: value >= start AND value < next_boundary. A date-only upper bound at midnight can omit an entire day.

**Watch for:** AND binds more tightly than OR. Parenthesize mixed conditions rather than relying on a reader to remember precedence.

**Interview:** Why does column = NULL return no matches?

Ordinary comparisons with NULL evaluate to UNKNOWN. WHERE keeps TRUE only. Use IS NULL to find missing values, or IS NOT DISTINCT FROM for equality that treats two NULLs as equal.

### 2.1 — Active premium products

Return product_id, name, price for active products priced at least 700, by product_id.

Hint: Boolean columns can be used directly in WHERE.

Reference solution:

```sql
SELECT product_id,name,price FROM academy.products WHERE active AND price >= 700 ORDER BY product_id;
```

### 2.2 — Open operational work

Return incident_id and severity for unclosed critical or major incidents, by incident_id.

Hint: Use IS NULL and IN.

Reference solution:

```sql
SELECT incident_id,severity FROM academy.incidents WHERE closed_at IS NULL AND severity IN ('critical','major') ORDER BY incident_id;
```

### 2.3 — A quarter of web orders

Return order_id, order_date for web orders in Q1 2025, by order_id.

Hint: Use an inclusive start and exclusive end.

Reference solution:

```sql
SELECT order_id,order_date FROM academy.orders WHERE channel='web' AND order_date >= DATE '2025-01-01' AND order_date < DATE '2025-04-01' ORDER BY order_id;
```

## Module 3: Sort, search and paginate

Foundations · Beginner

ORDER BY lets you define a meaningful result order, with ASC or DESC on each key. Business lists often need a second key to resolve ties. OFFSET pagination is easy to implement, but the server still walks skipped rows and changes can shift page boundaries. Keyset pagination instead continues from the last sort key.

- ILIKE performs case-insensitive pattern matching. % matches any sequence and _ matches one character.
- NULLS FIRST or NULLS LAST makes missing-value placement explicit.
- For a list ordered by price DESC, product_id ASC, the next-page predicate must respect both key directions. For a single increasing primary key, use id > last_id.

**Watch for:** LIMIT without ORDER BY produces an arbitrary subset, not a stable first page.

**Interview:** When is keyset pagination preferable to OFFSET?

Use keyset pagination for large changing lists when sequential navigation matters. It can seek through an appropriate index and avoids scanning a growing offset. It needs stable sort keys and is less convenient for jumping directly to an arbitrary page number.

### 3.1 — Ten most expensive products

Return product_id, name, price for the 10 highest-priced products. Break price ties by product_id ascending.

Hint: ORDER BY price DESC, product_id.

Reference solution:

```sql
SELECT product_id,name,price FROM academy.products ORDER BY price DESC,product_id LIMIT 10;
```

### 3.2 — Find routers

Return product_id and name for products whose name contains router, case insensitively, by product_id.

Hint: Use ILIKE with percent signs.

Reference solution:

```sql
SELECT product_id,name FROM academy.products WHERE name ILIKE '%router%' ORDER BY product_id;
```

### 3.3 — Continue a customer page

The last customer_id shown was 40. Return customer_id and full_name for the next 10 customers, by customer_id.

Hint: Use a keyset condition instead of OFFSET.

Reference solution:

```sql
SELECT customer_id,full_name FROM academy.customers WHERE customer_id>40 ORDER BY customer_id LIMIT 10;
```

## Module 4: Aggregate business metrics

Foundations · Beginner

Aggregation collapses many rows into a summary. COUNT(*) counts rows; COUNT(column) counts non-NULL values. SUM and AVG ignore NULL inputs and normally return NULL when no rows qualify. Monetary calculations use numeric rather than floating point to avoid representation surprises.

- Define the grain of a metric: one row per order item, order, customer or day. Summing at the wrong grain is a common reporting failure.
- Line revenue is quantity × unit_price × (1 − discount_pct / 100). Revenue in this course excludes shipping unless explicitly requested.
- ROUND(numeric, 2) rounds to cents. Round at the metric boundary rather than at every intermediate step unless the accounting rule requires line rounding.

**Watch for:** AVG of averages is not the overall average unless group sizes are equal. Carry totals and counts when aggregating summaries.

**Interview:** What is the difference between COUNT(*) and COUNT(column)?

COUNT(*) counts all rows after filtering. COUNT(column) counts rows where that column is not NULL. COUNT(DISTINCT column) counts distinct non-NULL values. Use the version matching the metric you intend.

### 4.1 — Count the customer base

Return one column named customer_count containing the number of customers.

Hint: COUNT(*) counts rows.

Reference solution:

```sql
SELECT count(*) AS customer_count FROM academy.customers;
```

### 4.2 — Measure active product pricing

Return min_price, max_price and avg_price rounded to two decimals for active products.

Hint: Apply WHERE before the aggregates.

Reference solution:

```sql
SELECT min(price) AS min_price,max(price) AS max_price,round(avg(price),2) AS avg_price FROM academy.products WHERE active;
```

### 4.3 — Missing postcodes

Return address_count, postcode_count and missing_count across addresses.

Hint: Subtract non-NULL values from all rows.

Reference solution:

```sql
SELECT count(*) AS address_count,count(postcode) AS postcode_count,count(*)-count(postcode) AS missing_count FROM academy.addresses;
```

## Module 5: Group and segment

Foundations · Beginner

GROUP BY changes the output grain to one row per combination of grouping keys. Every selected expression must either be a grouping key or an aggregate, except where PostgreSQL can infer a functional dependency from a primary key. WHERE filters input rows; HAVING filters completed groups.

- FILTER (WHERE condition) calculates multiple conditional aggregates in one grouped query.
- State what each output row represents before choosing grouping keys. Adding a column to GROUP BY changes that grain.
- HAVING count(*) >= 10 asks a question about each group, while WHERE status = ... removes individual rows before counts are formed.

**Watch for:** Filtering a joined table in WHERE can change a LEFT JOIN into an effective INNER JOIN and remove zero-activity groups.

**Interview:** How do WHERE and HAVING differ?

WHERE filters rows before grouping and cannot directly reference a group aggregate. HAVING filters the groups produced by GROUP BY and can test aggregates. Use WHERE for row predicates whenever possible.

### 5.1 — Customers by segment

Return segment and customer_count for each customer segment, sorted by segment.

Hint: Group by the requested dimension.

Reference solution:

```sql
SELECT segment,count(*) AS customer_count FROM academy.customers GROUP BY segment ORDER BY segment;
```

### 5.2 — Customers with frequent orders

Return customer_id and order_count for customers with at least 10 orders, by customer_id. Include every order status.

Hint: HAVING filters the count of each customer.

Reference solution:

```sql
SELECT customer_id,count(*) AS order_count FROM academy.orders GROUP BY customer_id HAVING count(*)>=10 ORDER BY customer_id;
```

### 5.3 — Order status by channel

Return channel, total_orders and cancelled_orders for each channel, by channel.

Hint: FILTER lets one aggregate count a subset.

Reference solution:

```sql
SELECT channel,count(*) AS total_orders,count(*) FILTER (WHERE status='cancelled') AS cancelled_orders FROM academy.orders GROUP BY channel ORDER BY channel;
```

## Module 6: Join related tables

Relational SQL · Intermediate

An INNER JOIN returns combinations that satisfy the join predicate. Primary and foreign keys describe relationships, but they do not automatically prevent a query from multiplying rows. If one order has three items and two other matching records, a broad join can produce six rows before aggregation.

- Use explicit JOIN ... ON ... for clarity. USING(column) is convenient when both tables use the same key name.
- Always identify one-to-one, one-to-many and many-to-many relationships before adding SUM or COUNT.
- Choose either detail grain or pre-aggregated grain. Joining an order total onto every item and then summing it overcounts.

**Watch for:** A plausible total can still be wrong. Reconcile joined row counts and totals against the source before trusting a report.

**Interview:** How would you diagnose duplicate rows after a join?

Check the intended grain and the uniqueness of each join key. Count matches per key on both sides. A many-to-many match multiplies rows. Fix the join predicate or pre-aggregate to the intended grain; DISTINCT can hide the symptom without fixing the metric.

### 6.1 — Orders with customer names

Return order_id, full_name and status for order IDs 1 to 10, by order_id.

Hint: orders.customer_id references customers.customer_id.

Reference solution:

```sql
SELECT o.order_id,c.full_name,o.status FROM academy.orders o JOIN academy.customers c USING(customer_id) WHERE o.order_id<=10 ORDER BY o.order_id;
```

### 6.2 — Product category labels

Return product_id, p.name as product_name and c.name as category_name for product IDs 1 to 12, by product_id.

Hint: Alias the two name columns clearly.

Reference solution:

```sql
SELECT p.product_id,p.name AS product_name,c.name AS category_name FROM academy.products p JOIN academy.categories c USING(category_id) WHERE p.product_id<=12 ORDER BY p.product_id;
```

### 6.3 — Net value per order

Return order_id and net_amount for orders 1 to 10, by order_id. Sum discounted item amounts, exclude shipping, and round each order total to two decimals.

Hint: Aggregate items at order grain.

Reference solution:

```sql
SELECT order_id,round(sum(quantity*unit_price*(1-discount_pct/100)),2) AS net_amount FROM academy.order_items WHERE order_id<=10 GROUP BY order_id ORDER BY order_id;
```

## Module 7: Outer, anti and self joins

Relational SQL · Intermediate

A LEFT JOIN preserves every left-hand row and fills unmatched right-hand columns with NULL. Use it for coverage reports that must include zero-activity records. An anti join finds rows with no match. A self join connects different roles within the same table, such as employee and manager.

- Count a non-NULL right-hand key after a LEFT JOIN to obtain zero for unmatched rows. COUNT(*) would count the preserved row.
- NOT EXISTS is usually clearer than NOT IN when the subquery could return NULL.
- Keep right-side qualifying predicates in ON when unmatched left-side rows must remain visible.

**Watch for:** Never assume every customer has an order. Our dataset deliberately includes customers and products with no sales.

**Interview:** Why can NOT IN behave unexpectedly with NULL?

If a NOT IN subquery includes NULL, comparisons for values without a positive match become UNKNOWN. WHERE removes those rows. NOT EXISTS checks whether a matching row exists and is not poisoned by an unrelated NULL.

### 7.1 — Customers who never ordered

Return customer_id and full_name for customers with no orders, by customer_id.

Hint: Correlate NOT EXISTS on the customer key.

Reference solution:

```sql
SELECT c.customer_id,c.full_name FROM academy.customers c WHERE NOT EXISTS (SELECT 1 FROM academy.orders o WHERE o.customer_id=c.customer_id) ORDER BY c.customer_id;
```

### 7.2 — Include zero-order customers

Return customer_id and order_count for customers 1095 to 1105 inclusive, by customer_id. Include customers with no orders.

Hint: Use a LEFT JOIN and count o.order_id.

Reference solution:

```sql
SELECT c.customer_id,count(o.order_id) AS order_count FROM academy.customers c LEFT JOIN academy.orders o USING(customer_id) WHERE c.customer_id BETWEEN 1095 AND 1105 GROUP BY c.customer_id ORDER BY c.customer_id;
```

### 7.3 — Employee and manager

Return employee_id, employee_name and manager_name for employees 1 to 12, by employee_id. Keep employees without a manager.

Hint: Give the employee table two different aliases.

Reference solution:

```sql
SELECT e.employee_id,e.full_name AS employee_name,m.full_name AS manager_name FROM academy.employees e LEFT JOIN academy.employees m ON e.manager_id=m.employee_id WHERE e.employee_id<=12 ORDER BY e.employee_id;
```

## Module 8: NULLs and conditional logic

Relational SQL · Intermediate

CASE expresses business rules in a query. PostgreSQL uses the first matching branch, so put the most specific condition first. COALESCE returns the first non-NULL argument. NULLIF returns NULL when two values are equal, which is useful for protecting a denominator without inventing a misleading zero.

- CASE WHEN ... THEN ... ELSE ... END produces a value and can appear in SELECT, ORDER BY or aggregates.
- Integer divided by integer truncates. Cast one operand to numeric or multiply by a numeric literal before dividing.
- Replacing unknown values with zero changes meaning. Use a display label only at the presentation boundary if missingness matters analytically.

**Watch for:** A 0% rate and an undefined rate are different. Return NULL for an empty denominator unless the business definition explicitly says otherwise.

**Interview:** How would you calculate a safe percentage?

Define numerator and denominator on the same grain, use numeric division, multiply by 100, and divide by NULLIF(denominator,0). Choose whether an undefined result should stay NULL or have a documented fallback.

### 8.1 — Price bands

For product IDs 1 to 20 return product_id and price_band: budget for price<200, mid for price<600, otherwise premium. Sort by product_id.

Hint: CASE chooses the first true branch.

Reference solution:

```sql
SELECT product_id,CASE WHEN price<200 THEN 'budget' WHEN price<600 THEN 'mid' ELSE 'premium' END AS price_band FROM academy.products WHERE product_id<=20 ORDER BY product_id;
```

### 8.2 — Readable postcode labels

Return address_id and postcode_label for addresses 1 to 25. Replace missing postcodes with Unknown; sort by address_id.

Hint: COALESCE provides a fallback for NULL.

Reference solution:

```sql
SELECT address_id,coalesce(postcode,'Unknown') AS postcode_label FROM academy.addresses WHERE address_id<=25 ORDER BY address_id;
```

### 8.3 — Cancellation rate

Return channel and cancellation_pct rounded to two decimals for each channel, ordered by channel.

Hint: Use 100.0 to avoid integer division.

Reference solution:

```sql
SELECT channel,round(100.0*count(*) FILTER(WHERE status='cancelled')/nullif(count(*),0),2) AS cancellation_pct FROM academy.orders GROUP BY channel ORDER BY channel;
```

## Module 9: Dates, intervals and cohorts

Relational SQL · Intermediate

Use date for calendar dates and timestamptz for real-world instants that need timezone-aware comparison. PostgreSQL stores timestamptz as an instant and renders it in the session timezone. A timestamp without time zone is a wall-clock value; the database cannot infer which zone it belongs to.

- date_trunc groups timestamps at a chosen calendar boundary. Cast the result to date when the output represents a calendar month.
- Subtracting two dates yields elapsed days. Subtracting timestamps yields an interval.
- For reproducible analysis, use an explicit as-of date. The sample commerce data covers 2025 and telecom covers November 2025.

**Watch for:** Do not use CURRENT_DATE in a historical exercise without considering that the data is fixed. Your result would change over time.

**Interview:** How should timezones be handled in reporting?

Store real event instants with timestamptz and convert to the agreed reporting timezone before grouping into local days. Keep timezone rules explicit, especially around daylight-saving boundaries. Use date for a value that is only a calendar date.

### 9.1 — Monthly order volume

Return month as a date and order_count for every 2025 order month, by month. Include all statuses.

Hint: Truncate each date to the month.

Reference solution:

```sql
SELECT date_trunc('month',order_date)::date AS month,count(*) AS order_count FROM academy.orders GROUP BY 1 ORDER BY 1;
```

### 9.2 — Delivery lead time

For delivered shipments return carrier and avg_days rounded to two decimals, by carrier. Days = delivered_at minus shipped_at.

Hint: Date subtraction returns a number of days.

Reference solution:

```sql
SELECT carrier,round(avg(delivered_at-shipped_at),2) AS avg_days FROM academy.shipments WHERE delivered_at IS NOT NULL GROUP BY carrier ORDER BY carrier;
```

### 9.3 — Signup cohorts

Return cohort_month as a date and customer_count for each signup month, by cohort_month.

Hint: A cohort groups people by their first relevant event.

Reference solution:

```sql
SELECT date_trunc('month',signup_date)::date AS cohort_month,count(*) AS customer_count FROM academy.customers GROUP BY 1 ORDER BY 1;
```

## Module 10: Subqueries and existence

Relational SQL · Intermediate

A subquery can produce a scalar, a set, or a derived table. A scalar subquery must return at most one row; aggregate queries without GROUP BY usually do. A correlated subquery references the current outer row. EXISTS cares only whether any match exists, so its projected value is unimportant.

- Use a scalar aggregate to compare each product against the catalog average.
- Use EXISTS for membership when you do not need columns from matching rows. It avoids multiplying the outer result.
- The optimizer may transform a correlated query. Evaluate performance with the actual plan rather than assuming every subquery is slow.

**Watch for:** A scalar subquery that starts returning two rows fails at runtime. Enforce uniqueness when your query depends on it.

**Interview:** When would you use EXISTS instead of JOIN?

Use EXISTS to filter one table by whether a related record exists without needing that record in the output. It preserves the outer grain and avoids duplicate outer rows when several matches exist. Use JOIN when you need attributes or combinations from both inputs.

### 10.1 — Above-average product prices

Return product_id and price for products above the average price of all products, by product_id.

Hint: The inner average produces one scalar.

Reference solution:

```sql
SELECT product_id,price FROM academy.products WHERE price>(SELECT avg(price) FROM academy.products) ORDER BY product_id;
```

### 10.2 — Customers with a cancelled order

Return customer_id for each customer with at least one cancelled order, by customer_id. Return each customer once.

Hint: EXISTS avoids repeated customer IDs.

Reference solution:

```sql
SELECT c.customer_id FROM academy.customers c WHERE EXISTS(SELECT 1 FROM academy.orders o WHERE o.customer_id=c.customer_id AND o.status='cancelled') ORDER BY c.customer_id;
```

### 10.3 — Above department average

Return employee_id, department_id and salary for employees paid above their own department average, by employee_id.

Hint: Correlate the subquery on department_id.

Reference solution:

```sql
SELECT e.employee_id,e.department_id,e.salary FROM academy.employees e WHERE salary>(SELECT avg(salary) FROM academy.employees d WHERE d.department_id=e.department_id) ORDER BY employee_id;
```

## Module 11: Readable queries with CTEs

Analysis · Intermediate

A common table expression gives a name to an intermediate query. Use WITH to separate metric definition, aggregation and presentation. CTEs improve readability but are not automatically a performance optimization: PostgreSQL may inline a nonrecursive, side-effect-free CTE, while materialization can affect the plan.

- Build reports in stages with an explicit grain at each stage.
- Calculate item totals once before joining to customers or payments.
- Name intermediate columns after business concepts so a reviewer can follow the metric definition.

**Watch for:** A cleanly formatted query can still double-count. Check the key uniqueness of every CTE that you join.

**Interview:** Are CTEs always materialized?

No. PostgreSQL can inline a side-effect-free nonrecursive CTE in suitable cases. Multiple references and MATERIALIZED or NOT MATERIALIZED influence planning. Inspect EXPLAIN rather than relying on a blanket rule.

### 11.1 — Top customer spend

For delivered orders only, return customer_id and spend (discounted item totals, excluding shipping, rounded to cents) for the top 10 customers. Sort spend descending then customer_id.

Hint: Create a per-customer spending CTE.

Reference solution:

```sql
WITH totals AS (SELECT o.customer_id,sum(i.quantity*i.unit_price*(1-i.discount_pct/100)) AS spend FROM academy.orders o JOIN academy.order_items i USING(order_id) WHERE o.status='delivered' GROUP BY o.customer_id) SELECT customer_id,round(spend,2) AS spend FROM totals ORDER BY spend DESC,customer_id LIMIT 10;
```

### 11.2 — Inventory by product

Return product_id and stock for products with total inventory across warehouses below 100, by product_id.

Hint: First aggregate across warehouse locations.

Reference solution:

```sql
WITH stock AS (SELECT product_id,sum(quantity) AS stock FROM academy.inventory GROUP BY product_id) SELECT product_id,stock FROM stock WHERE stock<100 ORDER BY product_id;
```

### 11.3 — Reconcile payments

Return order_id for any captured payment that differs by more than 0.01 from discounted item total plus shipping. Sort by order_id. An empty result is valid.

Hint: Use a per-order total before comparing payments.

Reference solution:

```sql
WITH totals AS (SELECT o.order_id,round(sum(i.quantity*i.unit_price*(1-i.discount_pct/100))+o.shipping_fee,2) AS expected FROM academy.orders o JOIN academy.order_items i USING(order_id) GROUP BY o.order_id) SELECT p.order_id FROM academy.payments p JOIN totals t USING(order_id) WHERE p.status='captured' AND abs(p.amount-t.expected)>0.01 ORDER BY p.order_id;
```

## Module 12: Window functions

Analysis · Intermediate

Window functions calculate across related rows while keeping each input row in the output. OVER defines the partition, ordering and optional frame. GROUP BY collapses rows; a window usually does not. You can layer a window on an aggregate to produce cumulative monthly metrics.

- PARTITION BY resets the calculation for each group. ORDER BY inside OVER defines the sequence for the calculation, not the final display order.
- ROW_NUMBER assigns unique positions; RANK leaves gaps after ties; DENSE_RANK does not.
- Use an explicit ROWS frame for a running sum when tied ordering values should not all enter at once.

**Watch for:** The default ordered window frame includes peers. SUM(value) OVER (ORDER BY date) may jump across several rows with the same date.

**Interview:** How do RANK, DENSE_RANK and ROW_NUMBER differ?

For tied values 100,100,90, ROW_NUMBER assigns 1,2,3 using its ordering, RANK gives 1,1,3 and DENSE_RANK gives 1,1,2. Add a tie-breaker for deterministic ROW_NUMBER; adding it to a rank changes which rows are peers.

### 12.1 — Rank salaries within departments

For employees 1 to 30, return employee_id, department_id, salary and salary_rank using DENSE_RANK within each department by salary descending. Rank only these 30 employees. Order by employee_id.

Hint: WHERE runs before the window calculation.

Reference solution:

```sql
SELECT employee_id,department_id,salary,dense_rank() OVER(PARTITION BY department_id ORDER BY salary DESC) AS salary_rank FROM academy.employees WHERE employee_id<=30 ORDER BY employee_id;
```

### 12.2 — Running monthly order volume

Return month as a date, order_count and running_orders for all orders by month. Use an explicit ROWS frame.

Hint: Aggregate monthly first, then use a window sum.

Reference solution:

```sql
WITH m AS (SELECT date_trunc('month',order_date)::date AS month,count(*) AS order_count FROM academy.orders GROUP BY 1) SELECT month,order_count,sum(order_count) OVER(ORDER BY month ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_orders FROM m ORDER BY month;
```

### 12.3 — Compare adjacent metric days

For cell_id 1 return metric_date, dl_traffic_gb and previous_traffic using LAG, ordered by metric_date.

Hint: The first previous value should be NULL.

Reference solution:

```sql
SELECT metric_date,dl_traffic_gb,lag(dl_traffic_gb) OVER(ORDER BY metric_date) AS previous_traffic FROM academy.cell_metrics WHERE cell_id=1 ORDER BY metric_date;
```

## Module 13: Top-N, frames and deduplication

Analysis · Advanced

Top-N-per-group is a frequent interview problem. Calculate a row number within each group, then filter it in an outer query: window results are not available to WHERE at the same query level. Explicit frame boundaries also make moving averages and first/last value calculations easier to reason about.

- For exactly N rows per group, use ROW_NUMBER with a stable tie-breaker. To include ties, choose RANK or DENSE_RANK and explain the different contract.
- ROWS BETWEEN 2 PRECEDING AND CURRENT ROW gives up to three observations, not necessarily three calendar days.
- Deduplication needs a survivor rule, such as newest timestamp then highest ID. DISTINCT alone does not express that rule.

**Watch for:** LAST_VALUE often returns the current frame endpoint, not the last row of the partition. Specify the full frame when that is what you need.

**Interview:** How would you get the latest record per customer?

Assign ROW_NUMBER partitioned by customer and ordered by timestamp descending plus a unique ID descending, then keep rn=1. PostgreSQL DISTINCT ON is another option when ORDER BY starts with the DISTINCT ON keys and encodes the same survivor rule.

### 13.1 — Two best-paid employees per department

Return department_id, employee_id and salary for exactly two employees per department. Use salary descending and employee_id ascending to break ties. Display by department_id then employee_id.

Hint: Filter the window result in a CTE consumer.

Reference solution:

```sql
WITH ranked AS (SELECT department_id,employee_id,salary,row_number() OVER(PARTITION BY department_id ORDER BY salary DESC,employee_id) AS rn FROM academy.employees) SELECT department_id,employee_id,salary FROM ranked WHERE rn<=2 ORDER BY department_id,employee_id;
```

### 13.2 — Three-observation moving average

For cell 1 return metric_date and moving_traffic as the mean of the current and up to two preceding dl_traffic_gb values, rounded to two decimals. Sort by date.

Hint: Use an explicit ROWS frame.

Reference solution:

```sql
SELECT metric_date,round(avg(dl_traffic_gb) OVER(ORDER BY metric_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW),2) AS moving_traffic FROM academy.cell_metrics WHERE cell_id=1 ORDER BY metric_date;
```

### 13.3 — Latest order per customer

Return customer_id, order_id and order_date for the latest order of customers 1 to 15 who have orders. Break date ties by highest order_id. Sort by customer_id.

Hint: DISTINCT ON can retain the first ordered row per group.

Reference solution:

```sql
SELECT DISTINCT ON (customer_id) customer_id,order_id,order_date FROM academy.orders WHERE customer_id<=15 ORDER BY customer_id,order_date DESC,order_id DESC;
```

## Module 14: Set operations

Analysis · Intermediate

UNION, INTERSECT and EXCEPT combine compatible result sets vertically. Inputs must have the same number of columns with compatible types. UNION removes duplicates; UNION ALL preserves them and avoids duplicate elimination. INTERSECT retains overlap, while EXCEPT finds rows in the first input but not the second.

- Set operations compare complete projected rows, so choose exactly the keys that define membership.
- Use UNION ALL for append-only event streams when duplicates are meaningful.
- Put the final ORDER BY after the combined expression to order the whole result. Parenthesize individual branches when they require their own LIMIT or ordering.

**Watch for:** UNION can silently hide a data-quality problem by discarding duplicate records.

**Interview:** What is the practical difference between UNION and UNION ALL?

UNION removes duplicate result rows, which changes semantics and costs work. UNION ALL concatenates all rows. Choose based on whether duplicates are allowed, not simply on a habit or a performance slogan.

### 14.1 — Countries represented in two entities

Return country_code appearing in either customers or suppliers, once each, alphabetically.

Hint: Use UNION for distinct membership.

Reference solution:

```sql
SELECT country_code FROM academy.customers UNION SELECT country_code FROM academy.suppliers ORDER BY country_code;
```

### 14.2 — Subscribers who have ordered

Return customer_id that appears in both subscriptions and orders, once each, by customer_id.

Hint: INTERSECT finds common keys.

Reference solution:

```sql
SELECT customer_id FROM academy.subscriptions INTERSECT SELECT customer_id FROM academy.orders ORDER BY customer_id;
```

### 14.3 — Products with no order items

Return product_id in products but absent from order_items, by product_id.

Hint: Project the same key from both branches.

Reference solution:

```sql
SELECT product_id FROM academy.products EXCEPT SELECT product_id FROM academy.order_items ORDER BY product_id;
```

## Module 15: JSONB and arrays

Analysis · Intermediate

JSONB is useful for attributes whose structure varies, but core relationships still benefit from typed relational columns and foreign keys. The -> operator returns JSON, while ->> returns text. Cast extracted text before numeric comparison. JSONB supports containment predicates and, for appropriate workloads, GIN indexes.

- Use metadata->>'device' for text extraction, and (metadata->>'duration_seconds')::integer for arithmetic.
- Containment with @> asks whether a JSONB document contains a structure. Missing keys generally produce SQL NULL on extraction.
- array_agg combines values; include ORDER BY inside the aggregate when array order matters. Arrays are not a replacement for every many-to-many table.

**Watch for:** Comparing extracted numeric strings lexicographically gives incorrect numeric ordering. Cast to the intended numeric type.

**Interview:** When should data be stored in JSONB rather than normalized tables?

Use JSONB for variable optional document-like attributes that do not need strong relational constraints. Use typed columns and related tables for stable keys, frequently filtered fields, many-to-many relationships and attributes requiring referential integrity. Design indexes from actual query patterns.

### 15.1 — Event device mix

Return device and event_count using metadata.device, sorted by device.

Hint: ->> extracts text.

Reference solution:

```sql
SELECT metadata->>'device' AS device,count(*) AS event_count FROM academy.events GROUP BY 1 ORDER BY 1;
```

### 15.2 — Long mobile visits

Return event_id for mobile events with duration_seconds greater than 150, by event_id.

Hint: Cast the extracted duration.

Reference solution:

```sql
SELECT event_id FROM academy.events WHERE metadata->>'device'='mobile' AND (metadata->>'duration_seconds')::integer>150 ORDER BY event_id;
```

### 15.3 — Projects as an array

For employees 1 to 10 return employee_id and project_ids as an integer array sorted within each employee. Order by employee_id.

Hint: ORDER BY belongs inside array_agg as well.

Reference solution:

```sql
SELECT employee_id,array_agg(project_id ORDER BY project_id) AS project_ids FROM academy.employee_projects WHERE employee_id<=10 GROUP BY employee_id ORDER BY employee_id;
```

## Module 16: Clean and validate data

Analysis · Intermediate

Data cleaning should make rules explicit and measurable. Preserve raw inputs when corrections need to be audited. Use trimming, case normalization and pattern checks at ingestion boundaries. Avoid silently transforming every unusual value into an apparently valid one; invalid rows may belong in a quarantine report.

- btrim removes surrounding whitespace; lower and upper normalize text under the database locale.
- split_part extracts delimited components, while regexp_replace can remove or replace patterns.
- Validate uniqueness, required fields, allowed values and relationships separately. A report with zero violations is stronger when you can demonstrate an intentionally invalid fixture is caught.

**Watch for:** Do not normalize personal names or email local parts with destructive rules unless the business has agreed to those semantics.

**Interview:** How would you design a reliable ingestion pipeline?

Load raw data into a staging area, attach source and load identifiers, validate types and business keys, separate invalid rows with reasons, then apply an idempotent merge in a transaction. Reconcile row counts and totals and preserve enough lineage to reproduce each transformation.

### 16.1 — Extract email domains

Return email_domain and customer_count by the portion after @, sorted by email_domain.

Hint: split_part uses a one-based field index.

Reference solution:

```sql
SELECT split_part(email,'@',2) AS email_domain,count(*) AS customer_count FROM academy.customers GROUP BY 1 ORDER BY 1;
```

### 16.2 — Normalize sample labels

From VALUES (1,'  Alpha  '),(2,'BETA '),(3,' gamma'), return id and clean_label after trimming and lowercasing, ordered by id.

Hint: Use a VALUES-derived table for small test fixtures.

Reference solution:

```sql
SELECT id,lower(btrim(label)) AS clean_label FROM (VALUES(1,'  Alpha  '),(2,'BETA '),(3,' gamma')) AS v(id,label) ORDER BY id;
```

### 16.3 — Duplicate email audit

Return lowercased email as normalized_email and occurrences for duplicate customer emails under a case-insensitive comparison. Sort by normalized_email. No violations is a valid result.

Hint: Group by the normalized business key.

Reference solution:

```sql
SELECT lower(email) AS normalized_email,count(*) AS occurrences FROM academy.customers GROUP BY lower(email) HAVING count(*)>1 ORDER BY normalized_email;
```

## Module 17: Design tables and constraints

Database design · Intermediate

Good database design encodes important rules so all writers obey them. Choose types based on meaning: numeric for exact financial amounts, integer for counts, date for calendar days and timestamptz for instants. A primary key identifies a row; a unique constraint protects a candidate key; a CHECK restricts allowed row values.

- NOT NULL and CHECK are different: a CHECK that evaluates to UNKNOWN passes. Use NOT NULL when missing values must be rejected.
- GENERATED ... AS IDENTITY provides a key generator; a PRIMARY KEY still supplies uniqueness and non-null guarantees.
- Prefer constraints to application-only validation for invariants that must hold regardless of which application writes the data.

**Watch for:** A numeric CHECK(amount>=0) does not reject NULL. Combine it with NOT NULL if an amount is required.

**Interview:** What belongs in a database constraint?

Stable data invariants such as keys, mandatory values, valid ranges and referential integrity belong in constraints. Cross-row rules may need unique/exclusion constraints or carefully designed transactions. Keep changing workflow policy separate when it is not a persistent data invariant.

### 17.1 — Create a catalog table

Create lab.catalog with sku text PRIMARY KEY, title text NOT NULL, and price numeric(10,2) NOT NULL CHECK(price>0). No rows are required.

Hint: Declare the checks inside CREATE TABLE.

Reference solution:

```sql
CREATE TABLE lab.catalog (sku text PRIMARY KEY,title text NOT NULL,price numeric(10,2) NOT NULL CHECK(price>0));
```

### 17.2 — Create daily measurements

Create lab.readings with cell_id integer, metric_date date and value numeric NOT NULL. Use a composite PRIMARY KEY on (cell_id,metric_date) and CHECK(value>=0).

Hint: A table-level PRIMARY KEY can contain two columns.

Reference solution:

```sql
CREATE TABLE lab.readings (cell_id integer,metric_date date,value numeric NOT NULL CHECK(value>=0),PRIMARY KEY(cell_id,metric_date));
```

### 17.3 — Unique business keys

Create lab.members with member_id integer PRIMARY KEY and email text NOT NULL UNIQUE.

Hint: Protect both the surrogate key and the email candidate key.

Reference solution:

```sql
CREATE TABLE lab.members (member_id integer PRIMARY KEY,email text NOT NULL UNIQUE);
```

## Module 18: Relationships and normalization

Database design · Intermediate

Normalization reduces update anomalies by storing each fact at its appropriate grain. First normal form avoids repeating groups; second removes partial dependencies on a composite key; third removes transitive dependencies between non-key attributes. These principles guide choices, but workload-driven denormalization can be justified when its consistency cost is understood.

- An order has many order items; each item references one product. Keep historical unit_price on the item because it is a sale-time fact.
- A many-to-many relationship needs a junction table whose key identifies the pair. Attributes such as allocation_pct belong on that relationship.
- Foreign keys check references. Choose deletion behavior deliberately: cascading a junction row can be reasonable; deleting financial history usually is not.

**Watch for:** Do not copy current product price into reports of historical sales. Use the price recorded at purchase time.

**Interview:** Why store unit_price on order_items if products already has price?

products.price is the current catalog price. order_items.unit_price is the price agreed for a specific sale. They are different facts with different time semantics; preserving sale-time price supports correct historical reporting and refunds.

### 18.1 — Create a junction table

lab.people(id) and lab.courses(id) are supplied. Create lab.enrollments with person_id and course_id integer foreign keys and a composite PRIMARY KEY. Do not cascade deletes.

Hint: Reference both parent tables.

Starter fixture (run in your dedicated practice database):

```sql
CREATE TABLE lab.people(id integer PRIMARY KEY); CREATE TABLE lab.courses(id integer PRIMARY KEY); INSERT INTO lab.people VALUES(1); INSERT INTO lab.courses VALUES(1);
```

Reference solution:

```sql
CREATE TABLE lab.enrollments(person_id integer REFERENCES lab.people(id),course_id integer REFERENCES lab.courses(id),PRIMARY KEY(person_id,course_id));
```

### 18.2 — Protect a child record

lab.accounts(id) is supplied with row 1. Create lab.tickets with ticket_id integer PRIMARY KEY and account_id integer NOT NULL referencing lab.accounts(id). Reject deletion of an account while tickets reference it.

Hint: The default NO ACTION behavior protects parent records.

Starter fixture (run in your dedicated practice database):

```sql
CREATE TABLE lab.accounts(id integer PRIMARY KEY); INSERT INTO lab.accounts VALUES(1);
```

Reference solution:

```sql
CREATE TABLE lab.tickets(ticket_id integer PRIMARY KEY,account_id integer NOT NULL REFERENCES lab.accounts(id));
```

### 18.3 — Find many-to-many allocations

Return employee_id and total_allocation for employees whose summed project allocation exceeds 100. Sort by employee_id. An empty result is valid.

Hint: A row CHECK does not constrain a sum across several rows.

Reference solution:

```sql
SELECT employee_id,sum(allocation_pct) AS total_allocation FROM academy.employee_projects GROUP BY employee_id HAVING sum(allocation_pct)>100 ORDER BY employee_id;
```

## Module 19: Insert, update and delete safely

Database design · Intermediate

DML changes records. Before writing UPDATE or DELETE, first run a SELECT with the same predicate and inspect its scope. RETURNING can show exactly what changed. Group related writes in a transaction and verify the business invariant before committing. The checked labs use isolated fixtures so your learning database remains intact.

- INSERT lists target columns explicitly. It avoids accidental dependence on table column order.
- UPDATE affects every matching row; omitting WHERE usually means every row.
- DELETE removes rows; TRUNCATE is a different operation with different locking, trigger and sequence behavior. Choose intentionally.

**Watch for:** A successful statement only proves syntactic and constraint validity. Verify row counts and the intended business result too.

**Interview:** How would you perform a risky data correction?

Back up or record the affected keys and old values, preview the exact predicate, run a bounded transaction, use RETURNING and reconciliation checks, then commit only when the expected row count and invariants match. Test the rollback path and avoid holding locks unnecessarily.

### 19.1 — Insert a new task

A lab.tasks(id,title,done) table is supplied. Insert id 3 with title Review indexes and done false. Keep the existing rows.

Hint: Always name your target columns.

Starter fixture (run in your dedicated practice database):

```sql
CREATE TABLE lab.tasks(id integer PRIMARY KEY,title text NOT NULL,done boolean NOT NULL DEFAULT false); INSERT INTO lab.tasks VALUES(1,'Learn SELECT',true),(2,'Learn JOIN',false);
```

Reference solution:

```sql
INSERT INTO lab.tasks(id,title,done) VALUES(3,'Review indexes',false);
```

### 19.2 — Apply a targeted price update

lab.prices is supplied. Increase the price for id 2 by 10% and leave all other rows unchanged.

Hint: Use a WHERE clause on the primary key.

Starter fixture (run in your dedicated practice database):

```sql
CREATE TABLE lab.prices(id integer PRIMARY KEY,price numeric(10,2)); INSERT INTO lab.prices VALUES(1,100),(2,200),(3,300);
```

Reference solution:

```sql
UPDATE lab.prices SET price=price*1.10 WHERE id=2;
```

### 19.3 — Delete only expired sessions

lab.sessions is supplied. Delete rows with expires_on earlier than 2025-06-01. Preserve sessions expiring on that date.

Hint: Earlier than is strict, not inclusive.

Starter fixture (run in your dedicated practice database):

```sql
CREATE TABLE lab.sessions(id integer PRIMARY KEY,expires_on date); INSERT INTO lab.sessions VALUES(1,'2025-05-31'),(2,'2025-06-01'),(3,'2025-07-01');
```

Reference solution:

```sql
DELETE FROM lab.sessions WHERE expires_on<DATE '2025-06-01';
```

## Module 20: Transactions and idempotent writes

Database design · Intermediate

A transaction groups operations into an all-or-nothing unit. BEGIN starts it, COMMIT persists it and ROLLBACK discards it. If a statement fails, PostgreSQL marks the transaction aborted until you roll back, or roll back to an earlier savepoint. Idempotent ingestion can be rerun without creating duplicate business records.

- ON CONFLICT uses a unique or exclusion constraint to handle a collision. A normal lookup followed by INSERT is vulnerable to a race.
- Use EXCLUDED.column to refer to the proposed row in an upsert. Define whether repeated loads replace or add values.
- ACID covers atomicity, consistency, isolation and durability. Isolation controls how concurrent transactions observe changes; it is not a replacement for constraints.

**Watch for:** An upsert that increments a value is not idempotent when the same input is retried. Choose replacement or a deduplicated event key for retryable ingestion.

**Interview:** What happens after a statement fails inside a transaction?

The transaction is in an aborted state and subsequent commands fail until ROLLBACK, or ROLLBACK TO a savepoint created before the error. A client should not blindly continue and later assume COMMIT saved the intended changes.

### 20.1 — Upsert a daily metric

lab.daily has one existing day. Upsert (2025-11-01,15) and (2025-11-02,20), replacing the value on a date conflict.

Hint: The day primary key is the conflict target.

Starter fixture (run in your dedicated practice database):

```sql
CREATE TABLE lab.daily(day date PRIMARY KEY,value integer); INSERT INTO lab.daily VALUES('2025-11-01',10);
```

Reference solution:

```sql
INSERT INTO lab.daily(day,value) VALUES('2025-11-01',15),('2025-11-02',20) ON CONFLICT(day) DO UPDATE SET value=EXCLUDED.value;
```

### 20.2 — Ignore an already-seen event

lab.ingested has event 1. Insert events (1,duplicate) and (2,new) but preserve existing payloads for duplicate keys.

Hint: ON CONFLICT DO NOTHING keeps the original row.

Starter fixture (run in your dedicated practice database):

```sql
CREATE TABLE lab.ingested(id integer PRIMARY KEY,payload text); INSERT INTO lab.ingested VALUES(1,'original');
```

Reference solution:

```sql
INSERT INTO lab.ingested(id,payload) VALUES(1,'duplicate'),(2,'new') ON CONFLICT(id) DO NOTHING;
```

### 20.3 — Transfer without losing money

lab.wallets contains balances 100 and 50 for ids 1 and 2. Transfer 25 from id 1 to id 2 using UPDATE statements. The checker already wraps your statements in one transaction; do not add BEGIN or COMMIT.

Hint: Two updates must form one unit of work.

Starter fixture (run in your dedicated practice database):

```sql
CREATE TABLE lab.wallets(id integer PRIMARY KEY,balance numeric NOT NULL CHECK(balance>=0)); INSERT INTO lab.wallets VALUES(1,100),(2,50);
```

Reference solution:

```sql
UPDATE lab.wallets SET balance=balance-25 WHERE id=1; UPDATE lab.wallets SET balance=balance+25 WHERE id=2;
```

## Module 21: Indexes and execution plans

Production skills · Advanced

Indexes trade storage and write overhead for faster access to selected rows. A B-tree is a strong default for equality and ordered range predicates. Composite index order should reflect actual filters and ordering. PostgreSQL may still choose a sequential scan if many rows qualify or the table is small.

- EXPLAIN shows estimates without running the statement; EXPLAIN ANALYZE executes it and reports actual work. Use care with writes.
- Read actual versus estimated rows, loops, scan types, sort work and buffers. A high-cost node is a clue, not an automatic diagnosis.
- A partial index stores only rows satisfying its predicate. Queries must imply that predicate for the planner to use it.

**Watch for:** A small synthetic dataset cannot establish production performance. Check plans locally with realistic distributions and data volume.

**Interview:** Why might PostgreSQL ignore an index?

A sequential scan can be cheaper when a large fraction of the table qualifies or the table is small. Other reasons include stale statistics, incompatible expressions or types, unsuitable column order, and cost settings. Compare estimated and actual rows and inspect the exact predicate.

### 21.1 — Create a composite index

lab.sales(id,customer_id,sold_on) is supplied. Create a B-tree index named idx_sales_customer_date on customer_id then sold_on.

Hint: The leading column supports the customer equality predicate.

Starter fixture (run in your dedicated practice database):

```sql
CREATE TABLE lab.sales(id integer,customer_id integer,sold_on date);
```

Reference solution:

```sql
CREATE INDEX idx_sales_customer_date ON lab.sales(customer_id,sold_on);
```

### 21.2 — Index only unresolved tickets

lab.issues(id,closed_at) is supplied. Create index idx_issues_open on id, only where closed_at IS NULL.

Hint: Put the predicate after the indexed columns.

Starter fixture (run in your dedicated practice database):

```sql
CREATE TABLE lab.issues(id integer,closed_at timestamp);
```

Reference solution:

```sql
CREATE INDEX idx_issues_open ON lab.issues(id) WHERE closed_at IS NULL;
```

### 21.3 — Inventory of existing indexes

Return indexname for academy.orders indexes, alphabetically.

Hint: The pg_indexes view exposes index definitions.

Reference solution:

```sql
SELECT indexname FROM pg_indexes WHERE schemaname='academy' AND tablename='orders' ORDER BY indexname;
```

## Module 22: Views and reporting contracts

Production skills · Intermediate

A view names a stored query and normally computes its result when queried. It can simplify report contracts without copying rows. A materialized view stores the result and needs a refresh policy. Pick a freshness requirement before choosing between a live view, materialized view or an aggregate table.

- Use explicit view columns so downstream consumers have a stable contract.
- A materialized view can be indexed. REFRESH MATERIALIZED VIEW CONCURRENTLY has requirements, including a suitable unique index, and should be practiced on a full server.
- Document the metric grain, exclusions, timezone and currency alongside a reporting view.

**Watch for:** Materialized data can be fast and stale. A refresh schedule must be part of the design, not an afterthought.

**Interview:** When would you use a materialized view?

Use one when an expensive, repeated computation can tolerate a defined freshness delay. Consider refresh cost, concurrency requirements, supporting indexes and failure monitoring. A normal view is preferable when current data and simpler maintenance matter more.

### 22.1 — A stable active-product view

Create lab.active_products as a view of product_id, name and price from active academy.products.

Hint: A view stores the SELECT definition.

Reference solution:

```sql
CREATE VIEW lab.active_products AS SELECT product_id,name,price FROM academy.products WHERE active;
```

### 22.2 — Materialize department sizes

Create materialized view lab.department_sizes with department_id and headcount from all employees.

Hint: GROUP BY sets the materialized result grain.

Reference solution:

```sql
CREATE MATERIALIZED VIEW lab.department_sizes AS SELECT department_id,count(*) AS headcount FROM academy.employees GROUP BY department_id;
```

### 22.3 — Use the order totals view

From academy.order_totals return order_id and merchandise_total for IDs 1 through 10, by order_id.

Hint: Inspect the view like a table.

Reference solution:

```sql
SELECT order_id,merchandise_total FROM academy.order_totals WHERE order_id<=10 ORDER BY order_id;
```

## Module 23: Functions and audit triggers

Production skills · Advanced

Functions can encapsulate reusable computation. Declare volatility honestly: IMMUTABLE means the same inputs always produce the same result, STABLE may read a consistent database snapshot, and VOLATILE permits changing results or side effects. Triggers run automatically for a table event and should be small, predictable and documented.

- SQL-language functions suit simple expressions; PL/pgSQL supports procedural control and trigger functions.
- Dollar quoting keeps function bodies readable without escaping every single quote.
- A row trigger exposes NEW and OLD records. BEFORE triggers can validate or change the row; AFTER triggers can record the completed operation.

**Watch for:** Do not label a function IMMUTABLE just to get an index accepted. An incorrect volatility promise can produce stale or incorrect results.

**Interview:** What are the trade-offs of database triggers?

Triggers enforce behavior for every writer and can create reliable audit records within the same transaction. They also add hidden work and coupling. Keep them focused, test multirow changes and rollback behavior, document them, and avoid unnecessary external side effects.

### 23.1 — A reusable net-price function

Create SQL function lab.net_price(amount numeric, discount numeric) returning numeric, immutable, that returns amount*(1-discount/100).

Hint: Use a dollar-quoted SQL expression.

Reference solution:

```sql
CREATE FUNCTION lab.net_price(amount numeric,discount numeric) RETURNS numeric LANGUAGE sql IMMUTABLE AS $$ SELECT amount*(1-discount/100) $$;
```

### 23.2 — A row-level audit trigger

lab.stock and lab.stock_audit are supplied. Create an AFTER UPDATE FOR EACH ROW trigger on lab.stock that inserts NEW.id, OLD.qty, NEW.qty into lab.stock_audit(id,old_qty,new_qty). Create a trigger function as needed.

Hint: The trigger function returns trigger and has access to OLD and NEW.

Starter fixture (run in your dedicated practice database):

```sql
CREATE TABLE lab.stock(id integer PRIMARY KEY,qty integer); CREATE TABLE lab.stock_audit(id integer,old_qty integer,new_qty integer); INSERT INTO lab.stock VALUES(1,10);
```

Reference solution:

```sql
CREATE FUNCTION lab.audit_stock() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN INSERT INTO lab.stock_audit VALUES(NEW.id,OLD.qty,NEW.qty); RETURN NEW; END $$; CREATE TRIGGER stock_changed AFTER UPDATE ON lab.stock FOR EACH ROW EXECUTE FUNCTION lab.audit_stock();
```

### 23.3 — Find the project database version

Return current_setting('server_version_num')::integer >= 160000 as supported.

Hint: Server functions help verify environment assumptions.

Reference solution:

```sql
SELECT current_setting('server_version_num')::integer >= 160000 AS supported;
```

## Module 24: Recursive hierarchies

Analysis · Advanced

WITH RECURSIVE combines an anchor query with a recursive term that refers to earlier results. It is useful for organizational charts, category trees and graph traversal. Each recursive step must move toward termination; cycles require explicit protection, such as a visited-key array or the PostgreSQL CYCLE clause.

- The anchor selects roots. The recursive term joins children to the preceding level.
- UNION ALL retains paths and is often appropriate for trees; it does not itself prevent cycles.
- Track depth and a visited path when working with uncontrolled graphs. A depth limit is a safety bound, not proof that the data is acyclic.

**Watch for:** A hierarchy in production may contain a cycle even if your sample does not. Include a deliberate cycle test in design reviews.

**Interview:** How do you keep a recursive query from looping forever?

Ensure the recursive term reaches a base condition and track visited keys or use CYCLE to reject repeated nodes on a path. Add appropriate resource limits. UNION can remove identical rows but is not a complete cycle strategy when depth or path columns keep changing.

### 24.1 — Hierarchy depth

Return employee_id and depth for all employees, where top-level managers have depth 0. Sort by employee_id.

Hint: Anchor at manager_id IS NULL.

Reference solution:

```sql
WITH RECURSIVE org AS (SELECT employee_id,manager_id,0 AS depth FROM academy.employees WHERE manager_id IS NULL UNION ALL SELECT e.employee_id,e.manager_id,o.depth+1 FROM academy.employees e JOIN org o ON e.manager_id=o.employee_id) SELECT employee_id,depth FROM org ORDER BY employee_id;
```

### 24.2 — Computing category descendants

Return category_id and name for Computing (category_id 1) and all its descendants, by category_id.

Hint: Join each category parent to the recursive result.

Reference solution:

```sql
WITH RECURSIVE tree AS (SELECT category_id,name FROM academy.categories WHERE category_id=1 UNION ALL SELECT c.category_id,c.name FROM academy.categories c JOIN tree t ON c.parent_id=t.category_id) SELECT * FROM tree ORDER BY category_id;
```

### 24.3 — Generate a bounded sequence

Use a recursive CTE to return a column n containing integers 1 through 10, ordered ascending.

Hint: The recursive WHERE clause is the stop condition.

Reference solution:

```sql
WITH RECURSIVE nums(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM nums WHERE n<10) SELECT n FROM nums ORDER BY n;
```

## Module 25: Time series and lateral joins

Analysis · Advanced

Time-series reporting needs an explicit calendar spine so missing observations remain visible. generate_series can create the expected dates; LEFT JOIN the observed values to distinguish a missing row from a measured zero. LATERAL allows a FROM subquery to refer to earlier rows, which is useful for a per-parent top-N lookup.

- Choose whether a missing observation should stay NULL or be filled with zero; availability reporting often needs the distinction.
- A LATERAL subquery can ORDER BY and LIMIT for each parent. A matching composite index can make this efficient.
- Use a fixed reporting window and define calendar boundaries explicitly.

**Watch for:** A moving average of available rows can conceal missing days. Build the date spine before calculating a calendar-based window.

**Interview:** What does LATERAL add to a join?

A LATERAL subquery can reference columns from earlier FROM items. It supports correlated table-producing logic such as the latest order for each customer. LEFT JOIN LATERAL ... ON true keeps parents whose subquery has no rows.

### 25.1 — A complete week of orders

Return day as a date and order_count for every day from 2025-01-01 through 2025-01-07, including zero counts, ordered by day.

Hint: Create the calendar independently from the observed orders.

Reference solution:

```sql
SELECT d.day::date AS day,count(o.order_id) AS order_count FROM generate_series(DATE '2025-01-01',DATE '2025-01-07',INTERVAL '1 day') d(day) LEFT JOIN academy.orders o ON o.order_date=d.day::date GROUP BY d.day ORDER BY d.day;
```

### 25.2 — Latest order including nonbuyers

For customers 1098 to 1103 return customer_id, order_id and order_date for their latest order or NULLs if none. Break date ties by highest order_id. Sort by customer_id.

Hint: A LEFT JOIN LATERAL keeps nonbuyers.

Reference solution:

```sql
SELECT c.customer_id,x.order_id,x.order_date FROM academy.customers c LEFT JOIN LATERAL (SELECT order_id,order_date FROM academy.orders o WHERE o.customer_id=c.customer_id ORDER BY order_date DESC,order_id DESC LIMIT 1) x ON true WHERE c.customer_id BETWEEN 1098 AND 1103 ORDER BY c.customer_id;
```

### 25.3 — Missing telemetry dates

Return day as a date for November 2025 dates without a metric for cell 1, by day. A complete series should return no rows.

Hint: Use a calendar anti join.

Reference solution:

```sql
SELECT d.day::date AS day FROM generate_series(DATE '2025-11-01',DATE '2025-11-30',INTERVAL '1 day') d(day) WHERE NOT EXISTS(SELECT 1 FROM academy.cell_metrics m WHERE m.cell_id=1 AND m.metric_date=d.day::date) ORDER BY d.day;
```

## Module 26: Query tuning and scalable design

Production skills · Advanced

Tuning starts with a measured workload and a correct query. Compare EXPLAIN (ANALYZE, BUFFERS) before and after a focused change. Inspect row estimates, unnecessary work, repeated loops, spilling sorts and access paths. Statistics guide planning; ANALYZE refreshes them. Partitioning helps some large workloads, but it is not a universal speed switch.

- Range predicates on an indexed date often work better than wrapping every row in a function. Expression indexes are an alternative when the expression is truly the access pattern.
- For large append-heavy timestamped tables, consider partition pruning and BRIN, then validate on realistic physical data layout.
- Separate correctness checks from performance claims. Report dataset size, parameters, cold/warm cache context and plan changes.

**Watch for:** Turning off sequential scans can demonstrate an index path but does not prove that path should be used in production.

**Interview:** What is your query tuning workflow?

Confirm the result and workload, collect an actual plan safely, compare estimates to actual rows, find the dominant work, change one thing, then rerun under comparable conditions. Evaluate write cost and other queries before keeping an index or schema change.

### 26.1 — Sargable month filter

Return order_count for orders in November 2025 using a half-open date range.

Hint: Avoid applying date_trunc to every filtered row.

Reference solution:

```sql
SELECT count(*) AS order_count FROM academy.orders WHERE order_date>=DATE '2025-11-01' AND order_date<DATE '2025-12-01';
```

### 26.2 — Index a repeated expression

lab.contacts(id,email) is supplied. Create index idx_contacts_lower_email on lower(email).

Hint: Put the same expression used by lookups in the index.

Starter fixture (run in your dedicated practice database):

```sql
CREATE TABLE lab.contacts(id integer,email text);
```

Reference solution:

```sql
CREATE INDEX idx_contacts_lower_email ON lab.contacts(lower(email));
```

### 26.3 — Pre-aggregate before joining

Return department_id, headcount and total_salary for every department, including empty ones. Use all employees; sort by department_id.

Hint: Aggregate employees to department grain before the dimension join.

Reference solution:

```sql
WITH e AS (SELECT department_id,count(*) AS headcount,sum(salary) AS total_salary FROM academy.employees GROUP BY department_id) SELECT d.department_id,coalesce(e.headcount,0) AS headcount,coalesce(e.total_salary,0) AS total_salary FROM academy.departments d LEFT JOIN e USING(department_id) ORDER BY d.department_id;
```

## Module 27: Security, recovery and concurrency

Production skills · Advanced

Production readiness includes least privilege, safe parameterized queries, backup restore practice, and concurrent updates. The browser lab has one database connection and is a personal sandbox. Multi-session locking, server roles, network access, backup tooling and operational monitoring should be practiced using the supplied full PostgreSQL local drills.

- Use placeholders and bound parameters for values. Identifiers need separate allowlisting or identifier quoting; values and identifiers are not interchangeable.
- READ COMMITTED takes a new snapshot per statement. SERIALIZABLE can detect anomalies and requires retry handling for serialization failures.
- A backup is only useful if you can restore it. Rehearse a restore into a separate database and validate tables and totals. VACUUM reclaims reusable space and supports visibility; ANALYZE updates planner statistics.

**Watch for:** Table owners normally bypass row-level security unless FORCE ROW LEVEL SECURITY is used. A successful owner query is not evidence that a restricted role sees only permitted rows.

**Interview:** How do you prevent lost updates and deadlocks?

Use an atomic update or acquire row locks before read-modify-write. Lock shared resources in a consistent order, keep transactions short, and handle deadlock or serialization errors with bounded retries. Test with separate connections, because one-session scripts cannot reproduce real contention.

### 27.1 — Identify the session

Return current_schema() IS NOT NULL as has_schema and current_database() IS NOT NULL as has_database.

Hint: Session functions describe the connected environment.

Reference solution:

```sql
SELECT current_schema() IS NOT NULL AS has_schema,current_database() IS NOT NULL AS has_database;
```

### 27.2 — Enable row-level security

lab.private_notes(id,owner_name) is supplied. Enable row-level security and create policy own_notes for SELECT using owner_name=current_user. Role behavior must be tested separately on a full server.

Hint: ENABLE ROW LEVEL SECURITY and CREATE POLICY are separate statements.

Starter fixture (run in your dedicated practice database):

```sql
CREATE TABLE lab.private_notes(id integer,owner_name text);
```

Reference solution:

```sql
ALTER TABLE lab.private_notes ENABLE ROW LEVEL SECURITY; CREATE POLICY own_notes ON lab.private_notes FOR SELECT USING(owner_name=current_user);
```

### 27.3 — Find orphaned customer references

Return order_id whose non-NULL customer_id has no matching customer, by order_id. Constraints should make the result empty.

Hint: This is an anti-join integrity audit.

Reference solution:

```sql
SELECT o.order_id FROM academy.orders o LEFT JOIN academy.customers c USING(customer_id) WHERE o.customer_id IS NOT NULL AND c.customer_id IS NULL ORDER BY o.order_id;
```

## Module 28: Telecom analytics capstone

Capstones · Advanced

Produce a network-quality report with a declared cell-day grain. Join dimensions only after checking their keys. A regional average across all cell-days is not necessarily the same as an average of regional daily averages when coverage changes. Separate capacity, throughput and availability before proposing an engineering action.

- Use the fixed November 2025 window so the report is reproducible.
- Flag high PRB and low throughput together; high utilization alone is not proof of a bad experience.
- A capstone deliverable should include SQL, assumptions, data-quality checks and an interpretation with operational caveats.

**Watch for:** Missing metrics are not healthy metrics. Report coverage and distinguish data absence from a measured zero.

**Interview:** How would you turn a KPI anomaly into an actionable report?

Specify the metric and grain, verify completeness, compare against a baseline, identify persistence and affected scope, and separate correlation from cause. Include cell/site/region context and propose a focused follow-up investigation rather than claiming the SQL alone proves a root cause.

### 28.1 — Worst-cell shortlist

Return cell_id and breach_days for cells with at least one day where prb_util_pct>90 and dl_throughput_mbps<3. Sort breach_days descending then cell_id.

Hint: Count only days where both thresholds are breached.

Reference solution:

```sql
SELECT cell_id,count(*) AS breach_days FROM academy.cell_metrics WHERE prb_util_pct>90 AND dl_throughput_mbps<3 GROUP BY cell_id ORDER BY breach_days DESC,cell_id;
```

### 28.2 — Regional performance

Return region name as region, avg_throughput and avg_availability rounded to two decimals across all observed November cell-days, alphabetically by region.

Hint: Join cell to site to region without changing the metric grain.

Reference solution:

```sql
SELECT r.name AS region,round(avg(m.dl_throughput_mbps),2) AS avg_throughput,round(avg(m.availability_pct),2) AS avg_availability FROM academy.cell_metrics m JOIN academy.cells c USING(cell_id) JOIN academy.sites s USING(site_id) JOIN academy.regions r USING(region_id) GROUP BY r.name ORDER BY r.name;
```

### 28.3 — Persistent low availability

Return cell_id and affected_days for cells with availability_pct<99 on at least two days, sorted by cell_id.

Hint: Use HAVING after grouping the bad days.

Reference solution:

```sql
SELECT cell_id,count(*) AS affected_days FROM academy.cell_metrics WHERE availability_pct<99 GROUP BY cell_id HAVING count(*)>=2 ORDER BY cell_id;
```

## Module 29: Commerce analytics capstone

Capstones · Advanced

Build a revenue and retention brief suitable for a portfolio. Define net merchandise revenue as item quantity × sale-time price after discount, excluding shipping and subtracting no returns unless the question asks for them. Do not call this accounting revenue without a confirmed recognition policy. Translate the result into a business explanation and reconcile it.

- A cancellation rate uses an explicit order population and period. A customer repeat rate needs its own customer-level denominator.
- Join refunds only after aggregation to avoid duplicating item revenue.
- Your README should state grain, date window, currency, statuses, exclusions and how someone can reproduce the result.

**Watch for:** A monthly order cohort is not the same as a signup cohort. Name the event that assigns the cohort.

**Interview:** What makes a SQL portfolio project convincing?

A clear business question, reproducible data loading, documented metric definitions, readable SQL, data-quality and reconciliation checks, sensible indexing evidence, and an explanation of findings and limitations. A reviewer should be able to rerun it and understand why the result is trustworthy.

### 29.1 — Monthly delivered merchandise revenue

Return month as a date and net_revenue rounded to cents for delivered orders, excluding shipping and returns. Order by month.

Hint: Use the order status and order date, but item amounts.

Reference solution:

```sql
SELECT date_trunc('month',o.order_date)::date AS month,round(sum(i.quantity*i.unit_price*(1-i.discount_pct/100)),2) AS net_revenue FROM academy.orders o JOIN academy.order_items i USING(order_id) WHERE o.status='delivered' GROUP BY 1 ORDER BY 1;
```

### 29.2 — Unsold active inventory

Return product_id and total_stock for active products with no order_items ever, sorted by product_id. Sum stock across all warehouses.

Hint: Combine a stock aggregation with NOT EXISTS.

Reference solution:

```sql
SELECT p.product_id,sum(i.quantity) AS total_stock FROM academy.products p JOIN academy.inventory i USING(product_id) WHERE p.active AND NOT EXISTS(SELECT 1 FROM academy.order_items oi WHERE oi.product_id=p.product_id) GROUP BY p.product_id ORDER BY p.product_id;
```

### 29.3 — Active monthly recurring revenue

As of 2025-10-01, return plan, subscriber_count and mrr as the sum of monthly_fee. Active means started_on<=as-of and ended_on is NULL or strictly greater than as-of. Sort by plan.

Hint: Treat ended_on as an exclusive end boundary.

Reference solution:

```sql
SELECT plan,count(*) AS subscriber_count,sum(monthly_fee) AS mrr FROM academy.subscriptions WHERE started_on<=DATE '2025-10-01' AND (ended_on IS NULL OR ended_on>DATE '2025-10-01') GROUP BY plan ORDER BY plan;
```

## Module 30: Final interview rehearsal

Capstones · Advanced

Work through these problems without opening the solution, then explain your assumptions and alternatives aloud. In an interview, a correct result is only part of the answer. Clarify grain, NULL behavior, duplicates, ties and date boundaries before you optimize. For design questions, describe constraints and the trade-offs you are making.

- Use a 45-minute SQL mock: 5 minutes to clarify, 30 to solve three questions, and 10 to verify edge cases and explain the plan.
- Use a 30-minute design mock: requirements, entities and keys, relationships, constraints, access patterns, recovery and migrations.
- Readiness is evidence-based. Re-solve weak topics without hints, finish both capstone writeups and complete the local production drills. Calendar completion alone is not proof of job readiness.

**Watch for:** Memorizing a solution does not show transfer. Change a threshold, add a tie or introduce a NULL and explain what should happen.

**Interview:** What do you do when a SQL interview problem is ambiguous?

Ask for the intended output grain, date window, status definitions, duplicate policy, NULL behavior and tie handling. State reasonable assumptions if answers are unavailable. Produce a correct baseline, validate small examples, then discuss indexes and scale.

### 30.1 — Second-highest distinct salary

Return one column second_salary containing the second-highest distinct employee salary.

Hint: Distinct ranking matters when the highest salary is tied.

Reference solution:

```sql
SELECT max(salary) AS second_salary FROM academy.employees WHERE salary<(SELECT max(salary) FROM academy.employees);
```

### 30.2 — Repeat delivered-order customers

Return customer_id and delivered_orders for customers with at least 8 delivered orders, sorted by delivered_orders descending then customer_id.

Hint: Filter status before grouping.

Reference solution:

```sql
SELECT customer_id,count(*) AS delivered_orders FROM academy.orders WHERE status='delivered' GROUP BY customer_id HAVING count(*)>=8 ORDER BY delivered_orders DESC,customer_id;
```

### 30.3 — Largest month-to-month order increase

Return month as a date and increase for the month with the largest increase in all-status order count over its previous month. Exclude the first month. Break ties by earliest month.

Hint: Combine a monthly CTE, LAG and a final top-one selection.

Reference solution:

```sql
WITH m AS(SELECT date_trunc('month',order_date)::date AS month,count(*) AS n FROM academy.orders GROUP BY 1),d AS(SELECT month,n-lag(n) OVER(ORDER BY month) AS increase FROM m) SELECT month,increase FROM d WHERE increase IS NOT NULL ORDER BY increase DESC,month LIMIT 1;
```

## Knowledge check

### 1. Which expression finds missing delivery dates?

1. delivered_at = NULL
2. delivered_at IS NULL
3. delivered_at == NULL
4. delivered_at IN (NULL)

Answer: 2. Use IS NULL; ordinary equality with NULL evaluates to UNKNOWN.

### 2. Which COUNT gives zero for unmatched orders after a customer LEFT JOIN?

1. COUNT(*)
2. COUNT(customer_id)
3. COUNT(o.order_id)
4. COUNT(1)

Answer: 3. Count a non-null key from the right side, not the preserved outer row.

### 3. Which clause filters groups after aggregation?

1. WHERE
2. HAVING
3. LIMIT
4. ON

Answer: 2. HAVING can test aggregate results.

### 4. What result can 5 / 2 produce when both operands are PostgreSQL integers?

1. 2
2. 2.5
3. 3
4. NULL

Answer: 1. Integer division truncates. Cast an operand to numeric for a fractional answer.

### 5. Which operation preserves duplicate result rows?

1. UNION
2. UNION ALL
3. INTERSECT
4. EXCEPT

Answer: 2. UNION ALL appends without duplicate elimination.

### 6. Which ranking for 100,100,90 is DENSE_RANK descending?

1. 1,2,3
2. 1,1,3
3. 1,1,2
4. 0,0,1

Answer: 3. DENSE_RANK does not leave a gap after ties.

### 7. Which JSONB operator extracts text?

1. ->
2. ->>
3. @>
4. ?

Answer: 2. ->> returns text; -> returns a JSON value.

### 8. CHECK(amount > 0) without NOT NULL does what with NULL?

1. Always rejects it
2. Allows it
3. Changes it to zero
4. Raises a syntax error

Answer: 2. A CHECK permits TRUE or UNKNOWN; NOT NULL is a separate constraint.

### 9. An order joins three items and two independent tags. How many joined rows can result?

1. 2
2. 3
3. 5
4. 6

Answer: 4. The one-to-many matches multiply: three times two.

### 10. What does EXPLAIN ANALYZE do?

1. Only estimates a query
2. Executes the statement and measures work
3. Creates an index
4. Updates all statistics

Answer: 2. ANALYZE in EXPLAIN executes the statement, including writes.

### 11. What is required for a reliable next-page keyset query?

1. No ORDER BY
2. A stable ordering and continuation key
3. An increasing OFFSET only
4. SELECT DISTINCT on every column

Answer: 2. Use the same stable sort keys in the predicate and ORDER BY.

### 12. Which stores the price actually agreed at purchase time?

1. Only products.price
2. order_items.unit_price
3. Current category name
4. The average product price

Answer: 2. Historical sale price is a transaction fact.

### 13. Which is normally a good PostgreSQL type for exact monetary calculations?

1. real
2. double precision
3. numeric
4. text

Answer: 3. Numeric supports exact decimal arithmetic; scale and rounding still need a business rule.

### 14. After an error inside BEGIN, what normally restores a usable transaction state?

1. Ignore the error
2. SELECT 1
3. ROLLBACK or ROLLBACK TO a prior savepoint
4. Another INSERT

Answer: 3. PostgreSQL leaves the transaction aborted until rollback.

### 15. A materialized view is best described as what?

1. Always current
2. A stored result that needs refresh
3. An automatic backup
4. An index alias

Answer: 2. Freshness depends on its refresh strategy.

### 16. Which avoids NOT IN problems caused by NULL in the subquery?

1. NOT EXISTS with a correlated key
2. Adding LIMIT 1
3. COUNT(*)
4. ORDER BY

Answer: 1. NOT EXISTS tests matching-row existence without NULL poisoning.

### 17. Can a table owner normally bypass enabled row-level security?

1. Yes, unless forced
2. No, never
3. Only in a view
4. Only after VACUUM

Answer: 1. Owners normally bypass RLS; test with the actual restricted role.

### 18. Which month filter is half-open?

1. d BETWEEN '2025-11-01' AND '2025-12-01'
2. d >= '2025-11-01' AND d < '2025-12-01'
3. d > '2025-11-01'
4. d <= '2025-12-01'

Answer: 2. Include the beginning and exclude the next period boundary.

### 19. What is the safest way to pass an untrusted value to an application query?

1. Concatenate it into SQL
2. Remove spaces
3. Use a bound query parameter
4. Convert it to uppercase

Answer: 3. Bound parameters keep values separate from the SQL syntax.

### 20. What best proves a backup is useful?

1. The dump file exists
2. The file is large
3. A successful restore with validation
4. A green dashboard

Answer: 3. Restore into a separate database and validate expected data.

## Interview review

### 1. How do a database, schema and table differ?

A server can host multiple databases. A database contains schemas, which are namespaces for tables, views and functions. A table contains typed rows. A connection targets one database; a qualified name such as academy.customers selects a schema and table.

### 2. Explain your first postgresql queries to a teammate. What should they watch for?

A database holds related tables. A row represents one record and a column represents an attribute. PostgreSQL uses schemas to group objects inside a database. Our sample data lives in academy; your new objects belong in lab. Use schema-qualified names so a query means the same thing in the app, pgAdmin and DBeaver.

Watch for: SELECT * is useful for exploration, but explicit columns make reporting contracts stable when tables change.

### 3. Why does column = NULL return no matches?

Ordinary comparisons with NULL evaluate to UNKNOWN. WHERE keeps TRUE only. Use IS NULL to find missing values, or IS NOT DISTINCT FROM for equality that treats two NULLs as equal.

### 4. Explain filter precisely to a teammate. What should they watch for?

A WHERE clause keeps only rows whose predicate is TRUE. FALSE and UNKNOWN both fail the filter. Combine predicates with AND and OR, and use parentheses to express your intended logic. IN is a readable alternative to repeated equality checks; BETWEEN includes both bounds.

Watch for: AND binds more tightly than OR. Parenthesize mixed conditions rather than relying on a reader to remember precedence.

### 5. When is keyset pagination preferable to OFFSET?

Use keyset pagination for large changing lists when sequential navigation matters. It can seek through an appropriate index and avoids scanning a growing offset. It needs stable sort keys and is less convenient for jumping directly to an arbitrary page number.

### 6. Explain sort, search and paginate to a teammate. What should they watch for?

ORDER BY lets you define a meaningful result order, with ASC or DESC on each key. Business lists often need a second key to resolve ties. OFFSET pagination is easy to implement, but the server still walks skipped rows and changes can shift page boundaries. Keyset pagination instead continues from the last sort key.

Watch for: LIMIT without ORDER BY produces an arbitrary subset, not a stable first page.

### 7. What is the difference between COUNT(*) and COUNT(column)?

COUNT(*) counts all rows after filtering. COUNT(column) counts rows where that column is not NULL. COUNT(DISTINCT column) counts distinct non-NULL values. Use the version matching the metric you intend.

### 8. Explain aggregate business metrics to a teammate. What should they watch for?

Aggregation collapses many rows into a summary. COUNT(*) counts rows; COUNT(column) counts non-NULL values. SUM and AVG ignore NULL inputs and normally return NULL when no rows qualify. Monetary calculations use numeric rather than floating point to avoid representation surprises.

Watch for: AVG of averages is not the overall average unless group sizes are equal. Carry totals and counts when aggregating summaries.

### 9. How do WHERE and HAVING differ?

WHERE filters rows before grouping and cannot directly reference a group aggregate. HAVING filters the groups produced by GROUP BY and can test aggregates. Use WHERE for row predicates whenever possible.

### 10. Explain group and segment to a teammate. What should they watch for?

GROUP BY changes the output grain to one row per combination of grouping keys. Every selected expression must either be a grouping key or an aggregate, except where PostgreSQL can infer a functional dependency from a primary key. WHERE filters input rows; HAVING filters completed groups.

Watch for: Filtering a joined table in WHERE can change a LEFT JOIN into an effective INNER JOIN and remove zero-activity groups.

### 11. How would you diagnose duplicate rows after a join?

Check the intended grain and the uniqueness of each join key. Count matches per key on both sides. A many-to-many match multiplies rows. Fix the join predicate or pre-aggregate to the intended grain; DISTINCT can hide the symptom without fixing the metric.

### 12. Explain join related tables to a teammate. What should they watch for?

An INNER JOIN returns combinations that satisfy the join predicate. Primary and foreign keys describe relationships, but they do not automatically prevent a query from multiplying rows. If one order has three items and two other matching records, a broad join can produce six rows before aggregation.

Watch for: A plausible total can still be wrong. Reconcile joined row counts and totals against the source before trusting a report.

### 13. Why can NOT IN behave unexpectedly with NULL?

If a NOT IN subquery includes NULL, comparisons for values without a positive match become UNKNOWN. WHERE removes those rows. NOT EXISTS checks whether a matching row exists and is not poisoned by an unrelated NULL.

### 14. Explain outer, anti and self joins to a teammate. What should they watch for?

A LEFT JOIN preserves every left-hand row and fills unmatched right-hand columns with NULL. Use it for coverage reports that must include zero-activity records. An anti join finds rows with no match. A self join connects different roles within the same table, such as employee and manager.

Watch for: Never assume every customer has an order. Our dataset deliberately includes customers and products with no sales.

### 15. How would you calculate a safe percentage?

Define numerator and denominator on the same grain, use numeric division, multiply by 100, and divide by NULLIF(denominator,0). Choose whether an undefined result should stay NULL or have a documented fallback.

### 16. Explain nulls and conditional logic to a teammate. What should they watch for?

CASE expresses business rules in a query. PostgreSQL uses the first matching branch, so put the most specific condition first. COALESCE returns the first non-NULL argument. NULLIF returns NULL when two values are equal, which is useful for protecting a denominator without inventing a misleading zero.

Watch for: A 0% rate and an undefined rate are different. Return NULL for an empty denominator unless the business definition explicitly says otherwise.

### 17. How should timezones be handled in reporting?

Store real event instants with timestamptz and convert to the agreed reporting timezone before grouping into local days. Keep timezone rules explicit, especially around daylight-saving boundaries. Use date for a value that is only a calendar date.

### 18. Explain dates, intervals and cohorts to a teammate. What should they watch for?

Use date for calendar dates and timestamptz for real-world instants that need timezone-aware comparison. PostgreSQL stores timestamptz as an instant and renders it in the session timezone. A timestamp without time zone is a wall-clock value; the database cannot infer which zone it belongs to.

Watch for: Do not use CURRENT_DATE in a historical exercise without considering that the data is fixed. Your result would change over time.

### 19. When would you use EXISTS instead of JOIN?

Use EXISTS to filter one table by whether a related record exists without needing that record in the output. It preserves the outer grain and avoids duplicate outer rows when several matches exist. Use JOIN when you need attributes or combinations from both inputs.

### 20. Explain subqueries and existence to a teammate. What should they watch for?

A subquery can produce a scalar, a set, or a derived table. A scalar subquery must return at most one row; aggregate queries without GROUP BY usually do. A correlated subquery references the current outer row. EXISTS cares only whether any match exists, so its projected value is unimportant.

Watch for: A scalar subquery that starts returning two rows fails at runtime. Enforce uniqueness when your query depends on it.

### 21. Are CTEs always materialized?

No. PostgreSQL can inline a side-effect-free nonrecursive CTE in suitable cases. Multiple references and MATERIALIZED or NOT MATERIALIZED influence planning. Inspect EXPLAIN rather than relying on a blanket rule.

### 22. Explain readable queries with ctes to a teammate. What should they watch for?

A common table expression gives a name to an intermediate query. Use WITH to separate metric definition, aggregation and presentation. CTEs improve readability but are not automatically a performance optimization: PostgreSQL may inline a nonrecursive, side-effect-free CTE, while materialization can affect the plan.

Watch for: A cleanly formatted query can still double-count. Check the key uniqueness of every CTE that you join.

### 23. How do RANK, DENSE_RANK and ROW_NUMBER differ?

For tied values 100,100,90, ROW_NUMBER assigns 1,2,3 using its ordering, RANK gives 1,1,3 and DENSE_RANK gives 1,1,2. Add a tie-breaker for deterministic ROW_NUMBER; adding it to a rank changes which rows are peers.

### 24. Explain window functions to a teammate. What should they watch for?

Window functions calculate across related rows while keeping each input row in the output. OVER defines the partition, ordering and optional frame. GROUP BY collapses rows; a window usually does not. You can layer a window on an aggregate to produce cumulative monthly metrics.

Watch for: The default ordered window frame includes peers. SUM(value) OVER (ORDER BY date) may jump across several rows with the same date.

### 25. How would you get the latest record per customer?

Assign ROW_NUMBER partitioned by customer and ordered by timestamp descending plus a unique ID descending, then keep rn=1. PostgreSQL DISTINCT ON is another option when ORDER BY starts with the DISTINCT ON keys and encodes the same survivor rule.

### 26. Explain top-n, frames and deduplication to a teammate. What should they watch for?

Top-N-per-group is a frequent interview problem. Calculate a row number within each group, then filter it in an outer query: window results are not available to WHERE at the same query level. Explicit frame boundaries also make moving averages and first/last value calculations easier to reason about.

Watch for: LAST_VALUE often returns the current frame endpoint, not the last row of the partition. Specify the full frame when that is what you need.

### 27. What is the practical difference between UNION and UNION ALL?

UNION removes duplicate result rows, which changes semantics and costs work. UNION ALL concatenates all rows. Choose based on whether duplicates are allowed, not simply on a habit or a performance slogan.

### 28. Explain set operations to a teammate. What should they watch for?

UNION, INTERSECT and EXCEPT combine compatible result sets vertically. Inputs must have the same number of columns with compatible types. UNION removes duplicates; UNION ALL preserves them and avoids duplicate elimination. INTERSECT retains overlap, while EXCEPT finds rows in the first input but not the second.

Watch for: UNION can silently hide a data-quality problem by discarding duplicate records.

### 29. When should data be stored in JSONB rather than normalized tables?

Use JSONB for variable optional document-like attributes that do not need strong relational constraints. Use typed columns and related tables for stable keys, frequently filtered fields, many-to-many relationships and attributes requiring referential integrity. Design indexes from actual query patterns.

### 30. Explain jsonb and arrays to a teammate. What should they watch for?

JSONB is useful for attributes whose structure varies, but core relationships still benefit from typed relational columns and foreign keys. The -> operator returns JSON, while ->> returns text. Cast extracted text before numeric comparison. JSONB supports containment predicates and, for appropriate workloads, GIN indexes.

Watch for: Comparing extracted numeric strings lexicographically gives incorrect numeric ordering. Cast to the intended numeric type.

### 31. How would you design a reliable ingestion pipeline?

Load raw data into a staging area, attach source and load identifiers, validate types and business keys, separate invalid rows with reasons, then apply an idempotent merge in a transaction. Reconcile row counts and totals and preserve enough lineage to reproduce each transformation.

### 32. Explain clean and validate data to a teammate. What should they watch for?

Data cleaning should make rules explicit and measurable. Preserve raw inputs when corrections need to be audited. Use trimming, case normalization and pattern checks at ingestion boundaries. Avoid silently transforming every unusual value into an apparently valid one; invalid rows may belong in a quarantine report.

Watch for: Do not normalize personal names or email local parts with destructive rules unless the business has agreed to those semantics.

### 33. What belongs in a database constraint?

Stable data invariants such as keys, mandatory values, valid ranges and referential integrity belong in constraints. Cross-row rules may need unique/exclusion constraints or carefully designed transactions. Keep changing workflow policy separate when it is not a persistent data invariant.

### 34. Explain design tables and constraints to a teammate. What should they watch for?

Good database design encodes important rules so all writers obey them. Choose types based on meaning: numeric for exact financial amounts, integer for counts, date for calendar days and timestamptz for instants. A primary key identifies a row; a unique constraint protects a candidate key; a CHECK restricts allowed row values.

Watch for: A numeric CHECK(amount>=0) does not reject NULL. Combine it with NOT NULL if an amount is required.

### 35. Why store unit_price on order_items if products already has price?

products.price is the current catalog price. order_items.unit_price is the price agreed for a specific sale. They are different facts with different time semantics; preserving sale-time price supports correct historical reporting and refunds.

### 36. Explain relationships and normalization to a teammate. What should they watch for?

Normalization reduces update anomalies by storing each fact at its appropriate grain. First normal form avoids repeating groups; second removes partial dependencies on a composite key; third removes transitive dependencies between non-key attributes. These principles guide choices, but workload-driven denormalization can be justified when its consistency cost is understood.

Watch for: Do not copy current product price into reports of historical sales. Use the price recorded at purchase time.

### 37. How would you perform a risky data correction?

Back up or record the affected keys and old values, preview the exact predicate, run a bounded transaction, use RETURNING and reconciliation checks, then commit only when the expected row count and invariants match. Test the rollback path and avoid holding locks unnecessarily.

### 38. Explain insert, update and delete safely to a teammate. What should they watch for?

DML changes records. Before writing UPDATE or DELETE, first run a SELECT with the same predicate and inspect its scope. RETURNING can show exactly what changed. Group related writes in a transaction and verify the business invariant before committing. The checked labs use isolated fixtures so your learning database remains intact.

Watch for: A successful statement only proves syntactic and constraint validity. Verify row counts and the intended business result too.

### 39. What happens after a statement fails inside a transaction?

The transaction is in an aborted state and subsequent commands fail until ROLLBACK, or ROLLBACK TO a savepoint created before the error. A client should not blindly continue and later assume COMMIT saved the intended changes.

### 40. Explain transactions and idempotent writes to a teammate. What should they watch for?

A transaction groups operations into an all-or-nothing unit. BEGIN starts it, COMMIT persists it and ROLLBACK discards it. If a statement fails, PostgreSQL marks the transaction aborted until you roll back, or roll back to an earlier savepoint. Idempotent ingestion can be rerun without creating duplicate business records.

Watch for: An upsert that increments a value is not idempotent when the same input is retried. Choose replacement or a deduplicated event key for retryable ingestion.

### 41. Why might PostgreSQL ignore an index?

A sequential scan can be cheaper when a large fraction of the table qualifies or the table is small. Other reasons include stale statistics, incompatible expressions or types, unsuitable column order, and cost settings. Compare estimated and actual rows and inspect the exact predicate.

### 42. Explain indexes and execution plans to a teammate. What should they watch for?

Indexes trade storage and write overhead for faster access to selected rows. A B-tree is a strong default for equality and ordered range predicates. Composite index order should reflect actual filters and ordering. PostgreSQL may still choose a sequential scan if many rows qualify or the table is small.

Watch for: A small synthetic dataset cannot establish production performance. Check plans locally with realistic distributions and data volume.

### 43. When would you use a materialized view?

Use one when an expensive, repeated computation can tolerate a defined freshness delay. Consider refresh cost, concurrency requirements, supporting indexes and failure monitoring. A normal view is preferable when current data and simpler maintenance matter more.

### 44. Explain views and reporting contracts to a teammate. What should they watch for?

A view names a stored query and normally computes its result when queried. It can simplify report contracts without copying rows. A materialized view stores the result and needs a refresh policy. Pick a freshness requirement before choosing between a live view, materialized view or an aggregate table.

Watch for: Materialized data can be fast and stale. A refresh schedule must be part of the design, not an afterthought.

### 45. What are the trade-offs of database triggers?

Triggers enforce behavior for every writer and can create reliable audit records within the same transaction. They also add hidden work and coupling. Keep them focused, test multirow changes and rollback behavior, document them, and avoid unnecessary external side effects.

### 46. Explain functions and audit triggers to a teammate. What should they watch for?

Functions can encapsulate reusable computation. Declare volatility honestly: IMMUTABLE means the same inputs always produce the same result, STABLE may read a consistent database snapshot, and VOLATILE permits changing results or side effects. Triggers run automatically for a table event and should be small, predictable and documented.

Watch for: Do not label a function IMMUTABLE just to get an index accepted. An incorrect volatility promise can produce stale or incorrect results.

### 47. How do you keep a recursive query from looping forever?

Ensure the recursive term reaches a base condition and track visited keys or use CYCLE to reject repeated nodes on a path. Add appropriate resource limits. UNION can remove identical rows but is not a complete cycle strategy when depth or path columns keep changing.

### 48. Explain recursive hierarchies to a teammate. What should they watch for?

WITH RECURSIVE combines an anchor query with a recursive term that refers to earlier results. It is useful for organizational charts, category trees and graph traversal. Each recursive step must move toward termination; cycles require explicit protection, such as a visited-key array or the PostgreSQL CYCLE clause.

Watch for: A hierarchy in production may contain a cycle even if your sample does not. Include a deliberate cycle test in design reviews.

### 49. What does LATERAL add to a join?

A LATERAL subquery can reference columns from earlier FROM items. It supports correlated table-producing logic such as the latest order for each customer. LEFT JOIN LATERAL ... ON true keeps parents whose subquery has no rows.

### 50. Explain time series and lateral joins to a teammate. What should they watch for?

Time-series reporting needs an explicit calendar spine so missing observations remain visible. generate_series can create the expected dates; LEFT JOIN the observed values to distinguish a missing row from a measured zero. LATERAL allows a FROM subquery to refer to earlier rows, which is useful for a per-parent top-N lookup.

Watch for: A moving average of available rows can conceal missing days. Build the date spine before calculating a calendar-based window.

### 51. What is your query tuning workflow?

Confirm the result and workload, collect an actual plan safely, compare estimates to actual rows, find the dominant work, change one thing, then rerun under comparable conditions. Evaluate write cost and other queries before keeping an index or schema change.

### 52. Explain query tuning and scalable design to a teammate. What should they watch for?

Tuning starts with a measured workload and a correct query. Compare EXPLAIN (ANALYZE, BUFFERS) before and after a focused change. Inspect row estimates, unnecessary work, repeated loops, spilling sorts and access paths. Statistics guide planning; ANALYZE refreshes them. Partitioning helps some large workloads, but it is not a universal speed switch.

Watch for: Turning off sequential scans can demonstrate an index path but does not prove that path should be used in production.

### 53. How do you prevent lost updates and deadlocks?

Use an atomic update or acquire row locks before read-modify-write. Lock shared resources in a consistent order, keep transactions short, and handle deadlock or serialization errors with bounded retries. Test with separate connections, because one-session scripts cannot reproduce real contention.

### 54. Explain security, recovery and concurrency to a teammate. What should they watch for?

Production readiness includes least privilege, safe parameterized queries, backup restore practice, and concurrent updates. The browser lab has one database connection and is a personal sandbox. Multi-session locking, server roles, network access, backup tooling and operational monitoring should be practiced using the supplied full PostgreSQL local drills.

Watch for: Table owners normally bypass row-level security unless FORCE ROW LEVEL SECURITY is used. A successful owner query is not evidence that a restricted role sees only permitted rows.

### 55. How would you turn a KPI anomaly into an actionable report?

Specify the metric and grain, verify completeness, compare against a baseline, identify persistence and affected scope, and separate correlation from cause. Include cell/site/region context and propose a focused follow-up investigation rather than claiming the SQL alone proves a root cause.

### 56. Explain telecom analytics capstone to a teammate. What should they watch for?

Produce a network-quality report with a declared cell-day grain. Join dimensions only after checking their keys. A regional average across all cell-days is not necessarily the same as an average of regional daily averages when coverage changes. Separate capacity, throughput and availability before proposing an engineering action.

Watch for: Missing metrics are not healthy metrics. Report coverage and distinguish data absence from a measured zero.

### 57. What makes a SQL portfolio project convincing?

A clear business question, reproducible data loading, documented metric definitions, readable SQL, data-quality and reconciliation checks, sensible indexing evidence, and an explanation of findings and limitations. A reviewer should be able to rerun it and understand why the result is trustworthy.

### 58. Explain commerce analytics capstone to a teammate. What should they watch for?

Build a revenue and retention brief suitable for a portfolio. Define net merchandise revenue as item quantity × sale-time price after discount, excluding shipping and subtracting no returns unless the question asks for them. Do not call this accounting revenue without a confirmed recognition policy. Translate the result into a business explanation and reconcile it.

Watch for: A monthly order cohort is not the same as a signup cohort. Name the event that assigns the cohort.

### 59. What do you do when a SQL interview problem is ambiguous?

Ask for the intended output grain, date window, status definitions, duplicate policy, NULL behavior and tie handling. State reasonable assumptions if answers are unavailable. Produce a correct baseline, validate small examples, then discuss indexes and scale.

### 60. Explain final interview rehearsal to a teammate. What should they watch for?

Work through these problems without opening the solution, then explain your assumptions and alternatives aloud. In an interview, a correct result is only part of the answer. Clarify grain, NULL behavior, duplicates, ties and date boundaries before you optimize. For design questions, describe constraints and the trade-offs you are making.

Watch for: Memorizing a solution does not show transfer. Change a threshold, add a tie or introduce a NULL and explain what should happen.

