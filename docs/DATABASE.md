# Practice database reference

25 base tables · 90,532 seeded records · one live reporting view. All data is synthetic and deterministic. Monetary examples are in USD; commerce dates are in 2025 and cell metrics cover November 2025.

## Commerce

| Table | Seeded rows | Purpose |
|---|---:|---|
| academy.countries | 8 | Country and geographic region lookup. |
| academy.categories | 8 | Product categories, including a parent-child hierarchy. |
| academy.suppliers | 20 | Supplier location and lead time. |
| academy.customers | 1,200 | Customer profile, segment, referrals and JSON preferences. |
| academy.addresses | 1,500 | Billing and shipping addresses; some postcodes are missing. |
| academy.products | 240 | Current catalog prices and variable JSON attributes. |
| academy.orders | 10,000 | One row per order; 2025 dates across four statuses. |
| academy.order_items | 30,000 | Three lines per order, with sale-time price and discount. |
| academy.payments | 8,391 | One captured payment per shipped or delivered order. |
| academy.shipments | 8,391 | Shipping dates and nullable delivery dates. |
| academy.returns | 582 | Synthetic item returns with a one-unit refund. |
| academy.warehouses | 3 | Three physical inventory locations. |
| academy.inventory | 720 | Product stock at each warehouse; composite key. |

## People

| Table | Seeded rows | Purpose |
|---|---:|---|
| academy.departments | 6 | Department names and annual budgets. |
| academy.employees | 180 | Staff, salary and a self-referencing manager key. |
| academy.projects | 18 | Project ownership, dates and budgets. |
| academy.employee_projects | 360 | Many-to-many employee allocations. |
| academy.timesheets | 3,000 | Hours worked by employee, project and day. |

## Telecom

| Table | Seeded rows | Purpose |
|---|---:|---|
| academy.regions | 5 | Five operational regions. |
| academy.sites | 100 | Network sites and geographic coordinates. |
| academy.cells | 600 | 600 LTE/5G cells across 100 sites. |
| academy.cell_metrics | 18,000 | 18,000 cell-day observations in November 2025. |
| academy.incidents | 300 | Network incidents with open and closed timestamps. |

## Growth

| Table | Seeded rows | Purpose |
|---|---:|---|
| academy.subscriptions | 900 | Start/end boundaries and monthly fees. |
| academy.events | 6,000 | User events, anonymous visitors and JSON metadata. |

## Foreign-key relationships

| Child | Parent | Definition |
|---|---|---|
| addresses | customers | FOREIGN KEY (customer_id) REFERENCES customers(customer_id) |
| categories | categories | FOREIGN KEY (parent_id) REFERENCES categories(category_id) |
| cell_metrics | cells | FOREIGN KEY (cell_id) REFERENCES cells(cell_id) |
| cells | sites | FOREIGN KEY (site_id) REFERENCES sites(site_id) |
| customers | countries | FOREIGN KEY (country_code) REFERENCES countries(country_code) |
| customers | customers | FOREIGN KEY (referred_by) REFERENCES customers(customer_id) |
| employee_projects | employees | FOREIGN KEY (employee_id) REFERENCES employees(employee_id) |
| employee_projects | projects | FOREIGN KEY (project_id) REFERENCES projects(project_id) |
| employees | departments | FOREIGN KEY (department_id) REFERENCES departments(department_id) |
| employees | employees | FOREIGN KEY (manager_id) REFERENCES employees(employee_id) |
| events | customers | FOREIGN KEY (customer_id) REFERENCES customers(customer_id) |
| incidents | cells | FOREIGN KEY (cell_id) REFERENCES cells(cell_id) |
| inventory | products | FOREIGN KEY (product_id) REFERENCES products(product_id) |
| inventory | warehouses | FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id) |
| order_items | orders | FOREIGN KEY (order_id) REFERENCES orders(order_id) |
| order_items | products | FOREIGN KEY (product_id) REFERENCES products(product_id) |
| orders | customers | FOREIGN KEY (customer_id) REFERENCES customers(customer_id) |
| payments | orders | FOREIGN KEY (order_id) REFERENCES orders(order_id) |
| products | categories | FOREIGN KEY (category_id) REFERENCES categories(category_id) |
| products | suppliers | FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) |
| projects | departments | FOREIGN KEY (department_id) REFERENCES departments(department_id) |
| returns | order_items | FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id) |
| shipments | orders | FOREIGN KEY (order_id) REFERENCES orders(order_id) |
| sites | regions | FOREIGN KEY (region_id) REFERENCES regions(region_id) |
| subscriptions | customers | FOREIGN KEY (customer_id) REFERENCES customers(customer_id) |
| suppliers | countries | FOREIGN KEY (country_code) REFERENCES countries(country_code) |
| timesheets | employees | FOREIGN KEY (employee_id) REFERENCES employees(employee_id) |
| timesheets | projects | FOREIGN KEY (project_id) REFERENCES projects(project_id) |
| warehouses | countries | FOREIGN KEY (country_code) REFERENCES countries(country_code) |

## Working schemas

- `academy`: reference data, indexes and `order_totals` view. SQL Studio permits experimentation here; restoring the dataset removes those changes.
- `lab`: a scratch area for your own DDL and DML exercises. Preparing an exercise resets this schema after confirmation.

## Data definitions

- Net merchandise amount = quantity × unit_price × (1 − discount_pct / 100).
- Captured payments for shipped/delivered orders include shipping.
- Returns represent one returned unit and do not rewrite the original sale.
- Not every customer or product has orders. Several nullable columns deliberately exercise NULL handling.
- Employee salaries, product costs and other business values are synthetic teaching fixtures rather than real market statistics.
- Counts refer to the original seed. Your sandbox can diverge until you restore it.
