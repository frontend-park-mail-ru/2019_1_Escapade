'use strict';

const express = require('express');
const body = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const app = express();


app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(body.json());


const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`Server listening port ${port}`);
});
