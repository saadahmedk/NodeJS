const sql = require('mssql');

const config = {
  user: 'sa',
   password: 'T0pAi34c0N0t3h@',
  server: '144.91.80.195', // e.g., 'localhost' or 'your_server_url'
  database: 'Aishcodb',
  options: {
    encrypt: true, // Use this if you're on Windows Azure
    trustServerCertificate: true, // For local development
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => console.log('Database Connection Failed!', err));

 module.exports = {
   poolPromise,
 };




