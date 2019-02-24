const express = require('express')
const app = express()

const path = require('path');

app.use(express.static('./static'))

app.get("/", function(req, res) {
    console.log("catch /")
    res.sendFile(path.join(__dirname, '../static', 'index.html'));
 });

 app.get("*", function(req, res) {
    console.log("catch *")
    res.write('<h1><marquee direction=left>Error 404!</marquee></h1>')
    res.write('<h2>Go to <a href="/">/</a></h2>')
    res.end()
 });

 
 app.use('/', express.static(public));

module.exports = app

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`We take that port: ${port}`);
});