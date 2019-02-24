// index.js
/*
const express = require('express')
const app = express()
const path = require('path');

app.use(express.static('./public'))


var cons = require('consolidate');

// view engine setup
app.engine('html', cons.swig)
app.set('views', __dirname + '/..')
app.set('view engine', 'html')


app.get('/menu', (request, response) => {
    response.render('public/html/menu.html')
})

app.get('/sign_in', (request, response) => {
    response.render('public/html/sign_in.html', {}, function (err, html) {
        if (err) {
            console.log(err)
            response.redirect('public/index.html'); // File doesn't exist
        } else {
            response.send(html);
        }
    });
})

app.get('/sign_up', (request, response) => {
    response.render('public/html/sign_up.html')
})

app.get('/', (request, response) => {
    console.log("i try")
    response.render('public/index.html')//, {
    //    name: 'Друг'
    //})
})


app.get("/look", function(req, res) {
    console.log("open1")
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
 });

 app.get("/look1", function(req, res) {
    console.log("open")
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
 });

 app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
 });

console.log("open")
app.listen(3000)
*/
const express = require('express')
const app = express()

const path = require('path');

app.use(express.static('./public'))
app.use(express.static('./static'))


/*

app.get('/sign_in', (request, response) => {
    console.log("catch sign_in")
    response.render('public/html/sign_in.html', {}, function (err, html) {
        if (err) {
            console.log(err)
            response.redirect('public/index.html'); // File doesn't exist
            res.sendFile(path.join(__dirname, '../public/html', 'sign_up.html'));
        } else {
            response.send(html);
            res.sendFile(path.join(__dirname, '../public/html', 'sign_up.html'));
        }
    });
})
*/

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
    res.sendFile(path.join(__dirname, '../', 'public/index.html'));
 });

 app.get("/test2", function(req, res) {
    console.log("catch /2")
    res.sendFile(path.join(__dirname, '../', 'static/index.html'));
 });

app.get("/", function(req, res) {
    console.log("catch /")
    res.sendFile(path.join(__dirname, '../', 'index.html'));
 });

 app.get("*", function(req, res) {
    console.log("catch *")
    res.write('<h1><marquee direction=left>Error 404!</marquee></h1>')
    res.write('<h2>Go to <a href="/">/</a></h2>')
    res.end()
 });

 

module.exports = app

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`We take that port: ${port}`);
});