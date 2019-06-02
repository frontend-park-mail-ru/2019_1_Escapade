const express = require('express');
const morgan = require('morgan');
const fallback = require('express-history-api-fallback');


const app = express();

app.use(morgan('dev'));
app.use(express.static('./public/dist'));

app.use(fallback('./index.html', {root: './public/dist'}));
const port = process.env.PORT || 8080;

app.listen(port, () => {
});

