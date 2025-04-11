<!-- @format -->

# Inventory Management System - Frontend

This is the frontend part of the Inventory Management System, built with React and Tailwind CSS.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages](#pages)
- [Components](#components)
- [Context](#context)
- [Installation](#installation)
- [Usage](#usage)

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

- **React**: UI library for building the user interface
- **React Router**: For navigation and routing
- **Tailwind CSS**: For styling and responsive design
- **Chart.js & React-ApexCharts**: For data visualization
- **React-Toastify**: For notifications
- **Context API**: For state management

## Project Structure

```
src/
├── assets/            # Images, icons, and other static assets
├── components/        # Reusable UI components
├── pages/             # Page components
├── context/           # Context API files
├── App.js             # Main application component
├── index.js           # Entry point
└── index.css          # Global styles
```

## Pages

### Public Pages

- **HomePage.js**: Landing page with features, pricing, testimonials, and about us
- **Login.js**: User authentication
- **Register.js**: New user registration
- **ForgotPassword.js**: Password recovery request
- **ResetPassword.js**: Set new password with token
- **NoPageFound.js**: 404 page

### Protected Pages (require authentication)

- **Dashboard.js**: Overview with key metrics and charts
- **Inventory.js**: Product management
- **PurchaseDetails.js**: Supplier purchases
- **Sales.js**: Sales records and analytics
- **Store.js**: Store location management
- **Profile.js**: User profile settings

## Components

- **Layout.js**: Main layout for authenticated pages
- **Header.js**: Top navigation bar
- **SideMenu.js**: Sidebar navigation
- **HomeNavbar.js**: Navigation for the home page
- **NotificationDropdown.js**: Notification system
- **ProductForm.js**: Form for adding/editing products
- **StoreForm.js**: Form for adding/editing stores
- **PurchaseForm.js**: Form for adding/editing purchases
- **SalesForm.js**: Form for adding/editing sales
- **ProfileForm.js**: Form for updating profile

## Context

- **AuthContext.js**: Authentication state management
- **NotificationContext.js**: Notification state management

## Installation

1. Make sure you have Node.js (v14 or higher) installed
2. Clone the repository
3. Navigate to the Frontend directory:
   ```
   cd Frontend
   ```
4. Install dependencies:
   ```
   npm install
   ```
5. Start the development server:
   ```
   npm start
   ```
6. Open your browser and navigate to `http://localhost:3000`

## Usage

### Authentication

- Register a new account or use the guest login
- Use the forgot password feature if you need to reset your password

### Dashboard

- View key metrics and charts
- See recent activities and notifications

### Inventory Management

- Add new products with details like name, price, quantity, etc.
- Edit or delete existing products
- Search for products by name or category

### Purchase Management

- Record purchases from suppliers
- View purchase history
- Track purchase expenses

### Sales Management

- Record sales transactions
- View sales history and analytics
- Track revenue and profit

### Store Management

- Add and manage multiple store locations
- Assign products to specific stores

### Profile Management

- Update personal information
- Change profile picture
- Update password

## Available Scripts

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.
