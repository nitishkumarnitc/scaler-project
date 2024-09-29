const { createClient } = require('redis');
require("dotenv").config();
require("colors");

const client = createClient({
    url: `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379}` // Default to localhost if not set
});

// Handle connection errors
client.on('error', (err) => {
    console.error('Redis Client Error:', err.red.bold);
});

// Function to connect to Redis
const redis_connect = async () => {
    try {
        await client.connect();
        console.log("Connected to Redis! ".green.bold);
    } catch (error) {
        console.error(`Failed to connect to Redis: ${error}`.red.bold);
        process.exit(1); // Exit the process on connection error
    }
};

// Export the Redis client and connect function
module.exports = {
    client,
    redis_connect
};

// Call the connect function immediately
redis_connect();
