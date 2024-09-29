const redis = require("redis");
const util = require("util");

let redisClient;

// Handle connection events
async function redis_connect() {
    console.log("Connecting to Redis...");

    try {
        // Create a Redis client
        redisClient = redis.createClient({
            host: process.env.REDIS_HOST || '127.0.0.1', // Default to localhost if not set
            port: process.env.REDIS_PORT || 6379          // Default to Redis port if not set
        });

        // Promisify the get method for async/await usage
        redisClient.get = util.promisify(redisClient.get).bind(redisClient);

        // Await the connection with a promise
        await new Promise((resolve, reject) => {
            redisClient.on('connect', () => {
                console.log('Connected to Redis');
                resolve(redisClient); // Resolve the promise with the Redis client
            });

            redisClient.on('error', (err) => {
                console.error('Redis error:', err);
                reject(err); // Reject the promise on error
            });
        });
        redisClient.get = util.promisify(redisClient.get).bind(redisClient);
    } catch (error) {
        console.error('Failed to create Redis client:', error);
        throw error; // Re-throw the error for further handling
    }
}

redis_connect();

module.exports = redisClient;
