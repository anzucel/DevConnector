const express = require('express');

const app = express(); // se inicializa el servidor a traves de ua variable

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT  || 5000; // se le asigna un puerto en especifico

app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 