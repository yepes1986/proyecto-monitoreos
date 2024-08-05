const express = require('express');
const path = require('path');
const app = express();
const excelRouter = require('./routes/excel');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', excelRouter);

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
