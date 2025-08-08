// health-check.js - Script de verificación de salud para el frontend Next.js
const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3000,
  path: '/',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    console.log('Frontend health check passed');
    process.exit(0);
  } else {
    console.log(`Frontend health check failed with status: ${res.statusCode}`);
    process.exit(1);
  }
});

req.on('timeout', () => {
  console.log('Frontend health check timeout');
  req.destroy();
  process.exit(1);
});

req.on('error', (err) => {
  console.log(`Frontend health check error: ${err.message}`);
  process.exit(1);
});

req.end();
