import express from 'express';
const app = express();

async function startServer() {

  // Import/Export can only be used in 'top-level code'. So using good old require.
  await require('./loaders').default(app);

}

startServer();

export default app;
