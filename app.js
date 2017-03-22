var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.post('/',function(req, res){
  req.on('data', (data) => {
    console.log(data.toString('utf8'));
  });
  res.status(204).end();
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
