const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

function loadEnvFile(filename) {
  const filepath = path.resolve(__dirname, filename);
  try {
    const content = fs.readFileSync(filepath);
    return dotenv.parse(content); // returns an object of key: value strings
  } catch (err) {
    // missing file -> return empty object
    return {};
  }
}

const prodEnv = loadEnvFile('.env.prod');
const devEnv = loadEnvFile('.env.dev');

module.exports = {
  apps: [
    {
      name: 'kirill.es',
      script: 'build/index.js',
      env: prodEnv,
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 5000,
      error_file: './logs/pm2-kirill.es-error.log',
      out_file: './logs/pm2-kirill.es-out.log',
      combine_logs: true
    },

    {
      name: 'dev.kirill.es',
      script: 'build/index.js',
      env: devEnv,
      autorestart: true,
      watch: true,
      max_restarts: 10,
      restart_delay: 3000,
      error_file: './logs/pm2-dev.kirill.es-error.log',
      out_file: './logs/pm2-dev.kirill.es-out.log',
      combine_logs: true
    }
  ]
};

