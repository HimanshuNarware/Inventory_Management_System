# Inventory Management System - Backend

This is the backend part of the Inventory Management System, built with Node.js, Express, and MongoDB.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Models](#models)
- [Controllers](#controllers)
- [Installation](#installation)
- [Usage](#usage)

## Features

- **User Authentication**: Secure login, registration, and guest access
- **Password Recovery**: Forgot password and reset functionality
- **Rate Limiting**: Protection against brute force attacks
- **Error Handling**: Comprehensive error handling and validation
- **RESTful API**: Well-structured API endpoints
- **MongoDB Integration**: Efficient database operations
- **Security**: Password hashing with bcrypt

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Bcrypt**: For password hashing
- **Crypto**: For generating secure tokens
- **Express Rate Limit**: For API rate limiting
- **CORS**: For cross-origin resource sharing

## Project Structure

```
Backend/
├── controller/         # API controllers
├── models/             # Database models
├── router/             # API routes
├── package.json        # Dependencies and scripts
└── server.js           # Entry point
```

## API Endpoints

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

## Models

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  phoneNumber: Number,
  imageUrl: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}
```

### Product Model
```javascript
{
  userId: String,
  productName: String,
  productCategory: String,
  productQuantity: Number,
  productPrice: Number,
  productDescription: String,
  productImage: String
}
```

### Store Model
```javascript
{
  userId: String,
  storeName: String,
  storeLocation: String,
  storeManager: String,
  storeContact: String
}
```

### Purchase Model
```javascript
{
  userId: String,
  supplierName: String,
  productName: String,
  productQuantity: Number,
  productPrice: Number,
  purchaseDate: Date
}
```

### Sales Model
```javascript
{
  userId: String,
  customerName: String,
  productName: String,
  productQuantity: Number,
  productPrice: Number,
  saleDate: Date
}
```

## Controllers

### User Controller
- `getUserProfile`: Get user profile details
- `updateUserProfile`: Update user profile
- `updateProfileImage`: Update user profile image
- `forgotPassword`: Generate password reset token
- `resetPassword`: Reset password using token
- `verifyResetToken`: Verify reset token validity

### Product Controller
- `addProduct`: Add new product
- `getAllProducts`: Get all products for a user
- `deleteSelectedProduct`: Delete a product
- `updateSelectedProduct`: Update a product
- `searchProduct`: Search for products

### Store Controller
- `addStore`: Add new store
- `getAllStores`: Get all stores for a user
- `deleteSelectedStore`: Delete a store
- `updateSelectedStore`: Update a store

### Purchase Controller
- `addPurchase`: Add new purchase
- `getAllPurchases`: Get all purchases for a user
- `deleteSelectedPurchase`: Delete a purchase
- `updateSelectedPurchase`: Update a purchase

### Sales Controller
- `addSale`: Add new sale
- `getAllSales`: Get all sales for a user
- `deleteSelectedSale`: Delete a sale
- `updateSelectedSale`: Update a sale

## Installation

1. Make sure you have Node.js (v14 or higher) and MongoDB installed
2. Clone the repository
3. Navigate to the Backend directory:
   ```
   cd Backend
   ```
4. Install dependencies:
   ```
   npm install
   ```
5. Start the server:
   ```
   node server.js
   ```
6. The server will run on port 4000 by default

## Usage

### Authentication
- Register a new user with POST `/api/register`
- Login with POST `/api/login`
- Guest login with GET `/api/guest-login`

### Password Recovery
- Request password reset with POST `/api/user/forgot-password`
- Verify token with GET `/api/user/verify-reset-token/:token`
- Reset password with POST `/api/user/reset-password`

### User Management
- Get user profile with GET `/api/user/profile/:userId`
- Update user profile with PUT `/api/user/profile/:userId`
- Update profile image with PUT `/api/user/profile/:userId/image`

### Inventory Management
- Add products with POST `/api/product/add`
- Get products with GET `/api/product/get/:userId`
- Update products with POST `/api/product/update`
- Delete products with GET `/api/product/delete/:id`
- Search products with GET `/api/product/search?searchTerm=term`

### Store Management
- Add stores with POST `/api/store/add`
- Get stores with GET `/api/store/get/:userId`
- Update stores with POST `/api/store/update`
- Delete stores with GET `/api/store/delete/:id`

### Purchase Management
- Add purchases with POST `/api/purchase/add`
- Get purchases with GET `/api/purchase/get/:userId`
- Update purchases with POST `/api/purchase/update`
- Delete purchases with GET `/api/purchase/delete/:id`

### Sales Management
- Add sales with POST `/api/sales/add`
- Get sales with GET `/api/sales/get/:userId`
- Update sales with POST `/api/sales/update`
- Delete sales with GET `/api/sales/delete/:id`
