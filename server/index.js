// index.js
const express = require('express')
const app = express()


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html')

app.use(express.static('./static'))

app.get('/menu', (request, response) => {
    response.render('html/menu.html')
})

app.get('/sign_in', (request, response) => {
    response.render('public/html/sign_in.html')
})

app.get('/sign_up', (request, response) => {
    response.render('public/html/sign_up.html')
})

app.get('/', (request, response) => {
    response.render('index.html')//, {
    //    name: 'Друг'
    //})
})
app.listen(3000)
