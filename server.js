const express = require('express');
// conectar DB
const connectDB = require('./config/db');
const path = require('path');

const app = express(); // se inicializa el servidor a traves de ua variable

//inicializar conexion
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

/* app.get('/', (req, res) => res.send('API Running')); */

// definir rutas
app.use('/api/users', require('./routes/api/users')); // info users.js
app.use('/api/auth', require('./routes/api/auth')); // info users.js
app.use('/api/profile', require('./routes/api/profile')); // info users.js
app.use('/api/posts', require('./routes/api/posts')); // info users.js

// Server static assets in production
if (process.env.NODE_ENV === 'production') {
  //set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000; // se le asigna un puerto en especifico

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
