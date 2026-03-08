# Budget Wear Limited - Getting Started

This guide explains how to set up and run the Budget Wear Limited e-commerce platform locally.

## Prerequisites
- **Node.js**: v18 or later
- **PostgreSQL**: Running instance
- **npm**: Package manager (comes with Node.js)

## Backend Setup
1. **Navigate to backend**:
   ```bash
   cd backend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment**:
   Ensure `.env` has your `DATABASE_URL` (PostgreSQL).
4. **Database Initialization**:
   ```bash
   # Generate Prisma client
   npx prisma generate
   # Sync schema and seed database (includes 20+ products, branches, categories)
   npx prisma db push
   npx prisma db seed
   ```
5. **Run the server**:
   ```bash
   npm run dev
   ```
   *Server will start on [http://localhost:5000](http://localhost:5000)*

## Frontend Setup
1. **Navigate to frontend**:
   ```bash
   cd frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
   *Frontend will be available at [http://localhost:3000](http://localhost:3000)*

## Key Admin Credentials
- See `backend/prisma/seed.ts` for seeded users or create a new user via the registration API.

## Features to Explore
- **Live Search**: Use the search bar in the navbar.
- **Admin Dashboard**: Navigate to `/admin` to manage products and branches.
- **Cart & Wishlist**: Interact with products to see animated toast notifications.
- **M-Pesa Checkout**: Complete a purchase and see the STK push simulation.
