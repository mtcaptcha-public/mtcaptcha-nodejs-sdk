const express = require('express');
const bodyParser = require('body-parser');
const indexFile = require('./controller/index');
const app = express();
const port = 6822;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/validate-token', indexFile.demoValidateToken);

app.listen(port, () => console.log(`Demo app listening on port ${port}!`))