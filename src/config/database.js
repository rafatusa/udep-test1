const net = require('net');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);

module.exports = {
  connect: async () => {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      const onError = (err) => {
        socket.destroy();
        console.error('Redis connection check failed:', err.message);
        // Log the error but do NOT crash — let the app serve traffic
        resolve();
      };

      socket.setTimeout(3000);
      socket.once('error', onError);
      socket.once('timeout', () => onError(new Error('timeout')));
      socket.connect(REDIS_PORT, REDIS_HOST, () => {
        socket.destroy();
        console.log(`Redis reachable at ${REDIS_HOST}:${REDIS_PORT}`);
        resolve();
      });
    });
  },
};
