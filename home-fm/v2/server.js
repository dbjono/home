const express = require('express');
const fm = require('./fm');
const details = require('./details');

const app = express();
const PORT = 3000;

app.use(express.json());

// Routes
app.use('/fm', fm);
app.use('/details', details);

app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});
