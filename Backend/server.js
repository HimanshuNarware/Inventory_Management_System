/** @format */

const express = require('express');
const dotenv = require('dotenv');
dotenv.config({path: './.env'});
const { main } = require('./models/index');
const productRoute = require('./router/product');
const storeRoute = require('./router/store');
const purchaseRoute = require('./router/purchase');
const salesRoute = require('./router/sales');
const userRoute = require('./router/user');
const cors = require('cors');
const User = require('./models/users');
const Product = require('./models/Product');
const rateLimit = require('express-rate-limit');
const morgan=require('morgan');


const app = express();
const PORT = process.env.PORT||4000;
main();
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));


// Error handling for JSON parsing
app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Invalid JSON',
      details: 'The request contains invalid JSON',
    });
  }
  next();
});

// Configure general API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// More strict rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 login/register requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message:
    'Too many login attempts from this IP, please try again after an hour',
});

// Rate limiting for data-intensive operations
const dataLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // Limit each IP to 30 requests per 5 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message:
    'Too many data requests from this IP, please try again after 5 minutes',
});

app.get('/', (req, res) => {
  res.send('Welcome to the Inventory Management System API');
});

// Apply rate limiting to different API routes
app.use('/api/', apiLimiter); // General API rate limiting
app.use('/api/login', authLimiter); // Stricter limits for login
app.use('/api/register', authLimiter); // Stricter limits for registration
app.use('/api/guest-login', authLimiter); // Stricter limits for guest login
app.use('/api/product', dataLimiter); // Limits for product data
app.use('/api/sales', dataLimiter); // Limits for sales data
app.use('/api/purchase', dataLimiter); // Limits for purchase data
app.use('/api/user', dataLimiter); // Limits for user data

// Store API
app.use('/api/store', storeRoute);

// Products API
app.use('/api/product', productRoute);

// Purchase API
app.use('/api/purchase', purchaseRoute);

// Sales API
app.use('/api/sales', salesRoute);

// User API
app.use('/api/user', userRoute);

// ------------- Signin --------------
let userAuthCheck;
app.post('/api/login', async (req, res) => {
  console.log(req.body);
  // res.send("hi");
  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    console.log('USER: ', user);
    if (user) {
      res.send(user);
      userAuthCheck = user;
    } else {
      res.status(401).send('Invalid Credentials');
      userAuthCheck = null;
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// Getting User Details of login user
app.get('/api/login', (_, res) => {
  res.send(userAuthCheck);
});

// Guest Login API
app.get('/api/guest-login', (_, res) => {
  // Create a guest user object with limited permissions
  const guestUser = {
    _id: 'guest-user-id',
    firstName: 'Guest',
    lastName: 'User',
    email: 'guest@example.com',
    isGuest: true, // Flag to identify guest users
  };

  // Set the guest user as the current authenticated user
  userAuthCheck = guestUser;
  res.send(guestUser);
});
// ------------------------------------

// Registration API
app.post('/api/register', (req, res) => {
  let registerUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    imageUrl: req.body.imageUrl,
  });

  registerUser
    .save()
    .then((result) => {
      res.status(200).send(result);
      console.log('Signup Successful');
    })
    .catch((err) => {
      console.log('Signup Error: ', err);
      res
        .status(500)
        .send({ error: 'Registration failed', details: err.message });
    });
  console.log('Registration request: ', req.body);
});

app.get('/testget', async (_, res) => {
  try {
    const result = await Product.findOne({ _id: '6429979b2e5434138eda1564' });
    if (!result) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Here we are listening to the server
// Global error handler middleware
app.use((err, _req, res, next) => {
  console.error('Global error handler caught:', err);

  // Check if headers have already been sent
  if (res.headersSent) {
    return next(err);
  }

  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    const validationErrors = Object.values(err.errors).map(
      (error) => error.message
    );
    return res.status(400).json({
      error: 'Validation Error',
      details: validationErrors,
    });
  }

  // Handle mongoose cast errors (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid data format',
      details: err.message,
    });
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    return res.status(409).json({
      error: 'Duplicate entry',
      details: `The ${Object.keys(err.keyValue)[0]} already exists`,
    });
  }

  // Default error response
  res.status(500).json({
    error: 'Server Error',
    message: err.message || 'An unexpected error occurred',
  });
});

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
