# Inventory Management System

A comprehensive inventory management system built with the MERN stack (MongoDB, Express, React, Node.js) that helps businesses track inventory, manage sales, and optimize their operations.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Application Flow](#application-flow)
- [Frontend Pages](#frontend-pages)
- [Backend Endpoints](#backend-endpoints)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)

## Features

- **User Authentication**: Secure login, registration, and guest access
- **Forgot Password**: Password recovery functionality
- **Dashboard**: Real-time data visualization with charts and metrics
- **Inventory Management**: Add, edit, delete, and search products
- **Purchase Management**: Track purchases and suppliers
- **Sales Tracking**: Record and analyze sales data
- **Store Management**: Manage multiple store locations
- **Profile Management**: Update user profile and settings
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Notifications**: Get alerts for low stock, new products, etc.

## Tech Stack

### Frontend
- **React**: UI library for building the user interface
- **React Router**: For navigation and routing
- **Tailwind CSS**: For styling and responsive design
- **Chart.js & React-ApexCharts**: For data visualization
- **React-Toastify**: For notifications
- **Context API**: For state management

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Bcrypt**: For password hashing
- **JSON Web Tokens (JWT)**: For authentication
- **Express Rate Limit**: For API rate limiting

## Application Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Home Page     │────▶│  Authentication │────▶│    Dashboard    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│     Profile     │◀────│  Store Manager  │◀────│    Inventory    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │                 │     │                 │
                        │      Sales      │◀────│    Purchases    │
                        │                 │     │                 │
                        └─────────────────┘     └─────────────────┘
```

1. **User Authentication Flow**:
   - User visits the homepage
   - User registers or logs in (or uses guest access)
   - Upon successful authentication, user is redirected to the dashboard

2. **Inventory Management Flow**:
   - User adds new products to inventory
   - User can edit, delete, or search for products
   - Low stock notifications are generated automatically

3. **Purchase Management Flow**:
   - User records new purchases from suppliers
   - Purchase history is maintained
   - Inventory is automatically updated

4. **Sales Management Flow**:
   - User records new sales
   - Sales analytics are updated
   - Inventory is automatically adjusted

5. **Store Management Flow**:
   - User can add and manage multiple store locations
   - Each store has its own inventory

## Frontend Pages

### Public Pages
- **Home Page (`/`)**: Landing page with features, pricing, testimonials, and about us
- **Login Page (`/login`)**: User authentication
- **Register Page (`/register`)**: New user registration
- **Forgot Password Page (`/forgot-password`)**: Password recovery request
- **Reset Password Page (`/reset-password`)**: Set new password with token

### Protected Pages (require authentication)
- **Dashboard (`/dashboard`)**: Overview with key metrics and charts
- **Inventory (`/dashboard/inventory`)**: Product management
- **Purchase Details (`/dashboard/purchase-details`)**: Supplier purchases
- **Sales (`/dashboard/sales`)**: Sales records and analytics
- **Manage Store (`/dashboard/manage-store`)**: Store location management
- **Profile (`/dashboard/profile`)**: User profile settings

## Backend Endpoints

### Authentication
- **POST `/api/login`**: Authenticate user
- **GET `/api/login`**: Get current user details
- **GET `/api/guest-login`**: Login as guest
- **POST `/api/register`**: Register new user

### User Management
- **GET `/api/user/profile/:userId`**: Get user profile
- **PUT `/api/user/profile/:userId`**: Update user profile
- **PUT `/api/user/profile/:userId/image`**: Update profile image
- **POST `/api/user/forgot-password`**: Generate password reset token
- **POST `/api/user/reset-password`**: Reset password with token
- **GET `/api/user/verify-reset-token/:token`**: Verify reset token validity

### Products
- **POST `/api/product/add`**: Add new product
- **GET `/api/product/get/:userId`**: Get all products
- **GET `/api/product/delete/:id`**: Delete product
- **POST `/api/product/update`**: Update product
- **GET `/api/product/search`**: Search products

### Stores
- **POST `/api/store/add`**: Add new store
- **GET `/api/store/get/:userId`**: Get all stores
- **GET `/api/store/delete/:id`**: Delete store
- **POST `/api/store/update`**: Update store

### Purchases
- **POST `/api/purchase/add`**: Add new purchase
- **GET `/api/purchase/get/:userId`**: Get all purchases
- **GET `/api/purchase/delete/:id`**: Delete purchase
- **POST `/api/purchase/update`**: Update purchase

### Sales
- **POST `/api/sales/add`**: Add new sale
- **GET `/api/sales/get/:userId`**: Get all sales
- **GET `/api/sales/delete/:id`**: Delete sale
- **POST `/api/sales/update`**: Update sale

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the Backend directory:
   ```
   cd Backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Start the server:
   ```
   node server.js
   ```

### Frontend Setup
1. Navigate to the Frontend directory:
   ```
   cd Frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Register a new account or use the guest login
3. Explore the dashboard and various features
4. Add products, record purchases and sales
5. Manage your inventory efficiently

## Pricing Plans

The application offers three pricing tiers:

### Free Plan
- Basic inventory management
- Limited to 100 products
- Single store location
- Basic analytics

### Standard Plan (₹500/month)
- Up to 1,000 products
- Multiple store locations
- Advanced analytics
- Email notifications
- Priority support

### Premium Plan (₹5,000/month)
- Unlimited products
- Unlimited store locations
- Real-time analytics
- API access
- Dedicated support
- Custom branding
- Data export/import

## Screenshots

(Screenshots would be included here)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
