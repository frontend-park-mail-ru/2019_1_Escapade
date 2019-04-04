const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const uuid = require('uuid/v4');
const path = require('path');
const app = express();


app.use(morgan('dev'));
app.use(body.json());
app.use(cookie());
app.use(express.static('./static'));

const users = {
  'billy@mail.ru': {
    email: 'billy@mail.ru',
    password: 'password',
    score: 75,
  },
  'anna@mail.ru': {
    email: 'anna@mail.ru',
    password: 'password',
    score: 66,
  }
};
const ids = {};
app.get('/', function (req, res) {
  console.log('catch /');
  res.sendFile(path.join(__dirname, '../static', 'index.html'));
});

app.post('/signup', function (req, res) {
  const password = req.body.password;
  const email = req.body.email;
  const age = req.body.age;
  if (
    !password || !email ||
    !password.match(/^\S{4,}$/) ||
    !email.match(/@/)
  ) {
    return res.status(400).json({ error: 'Не валидные данные пользователя' });
  }
  if (users[email]) {
    return res.status(400).json({ error: 'Пользователь уже существует' });
  }

  const id = uuid();
  const user = { password, email, score: 0 };
  ids[id] = email;
  users[email] = user;

  res.cookie('sessionid', id, { expires: new Date(Date.now() + 1000 * 60 * 10) });
  res.status(201).json({ id });
});

app.post('/login', function (req, res) {
  const password = req.body.password;
  const email = req.body.email;
  if (!password || !email) {
    return res.status(400).json({ error: 'Не указан E-Mail или пароль' });
  }
  if (!users[email] || users[email].password !== password) {
    return res.status(400).json({ error: 'Не верный E-Mail и/или пароль' });
  }

  const id = uuid();
  ids[id] = email;

  res.cookie('sessionid', id, { expires: new Date(Date.now() + 1000 * 60 * 10) });
  res.status(200).json({ id });
});

app.get('/me', function (req, res) {
  const id = req.cookies['sessionid'];
  const email = ids[id];
  if (!email || !users[email]) {
    return res.status(401).end();
  }

  users[email].score += 1;

  res.json(users[email]);
  res.end();
});

app.get('/users', function (req, res) {
  const scorelist = Object.values(users)
    .sort((l, r) => r.score - l.score)
    .map(user => {
      return {
        email: user.email,
        score: user.score,
      }
    });

  res.json(scorelist);
});

app.get('*', function (req, res) {
  console.log('catch *');
  res.write('<h1><marquee direction=left>Error 404!</marquee></h1>');
  res.write('<h2>Go to <a href="/">/</a></h2>');
  res.end();
});

const users = {
  'a.ostapenko@corp.mail.ru': {
    email: '<strong>a.ostapenko@corp.mail.ru</strong>',
    password: 'password',
    score: 72,
  },
  'd.dorofeev@corp.mail.ru': {
    email: '<img src="kek" onerror="console.log(`im watching you`);" />',
    password: 'password',
    score: 100500,
  },
  's.volodin@corp.mail.ru': {
    email: '<iframe src="//example.com" onload="alert(1)">',
    password: 'password',
    score: 72,
  },
  'a.tyuldyukov@corp.mail.ru': {
    email: 'a.tyuldyukov@corp.mail.ru',
    password: 'password',
    score: 72,
  },
};
const ids = {};

module.exports = app;

const id = uuid();
const user = { username, password, email, played: 0 };
ids[id] = email;
users[email] = user;

app.listen(port, () => {
  console.log(`We take that port: ${port}`);
});
