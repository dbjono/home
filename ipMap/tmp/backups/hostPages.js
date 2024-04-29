const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3031; // Porta configurabile, default 3000
const publicDirectoryPath = path.join(__dirname, './'); // Nome della directory dei file pubblici

app.use(express.static(publicDirectoryPath));

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
