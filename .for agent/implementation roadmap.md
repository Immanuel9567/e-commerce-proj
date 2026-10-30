Here is an actionable, phase-by-phase implementation plan tailored for an AI coding agent (like Cursor, Windsurf, or a custom LLM pipeline) to build your custom e-commerce admin panel.
To prevent the agent from hitting context window limits or breaking existing code, this plan uses an incremental, schema-first development strategy.

Phase 1: Database Schema & Authentication (Core Groundwork)

Before the agent writes any frontend UI, it must establish a bulletproof data layer.
Agent Prompt Directive:
"Act as a senior database architect. Define the database schema using our ORM (e.g., Prisma, Mongoose, TypeORM) for the core admin features. Create migrations for users (with role-based access fields), products, product variants, inventory, and orders. Ensure we implement soft-deletes (deletedAt timestamp) for products and orders."
• Step 1.1: Have the agent generate the User & RBAC Schema (Roles: admin, fulfillment, viewer).
• Step 1.2: Generate the Product & Variant relationship (One product can have many variants, e.g., Size/Color, each with its own price, sku, and stock_quantity).
• Step 1.3: Implement Session-based or JWT Auth restricted strictly to users where role is authorized to access /admin/* endpoints.

Phase 2: Headless Backend APIs (CRUD Actions)

Instruct your agent to build the programmatic logic (endpoints) before attaching a visual interface.
Agent Prompt Directive:
"Build secure REST/GraphQL API endpoints for the admin panel. Ensure all endpoints under /api/admin/ check for an authenticated session and require admin or fulfillment role authorization. Write robust validation logic for incoming requests."
• Step 2.1: Product API: Build endpoints for GET (paginated), POST (create with variants), PUT (update stock/price), and DELETE (soft-delete).
• Step 2.2: Order Fulfillment API: Build a PATCH /api/admin/orders/:id/status endpoint that handles shifting states (Pending → Processing → Shipped → Delivered) and prevents illegal status jumps (e.g., Pending directly to Delivered).
• Step 2.3: Audit Trail middleware: Have the agent write a global middleware for admin endpoints that logs every destructive action (user_id, action, timestamp, target_id) into a database table called audit_logs.

Phase 3: Layout & Data Tables (The UI Shell)

Now, transition the agent to building the frontend views using your chosen component library.
Agent Prompt Directive:
"Build an admin layout shell with a collapsible sidebar, breadcrumbs, and a user profile dropdown. Inside this layout, create a reusable Data Table component featuring server-side pagination, text search, and status filtering using our existing UI kit."
• Step 3.1: The Admin Shell: Build a responsive navigation frame.
• Step 3.2: The Product Inventory List View: Feed the Product API into the Data Table. Ensure the agent adds conditional visual badges for stock status (e.g., Red badge for Stock < 5 "Low Stock", Green for "In Stock").
• Step 3.3: The Order Queue List View: Build a table displaying Order ID, Customer Name, Date, Total Price, and a colored badge for Fulfillment Status.

Phase 4: Complex Detail Views & Forms (The Interaction Layer)

This is where the UX safety features are implemented.
Agent Prompt Directive:
"Create the individual detail and editing pages. For forms, use a validation library (like Zod or Formik) to enforce strict type checking. Ensure all destructive buttons (like delete or refund) trigger an explicit confirmation modal before executing."
• Step 4.1: The Variant Form Matrix: Have the agent build a dynamic form array where adding an attribute (like "Size") automatically maps out input fields for prices and SKUs for S, M, and L variants.
• Step 4.2: Fulfillment Actions Panel: On the Order Detail page, provide clear, individual buttons to "Print Packing Slip", "Update Tracking Number", and "Process Refund".

Phase 5: The Analytics Engine & Metrics Dashboard

Finally, tie the data together on the home dashboard screen.
Agent Prompt Directive:
"Create a dashboard home page. Write optimized database aggregation queries to compute total gross revenue, overall order count, average order value (AOV), and a count of items currently below low-stock thresholds over selected time frames (24h, 7d, 30d). Render these metrics into summary cards and a performance chart."
• Step 5.1: KPI Aggregations: Ensure the agent writes clean queries (e.g., using SQL SUM and COUNT filters that exclude soft-deleted or canceled test orders).
• Step 5.2: Chart Integration: Use an open-source charting library (like Recharts or Chart.js) to map out historical sales trends over the past month.

Step-by-Step Execution Plan for You

To get your agent started effectively, execute the work in this order:
[1. Schema Draft] ──> [2. API Endpoints] ──> [3. List Layouts] ──> [4. Forms & Details] ──> [5. Charts]
1. Create a prompts/ folder in your project directory.
2. Copy Phase 1's directive into a file (e.g., prompts/phase1-db.md), fill in your specific database details, and feed it to your agent.
3. Review and test the agent's code output for Phase 1 before pasting the Phase 2 prompt. Testing incrementally avoids multi-file code corruption!
To make these prompts exact for your AI agent, tell me:
• What backend stack are you running (e.g., Next.js App Router, Node/Express, or Laravel)?
• What database are you hooking up to (e.g., PostgreSQL, MongoDB, or MySQL)?






Since you are using Supabase, you have made an excellent choice! It acts as your entire backend database and handling system out of the box, meaning you don't need to choose or build a traditional, complex "backend stack."
Think of Supabase as an incredibly powerful spreadsheet (a PostgreSQL database) that sits securely on the internet. It automatically gives you the login systems and database tables you need. All you have to do is build the visual website (the frontend) that talks to it.
Here is the implementation plan broken down into plain, simple steps that your AI coding agent can follow.

Phase 1: Creating Your Digital Filing Cabinet (The Database)

Before building screens, the AI agent needs to tell Supabase how to organize your store's information.
• What the Agent will do: It will write instructions (called SQL code) to create tables inside Supabase.
• The Tables needed:
	• Products: To store titles, descriptions, and images.
	• Variants: To handle sizes and colors linked to each product, tracking how many of each specific item (like a Medium Red Shirt) you have in stock.
	• Orders: To track who bought what, how much they paid, and if the package has shipped yet.
	• Profiles: To manage customer accounts and team permissions (making sure regular customers can't log into your admin workspace).

Phase 2: Protecting Your Shop (Security Rules)

Because Supabase connects directly to the internet, you must ensure that strangers cannot alter your prices or steal your order data.
• What the Agent will do: Set up Row Level Security (RLS) inside Supabase.
• How it works: Think of RLS as a security guard checking IDs. The agent will write a rule that says: "If a user does not have an 'Admin' badge attached to their account, block them entirely from looking at or changing the Orders or Inventory tables."

Phase 3: Building the Visual Shell & Lists (The Admin Dashboard)

Now, the agent builds the actual web pages you will look at.
• What the Agent will do: Create the layout of your admin panel—like a standard left-side navigation menu with links to "Products," "Orders," and "Dashboard."
• The List Views: The agent will build interactive tables that read data from Supabase. You'll get a clean spreadsheet-style view of your products. If an item’s stock drops below 5, the agent will program it to show a bright red "Low Stock" warning badge next to it.

Phase 4: Editing and Double-Checking (Forms & Safety Blocks)

This is where you actually manage your store—adding items, changing prices, and processing shipments.
• What the Agent will do: Create input forms for adding new items.
• The Safety Blocks: Humans make mistakes. The agent will add pop-up boxes that say "Are you sure you want to delete this product?" or "Are you sure you want to issue a $100 refund?" before anything actually happens in Supabase.

Phase 5: The Overview Screen (Your Sales Graph)

The very first page you see when you log in should tell you exactly how your business is doing.
• What the Agent will do: Write calculations that ask Supabase to add up all your sales.
• What you see: A clean homepage featuring key numbers like Total Money Earned, Number of Orders, and a visual line chart tracking your monthly growth.

How to Start (Your First Prompt to the AI Agent)

Open your AI coding tool and paste this exact message to kick off Phase 1:
"I am building a custom e-commerce admin panel. We are using Supabase as our backend database. Act as a database expert and write the SQL script to create our initial tables in Supabase. I need a 'products' table, a 'product_variants' table (for tracking price and stock by size/color), a 'profiles' table for user roles, and an 'orders' table. Include a 'deleted_at' timestamp column on products so we can archive them instead of permanently erasing them."
Once the agent gives you that SQL code, you can paste it straight into the SQL Editor tab inside your Supabase dashboard to instantly build your backend.
To help your AI agent build the visual interface next, tell me:
• Do you know what tool you are using to build the visual website pages? (Popular options include Next.js, React, or simple HTML/Tailwind).
• Are you selling physical products that you need to pack and ship, or digital downloads?
