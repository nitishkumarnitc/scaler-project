const redis = require("redis");
const util = require("util");

let redisClient;

// Handle connection events
function redis_connect() {
    console.log("Connecting to Redis...");

    // Create a Redis client and connect to the local Redis instance
     redisClient = redis.createClient({
        host: process.env.REDIS_HOST || '127.0.0.1', // Default to localhost if not set
        port: process.env.REDIS_PORT || 6379          // Default to Redis port if not set
    });
    redisClient.on('connect', () => {
        console.log('Connected to Redis');
    });

    redisClient.on('error', (err) => {
        console.error('Redis error:', err);
    });

    // Promisify the get method for async/await usage
    redisClient.get = util.promisify(redisClient.get).bind(redisClient);
}

redis_connect();

module.exports = redisClient;
