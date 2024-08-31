const express = require('express')
const app = express()
const dotenv=require('dotenv')
const { sql, poolPromise } = require('./config/connectivity');
const Activity =require('./Model/Activity');
const { body, validationResult } = require('express-validator');
const { expressjwt } = require('express-jwt'); // Import expressjwt correctly

 dotenv.config();
const PORT=process.env.PORT;
app.use(express.json()); // Body parsing middleware





app.use(
  expressjwt({
    secret: "debc79e6-fc03-4e52-a1e7-a5142a5673aa",
    algorithms: ['HS256'],
    credentialsRequired: true,
  }).unless({ path: ['/user/login', '/public'] }) // Exclude /user/login and /public from JWT validation
);

const activityRoute=require('./routes/activity');
app.use('/activity',activityRoute);
const userRoute=require('./routes/user');
app.use('/user',userRoute);


app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid token');
  } else {
    next(err);
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
}) 