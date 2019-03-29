'use strict';

const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(express.static('./public/dist'));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server listening port ${port}`);
});
