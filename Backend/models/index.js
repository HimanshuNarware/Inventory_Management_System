/** @format */

const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;
function main() {
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    })
    .then(() => {
      console.log('MongoDB connection successful');
    })
    .catch((err) => {
      console.log('MongoDB connection error: ', err);
      // Continue running the application even if MongoDB connection fails
      console.log('Application will run with limited functionality');
    });
}

module.exports = { main };
