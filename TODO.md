# QueueEase MVP Todo List 🚀

This todo list outlines the necessary steps to achieve the first release (MVP) of QueueEase, based on the Product Requirements Document and Design specifications.

## 🛠 1. Project Initialization

- [x] Initialize Next.js project with TypeScript and Tailwind CSS.
- [ ] Set up Supabase project (Database + Auth).
- [x] Install necessary dependencies (`@supabase/supabase-js`, `lucide-react`, etc.).
- [x] Configure environment variables (`.env.local`) for Supabase connectivity.

## 🗄 2. Database & Security (Supabase)

- [x] Create `users` table with roles (`business`, `customer`).
- [x] Create `queues` table (id, business_id, name, status, created_at).
- [x] Create `tokens` table (id, queue_id, customer_id, position, status, created_at).
- [x] Set up Database ENUMs:
  - [x] `user_role`: business, customer
  - [x] `queue_status`: active, closed
  - [x] `token_status`: waiting, served, left
- [x] Configure Row Level Security (RLS) policies:
  - [x] Businesses can manage their own queues and tokens.
  - [x] Customers can join queues and view their own token/queue status.

## 🔐 3. Authentication & RBAC

- [x] Implement Registration/Login flow for Businesses.
- [x] Implement Guest entry logic for Customers (optional login for MVP).
- [x] Handle role assignment upon user signup.

## 🏢 4. Business Dashboard

- [x] Create Dashboard Layout.
- [x] Implement "Create Queue" modal/form.
- [x] Build Live Queue View:
  - [x] List of waiting customers.
  - [x] Actions: "Serve Customer" (updates status to `served`).
  - [x] Actions: "Remove/Left" (updates status to `left`).
- [x] Implement QR Code generation for each queue to share with customers.
- [x] Build Analytics Tab:
  - [x] Total served count.
  - [x] Average wait time calculation.

## 📱 5. Customer Interface

- [x] Build Queue Entry Page (Business name + "Join Queue" button).
- [x] Build Queue Status Page:
  - [x] Display Token Number.
  - [x] Display Current Position (calculated dynamically).
  - [x] Display Estimated Wait Time.
- [x] Implement "Leave Queue" button.

## 🔄 6. Real-time Features & Notifications

- [x] Integrate Supabase Realtime:
  - [x] Dashboard updates automatically when customers join/leave.
  - [x] Customer position updates automatically when someone is served.
- [x] Implement "Turn is Near" Notifications:
  - [x] Trigger notification (Email/Push) when position ≤ 3.

## 🚀 7. Final Polish & Deployment

- [ ] Ensure Mobile-First Responsive Design for all pages.
- [ ] Perform End-to-End testing:
  - [ ] Business creating queue -> Customer joining -> Business serving.
- [ ] Deploy the application to Vercel.
- [ ] Verification of performance (<2s updates) and 99% uptime.
