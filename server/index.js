
const express = require('express')
const app = express()

const path = require('path');

app.use(express.static('./public'))
app.use(express.static('./static'))
var public = path.join(__dirname, '../public');

app.get('/sign_in', (request, res) => {
    console.log("catch sign_in")
    res.sendFile(path.join(__dirname, '../public/html', 'sign_in.html'));
})

app.get('/sign_up', (request, res) => {
    console.log("catch sign_up")
    res.sendFile(path.join(__dirname, '../public/html', 'sign_up.html'));
})

app.get("/test1", function(req, res) {
    console.log("catch /1")
    res.sendFile(path.join(public, 'index.html'));
 });

 app.get("/test2", function(req, res) {
    console.log("catch /2")
    res.sendFile(path.join(__dirname, '../', 'static/index.html'));
 });

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