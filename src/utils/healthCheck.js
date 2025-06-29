const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

/**
 * Health check endpoint handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const healthCheck = async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    env: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  };

  try {
    // Check database connection
    const dbState = mongoose.connection.readyState;
    const dbStatus = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    healthcheck.database = {
      status: dbStatus[dbState] || 'unknown',
      connected: dbState === 1
    };

    // If database is not connected, return 503
    if (dbState !== 1) {
      return res.status(503).json({
        ...healthcheck,
        message: 'Database not connected'
      });
    }

    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = 'ERROR';
    healthcheck.error = error.message;
    res.status(503).json(healthcheck);
  }
};

module.exports = healthCheck;
