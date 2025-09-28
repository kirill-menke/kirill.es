const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'prod' 
  ? '.env.prod' 
  : '.env.dev';

dotenv.config({ path: envFile });

module.exports = {
  apps: [{
    name: 'sveltekit-app',
    script: 'build/index.js',
    env: {
      ...process.env,
      NODE_ENV: 'development'
    },
    env_production: {
      ...process.env,
      NODE_ENV: 'production'
    }
  }]
};
