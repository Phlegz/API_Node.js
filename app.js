const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post('/', (req, res) => {
  req.on('data', (data) => {
    console.log(data.toString('utf8'));
  });
  res.status(204).end();
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
});
