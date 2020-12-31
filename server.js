const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect to database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

//ROUTES
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening on Port: ${PORT}`));
