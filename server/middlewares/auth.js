const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

// ------------- AUTH MIDDLEWARE (Verifies JWT Token) ----------------
exports.auth = async (req, res, next) => {
  try {
    // Extract token from cookies, body, or headers
    const authHeader = req.headers.authorization;
    const token =
      req.cookies?.token ||
      req.body?.token ||
      (authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null);

    // If token is missing, return a 401 Unauthorized response
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token is missing',
      });
    }

    // Verify the token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message:
          error.name === 'TokenExpiredError'
            ? 'Token has expired'
            : 'Invalid token, please login again',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while validating the token',
    });
  }
};

// ------------- ROLE-BASED ACCESS CONTROL ----------------

const checkRole = (role) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized request, user not found',
        });
      }

      if (req.user.accountType !== role) {
        return res.status(403).json({
          success: false,
          message: `Access denied: This route is only for ${role}s`,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'User role cannot be verified, please try again',
      });
    }
  };
};

// Define role-based middlewares using checkRole function
exports.isStudent = checkRole('Student');
exports.isInstructor = checkRole('Instructor');
exports.isAdmin = checkRole('Admin');
