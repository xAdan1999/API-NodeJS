const express = require('express')
const cors = require('cors');
const app = express();

//routes
const userRoutes = require('./routes/user.routes');
const passwordRoutes = require('./routes/password.routes');

//cors
app.use(cors())

//settings
app.set('port', process.env.PORT || 3000);

//middlewares
app.use(express.json());

//use routes
app.use('/api/users', userRoutes);
app.use('/api/passwords', passwordRoutes);

module.exports = app;