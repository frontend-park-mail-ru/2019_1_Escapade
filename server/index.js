// index.js
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const app = express()

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}))


app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, '../views'))


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html')

app.use(express.static('./static'))

app.get('/menu', (request, response) => {
    response.render('html/menu.html')
})

app.get('/sign_in', (request, response) => {
    response.render('html/sign_in.html')
})

app.get('/sign_up', (request, response) => {
    response.render('html/sign_up.html')
})

app.get('/', (request, response) => {
    response.render('index.html')//, {
    //    name: 'Друг'
    //})
})
app.listen(3000)
