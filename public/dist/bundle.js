!function(e) {
let t = {}; function a(n) {
if (t[n]) return t[n].exports; let s = t[n] = {i: n, l: !1, exports: {}}; return e[n].call(s.exports, s, s.exports, a), s.l = !0, s.exports;
} a.m = e, a.c = t, a.d = function(e, t, n) {
a.o(e, t) || Object.defineProperty(e, t, {enumerable: !0, get: n});
}, a.r = function(e) {
'undefined' != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {value: 'Module'}), Object.defineProperty(e, '__esModule', {value: !0});
}, a.t = function(e, t) {
if (1 & t && (e = a(e)), 8 & t) return e; if (4 & t && 'object' == typeof e && e && e.__esModule) return e; let n = Object.create(null); if (a.r(n), Object.defineProperty(n, 'default', {enumerable: !0, value: e}), 2 & t && 'string' != typeof e) for (let s in e) a.d(n, s, function(t) {
return e[t];
}.bind(null, s)); return n;
}, a.n = function(e) {
let t = e && e.__esModule ? function() {
return e.default;
} : function() {
return e;
}; return a.d(t, 'a', t), t;
}, a.o = function(e, t) {
return Object.prototype.hasOwnProperty.call(e, t);
}, a.p = '', a(a.s = 10);
}([function(e, t, a) {
'use strict'; let n = Object.prototype.hasOwnProperty; function s(e, t) {
return Array.isArray(e) ? function(e, t) {
for (var a, n = '', i = '', r = Array.isArray(t), o = 0; o < e.length; o++)(a = s(e[o])) && (r && t[o] && (a = l(a)), n = n + i + a, i = ' '); return n;
}(e, t) : e && 'object' == typeof e ? function(e) {
let t = ''; var a = ''; for (let s in e) s && e[s] && n.call(e, s) && (t = t + a + s, a = ' '); return t;
}(e) : e || '';
} function i(e) {
if (!e) return ''; if ('object' == typeof e) {
let t = ''; for (let a in e) n.call(e, a) && (t = t + a + ':' + e[a] + ';'); return t;
} return e + '';
} function r(e, t, a, n) {
return !1 !== t && null != t && (t || 'class' !== e && 'style' !== e) ? !0 === t ? ' ' + (n ? e : e + '="' + e + '"') : ('function' == typeof t.toJSON && (t = t.toJSON()), 'string' == typeof t || (t = JSON.stringify(t), a || -1 === t.indexOf('"')) ? (a && (t = l(t)), ' ' + e + '="' + t + '"') : ' ' + e + '=\'' + t.replace(/'/g, '&#39;') + '\'') : '';
} t.merge = function e(t, a) {
if (1 === arguments.length) {
for (var n = t[0], s = 1; s < t.length; s++)n = e(n, t[s]); return n;
} for (let r in a) if ('class' === r) {
var o = t[r] || []; t[r] = (Array.isArray(o) ? o : [o]).concat(a[r] || []);
} else if ('style' === r) {
var o = i(t[r]); o = o && ';' !== o[o.length - 1] ? o + ';' : o; let l = i(a[r]); l = l && ';' !== l[l.length - 1] ? l + ';' : l, t[r] = o + l;
} else t[r] = a[r]; return t;
}, t.classes = s, t.style = i, t.attr = r, t.attrs = function(e, t) {
let a = ''; for (let o in e) if (n.call(e, o)) {
let l = e[o]; if ('class' === o) {
l = s(l), a = r(o, l, !1, t) + a; continue;
} 'style' === o && (l = i(l)), a += r(o, l, !1, t);
} return a;
}; let o = /["&<>]/; function l(e) {
let t = '' + e; var a = o.exec(t); if (!a) return e; let n; var s; var i; var r = ''; for (n = a.index, s = 0; n < t.length; n++) {
switch (t.charCodeAt(n)) {
case 34: i = '&quot;'; break; case 38: i = '&amp;'; break; case 60: i = '&lt;'; break; case 62: i = '&gt;'; break; default: continue;
}s !== n && (r += t.substring(s, n)), s = n + 1, r += i;
} return s !== n ? r + t.substring(s, n) : r;
} t.escape = l, t.rethrow = function e(t, n, s, i) {
if (!(t instanceof Error)) throw t; if (!('undefined' == typeof window && n || i)) throw t.message += ' on line ' + s, t; try {
i = i || a(9).readFileSync(n, 'utf8');
} catch (a) {
e(t, null, s);
} var r = 3; var o = i.split("\n"); var l = Math.max(s - r, 0); var d = Math.min(o.length, s + r); var r = o.slice(l, d).map(function(e, t) {
let a = t + l + 1; return (a == s ? '  > ' : '    ') + a + '| ' + e;
}).join('\n'); t.path = n; t.message = (n || 'Pug') + ':' + s + '\n' + r + '\n\n' + t.message; throw t;
};
}, , function(e, t, a) {
a(0); e.exports = function(e) {
let t = ''; return t += '<section data-section-name="leaderboard"><h1 class="leaderboard__header">Таблица лидеров</h1><br><div class="leaderboard"><div class="leaderboard__wrapper"></div><div class="leaderboard__controls"><img class="arrow arrow__inactive" src="../../img/arrow-left.png"><img class="arrow" src="../../img/arrow-right.png"></div><a class="back" data-href="menu" href="menu">Назад в меню</a></div></section>';
};
}, function(e, t, a) {
let n = a(0); e.exports = function(e) {
let t; var a = ""; var s = e || {}; return function(e) {
a += '<table><thead><tr><th>User</th><th>Best Score</th><th>Best Time</th></tr></thead><tbody></tbody>'; for (let s = 0; s < e.length; s++)a = a + '<tr><td>' + n.escape(null == (t = e[s].name) ? '' : t) + '</td><td>' + n.escape(null == (t = e[s].bestScore.String || 0) ? '' : t) + '</td><td>' + n.escape(null == (t = e[s].bestTime.String || 0) ? '' : t) + '</td></tr>'; a += '</table>';
}.call(this, 'data' in s ? s.data : 'undefined' != typeof data ? data : void 0), a;
};
}, function(e, t, a) {
a(0); e.exports = function(e) {
let t = ''; var a = e || {}; return function(e) {
t += '<header class="menu-header" id="header"><h1>Logic game</h1><nav>', null === e.name ? t += '<a class="menu-button" href="sign_in" data-href="sign_in">Sign In</a><a class="menu-button" href="sign_up" data-href="sign_up">Sign Up</a>' : t += '<a class="menu-button" href="profile" data-href="profile">Profile</a><a class="menu-button" href="sign_out" data-href="sign_out">Sign Out</a>', t += '</nav></header><section data-section-name="menu"><div class="menu-wrapper" id="main"><div class="menu-wrapper__menu" id="menu"><a class="menu__link" href="sign_in" data-href="sign_in">Играть вдвоем</a><a class="menu__link" href="sign_up" data-href="sign_up">Играть одному</a><a class="menu__link" href="leaders" data-href="leaders">Таблица лидеров</a><a class="menu__link" href="about" data-href="about">О нас</a></div></div></section>';
}.call(this, 'data' in a ? a.data : 'undefined' != typeof data ? data : void 0), t;
};
}, function(e, t, a) {
a(0); e.exports = function(e) {
let t = ''; var a = e || {}; return function(e) {
t += '<header class="menu-header" id="header"><h1>Logic game</h1><nav>', null === e.name ? t += '<a class="menu-button" href="sign_in" data-href="sign_in">Sign In</a><a class="menu-button" href="sign_up" data-href="sign_up">Sign Up</a>' : t += '<a class="menu-button" href="profile" data-href="profile">Profile</a><a class="menu-button" href="sign_out" data-href="sign_out">Sign Out</a>', t += '</nav></header><section data-section-name="about"><div class="about"><div class="about__wrapper"><div class="team"><div class="team__name"><a class="team__a" href="https://github.com/dlipko">Дмитрий Липко</a></div><div class="team__role">Лучший ментор</div><div class="team__name"><a class="team__a" href="https://github.com/SmartPhoneJava">Артём Доктор</a></div><div class="team__role">Fullstack</div><div class="team__name"><a class="team__a" href="https://github.com/slevinsps">Иван Спасенов</a></div><div class="team__role">Fullstack</div><div class="team__name"><a class="team__a" href="https://github.com/Bigyin1">Сергей Апарин</a></div><div class="team__role">Fullstack</div></div><a class="back" data-href="menu" href="menu">Назад в меню</a></div></div></section>';
}.call(this, 'data' in a ? a.data : 'undefined' != typeof data ? data : void 0), t;
};
}, function(e, t, a) {
a(0); e.exports = function(e) {
let t = ''; var a = e || {}; return function(e) {
t += '<header class="menu-header" id="header"><h1>Logic game</h1><nav>', null === e.name ? t += '<a class="menu-button" href="sign_in" data-href="sign_in">Sign In</a><a class="menu-button" href="sign_up" data-href="sign_up">Sign Up</a>' : t += '<a class="menu-button" href="profile" data-href="profile">Profile</a><a class="menu-button" href="sign_out" data-href="sign_out">Sign Out</a>', t += '</nav></header><section class="signup"><form class="signup__form" novalidate="novalidate"><input class="input signup__input text-h2" id="email" type="email" name="email" autocomplete="autocomplete" autofocus="true" placeholder="Email"><div class="warning signup__warning hidden js-warning-email"></div><input class="input signup__input text-h2" id="login" type="login" name="login" autocomplete="autocomplete" autofocus="true" placeholder="Login"><div class="warning signup__warning hidden js-warning-login"></div><input class="input signup__input text-h2" id="password" type="password" name="password" autocomplete="autocomplete" placeholder="Password"><div class="warning signup__warning hidden js-warning-password"></div><input class="input signup__input text-h2" id="password-repeat" type="password" name="password-repeat" autocomplete="autocomplete" placeholder="Repeat Password"><div class="warning signup__warning hidden js-warning-repassword"></div><input class="button signup__submit text-h2" type="submit" name="submit" value="Sign up"><div class="signup__footer"><a class="button header-bar__button text-base" data-href="menu" href="menu">Back to Menu</a><div class="text-base">or</div><a class="button header-bar__button text-base" data-href="sign_in" href="sign_in">Sign In</a></div></form></section>';
}.call(this, 'data' in a ? a.data : 'undefined' != typeof data ? data : void 0), t;
};
}, function(e, t, a) {
a(0); e.exports = function(e) {
let t = ''; var a = e || {}; return function(e) {
t += '<header class="menu-header" id="header"><h1>Logic game</h1><nav>', null === e.name ? t += '<a class="menu-button" href="sign_in" data-href="sign_in">Sign In</a><a class="menu-button" href="sign_up" data-href="sign_up">Sign Up</a>' : t += '<a class="menu-button" href="profile" data-href="profile">Profile</a><a class="menu-button" href="sign_out" data-href="sign_out">Sign Out</a>', t += '</nav></header><section class="signup"><form class="signup__form" novalidate="novalidate"><input class="input signup__input text-h2" id="email" type="email" name="email" autofocus="true" placeholder="Email"><div class="warning signup__warning hidden js-warning-email"></div><input class="input signup__input text-h2" id="password" type="password" name="password" autocomplete="autocomplete" placeholder="Password"><div class="warning signup__warning hidden js-warning-password"></div><input class="button signup__submit text-h2" type="submit" name="submit" value="Sign in"><div class="signup__footer"><a class="button header-bar__button text-base" data-href="menu" href="menu">Back to Menu</a><div class="text-base">or</div><a class="button header-bar__button text-base" data-href="sign_up" href="sign_up">Sign Up</a></div></form></section>';
}.call(this, 'data' in a ? a.data : 'undefined' != typeof data ? data : void 0), t;
};
}, function(e, t, a) {
let n = a(0); e.exports = function(e) {
let t; var a = ""; var s = e || {}; return function(e) {
a += '<header class="menu-header" id="header"><h1>Logic game</h1><nav>', null === e.name ? a += '<a class="menu-button" href="sign_in" data-href="sign_in">Sign In</a><a class="menu-button" href="sign_up" data-href="sign_up">Sign Up</a>' : a += '<a class="menu-button" href="profile" data-href="profile">Profile</a><a class="menu-button" href="sign_out" data-href="sign_out">Sign Out</a>', a += '</nav></header><section data-section-name="profile"><div class="profile"> <div class="profile__wrapper"><div class="profile__main"><div class="profile__avatar">', e.avatar, a = a + '</div><div class="profile__info"><form class="signup__form" novalidate="novalidate"><div class="profile__row"><div class="profile__name">Avatar</div><span class="inner" id="output"></span><label class="custom-file-upload button" for="file">Load avatar</label><input id="file" type="file"></div><div class="profile__row"><div class="profile__name">Login</div><input class="input signup__input text-h2" id="login" type="login" name="login"' + n.attr('value', e.name, !0, !0) + '><div class="warning signup__warning hidden js-warning-login"></div></div><div class="profile__row"><div class="profile__name">Email</div><input class="input signup__input text-h2" id="email" type="email" name="email"' + n.attr('value', e.email, !0, !0) + '><div class="warning signup__warning hidden js-warning-email"></div></div><div class="profile__row"><div class="profile__name">Password</div><input class="input signup__input text-h2" id="password" type="password" name="password" placeholder="******" autocomplete="new-password"><div class="warning signup__warning hidden js-warning-password"></div></div><div class="profile__row"><div class="profile__name">Repeat password</div><input class="input signup__input text-h2" id="password-repeat" type="password" name="password-repeat" placeholder="******" autocomplete="new-password"><div class="warning signup__warning hidden js-warning-repassword"></div></div><div class="profile__row"><input class="change__submit button" id="submit_changes" type="submit" name="submit" value="Изменить данные"></div></form><br><hr><br><div class="profile__row"><div class="profile__name">Games Played</div><div class="profile__value">' + n.escape(null == (t = e.played) ? '' : t) + '</div></div><div class="profile__row"><div class="hrefBackToMenu"> <a class="back" data-href="menu" href="menu">Назад в меню</a></div></div></div></div></div></div></section>';
}.call(this, 'data' in s ? s.data : 'undefined' != typeof data ? data : void 0), a;
};
}, function(e, t) { }, function(e, t, a) {
'use strict'; a.r(t); let n = a(2); var s = a.n(n); var i = a(3); var r = a.n(i); class o {
 constructor({el: e = document.body} = {}) {
this.parent = e, this.template = r.a;
} set data(e = []) {
this._data = e;
} render() {
this.parent.innerHTML = this.template({data: this._data});
} 
} const l = 'http://localhost:3000'; class d {
 static post({host: e = l, url: t = '/', body: a = {}} = {}) {
return fetch(e + t, {method: 'POST', body: JSON.stringify(a), mode: 'cors', credentials: 'include', headers: {'Content-Type': 'application/json; charset=utf-8'}});
} static put({host: e = l, url: t = '/', body: a = {}} = {}) {
return fetch(e + t, {method: 'PUT', body: JSON.stringify(a), mode: 'cors', credentials: 'include', headers: {'Content-Type': 'application/json; charset=utf-8'}});
} static postPhoto({host: e = l, url: t = '/', body: a = {}} = {}) {
return fetch(e + t, {method: 'POST', body: a, mode: 'cors', credentials: 'include'});
} static get({host: e = l, url: t = '/'} = {}) {
return fetch(e + t, {method: 'GET', mode: 'cors', credentials: 'include'});
} static delete({host: e = l, url: t = '/'} = {}) {
return fetch(e + t, {method: 'DELETE', mode: 'cors', credentials: 'include'});
} 
} class u {
 constructor({el: e = document.body} = {}) {
this.parent = e, this.template = s.a, this._currPage = 1;
} set data(e = []) {
this._data = e;
} render() {
d.get({url: '/users/pages_amount'}).then((e) => e.json()).then((e) => {
this._pagesCount = e.amount, console.log('Pages amount', e.amount), this.parent.innerHTML = this.template(), this._initButtons(), this.board = new o({el: this.parent.querySelector('.leaderboard__wrapper')}), this._getPage(1).then((e) => {
this.board.data = e, this.board.render();
});
});
} _initButtons() {
[this._leftArrow, this._rightArrow] = this.parent.querySelectorAll('.arrow'), this._leftArrow.addEventListener('click', this._prevPage.bind(this)), this._rightArrow.addEventListener('click', this._nextPage.bind(this)), 1 === this._pagesCount && this._rightArrow.classList.add('arrow__inactive');
} _nextPage() {
this._currPage !== this._pagesCount && (this._getPage(this._currPage + 1).then((e) => {
console.log(e), this.board.data = e, this.board.render();
}), 1 === this._currPage && this._leftArrow.classList.remove('arrow__inactive'), this._currPage += 1, this._currPage === this._pagesCount && this._rightArrow.classList.add('arrow__inactive'));
} _prevPage() {
1 != this._currPage && (this._getPage(this._currPage - 1).then((e) => {
this.board.data = e, this.board.render();
}), this._currPage === this._pagesCount && this._rightArrow.classList.remove('arrow__inactive'), this._currPage -= 1, 1 === this._currPage && this._leftArrow.classList.add('arrow__inactive'));
} _getPage(e) {
return d.get({url: `/users/pages/${e}`}).then((e) => e.json());
} 
} let h = a(4); var c = a.n(h); class p {
 constructor({el: e = document.body} = {}) {
this.parent = e, this.template = c.a;
} set data(e = []) {
this._data = e;
} render() {
this.parent.innerHTML = this.template({data: this._data});
} 
} let _ = a(5); var g = a.n(_); class m {
 constructor({el: e = document.body} = {}) {
this.parent = e, this.template = g.a;
} set data(e = []) {
this._data = e;
} render() {
this.parent.innerHTML = this.template({data: this._data});
} 
} let f = a(6); var v = a.n(f); function w(e) {
return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(String(e).toLowerCase());
} function b(e) {
return /^[A-Za-z]\w{3,14}$/i.test(e);
} const y = new class {
 constructor() {
this.name = null, this.email = null, this.played = null, this.avatar = null;
} setUser({email: e, played: t, avatar: a, name: n} = {}) {
this.email = e || null, this.played = t || 0, this.avatar = a || './img/qrosh.png', this.name = n || null;
} removeUser() {
this.email = null, this.played = null, this.avatar = null, this.name = null;
} 
}; class S {
 constructor({el: e = document.body} = {}) {
this.parent = e, this.template = v.a;
} set data(e = []) {
this._data = e;
} render() {
this.parent.innerHTML = this.template({data: this._data}), this._warnings = {}, this._warnings.email = this.parent.querySelector('.js-warning-email'), this._warnings.login = this.parent.querySelector('.js-warning-login'), this._warnings.pass = this.parent.querySelector('.js-warning-password'), this._warnings.repass = this.parent.querySelector('.js-warning-repassword'), this._form = this.parent.querySelector('.profile__form'), this._submitButton = this.parent.querySelector('.signup__submit'), this._submitButton.addEventListener('click', this._onSubmit.bind(this));
} _onSubmit(e) {
console.log('event'), e.preventDefault(); const t = {}; t.email = this._form.elements.email.value, t.name = this._form.elements.login.value, t.password = this._form.elements.password.value, t.repass = this._form.elements['password-repeat'].value, this._validateInput(t) && (console.log(t), this._auth(t));
} _validateInput({email: e, name: t, password: a, repass: n}) {
let s = !0; if (this._hideWarning(this._warnings.email), !0 !== w(e)) {
let t = 'Invalid email format'; 0 === e.length && (t = 'Fill email field please'), this._showWarning(this._warnings.email, t), s = !1;
} if (this._hideWarning(this._warnings.login), !0 !== b(t)) {
let e = 'Invalid login format. Login must be at least 3 letters'; 0 === t.length && (e = 'Fill login field please'), this._showWarning(this._warnings.login, e), s = !1;
} if (this._hideWarning(this._warnings.pass), !0 !== b(a)) {
let e = 'Invalid password format.\n       Password must be at least 3 letters'; 0 === a.length && (e = 'Fill password field please'), this._showWarning(this._warnings.pass, e), s = !1;
} if (this._hideWarning(this._warnings.repass), n !== a) {
let e = 'Passwords dont match'; 0 === n.length && (e = 'Repeat password please'), this._showWarning(this._warnings.repass, e), s = !1;
} return s;
} _showWarning(e, t) {
e.classList.remove('hidden'), e.innerHTML = '', e.innerHTML += t;
} _hideWarning(e) {
e.classList.add('hidden'), e.innerHTML = '';
} _auth(e) {
console.log(e), d.post({url: '/user', body: e}).then((t) => {
if (201 !== t.status) return t.json(); y.setUser({...e}), I();
}).then((e) => {
this._showWarning(this._warnings.email, e.message);
}).catch((e) => {
console.log('SignUp failed', e);
});
} 
} let L = a(7); var P = a.n(L); class j {
 constructor({el: e = document.body} = {}) {
this.parent = e, this.template = P.a;
} set data(e = []) {
this._data = e;
} render() {
this.parent.innerHTML = this.template({data: this._data}), this._warnings = {}, this._warnings.email = this.parent.querySelector('.js-warning-email'), this._warnings.pass = this.parent.querySelector('.js-warning-password'), this._form = this.parent.querySelector('.signup__form'), this._submitButton = this.parent.querySelector('.signup__submit'), this._submitButton.addEventListener('click', this._onSubmit.bind(this));
} _onSubmit(e) {
e.preventDefault(); const t = {}; t.email = this._form.elements.email.value, t.password = this._form.elements.password.value, this._validateInput(t) && this._login(t);
} _validateInput({email: e, password: t}) {
let a = !0; if (this._hideWarning(this._warnings.email), !0 !== w(e)) {
let t = 'Invalid email format'; 0 === e.length && (t = 'Fill email field please'), this._showWarning(this._warnings.email, t), a = !1;
} if (this._hideWarning(this._warnings.pass), !0 !== b(t)) {
let e = 'Invalid password format'; 0 === t.length && (e = 'Fill password field please'), this._showWarning(this._warnings.pass, e), a = !1;
} return a;
} _showWarning(e, t) {
e.classList.remove('hidden'), e.innerHTML = '', e.innerHTML += t;
} _hideWarning(e) {
e.classList.add('hidden'), e.innerHTML = '';
} _login(e) {
d.post({url: '/user/login', body: e}).then((e) => {
200 === e.status ? e.json().then((e) => {
y.setUser({...e}), I();
}) : e.json().then((e) => {
this._showWarning(this._warnings.email, e.message);
});
}).catch((e) => {
console.log('SignIn failed', e);
});
} 
} let x = a(8); var W = a.n(x); class T {
 constructor({el: e = document.body} = {}) {
this._el = e, this.template = W.a;
} set data(e = []) {
this._data = e;
} render() {
this._el.innerHTML = this.template({data: this._data}), this._getAvatar(), this._form = this._el.querySelector('.signup__form'), this._warnings = {}, this._warnings.email = this._el.querySelector('.js-warning-email'), this._warnings.login = this._el.querySelector('.js-warning-login'), this._warnings.pass = this._el.querySelector('.js-warning-password'), this._warnings.repass = this._el.querySelector('.js-warning-repassword'), this._changeButton = this._el.querySelector('.change__submit'), this._changeButton.addEventListener('click', this._onSubmitDataProfile.bind(this)), document.getElementById('file').addEventListener('change', this._handleFileSelect.bind(this), !1);
} _onSubmitDataProfile(e) {
e.preventDefault(), console.log('event _onSubmitDataProfile'); const t = {}; t.email = this._form.elements.email.value, t.name = this._form.elements.login.value, t.password = this._form.elements.password.value, t.repass = this._form.elements['password-repeat'].value, console.log(this._data), this._validateInput(t) && (console.log(' hello56 ' + t.email, ' ', t.name, ' ', t.password, ' ', t.repass), this._changeProfile(t));
} _validateInput(e) {
let t = !0; if (this._hideWarning(this._warnings.email), this._hideWarning(this._warnings.login), this._hideWarning(this._warnings.pass), this._hideWarning(this._warnings.repass), e.email != this._data.email && !0 !== w(e.email)) {
let a = 'Invalid email format'; 0 === e.email.length && (a = 'Fill email field please'), this._showWarning(this._warnings.email, a), t = !1;
} if (e.name != this._data.name && (this._hideWarning(this._warnings.login), !0 !== b(e.name))) {
let a = 'Invalid login format'; 0 === e.name.length && (a = 'Fill login field please'), this._showWarning(this._warnings.login, a), t = !1;
} if ('' != e.password) {
if (this._hideWarning(this._warnings.pass), !0 !== b(e.password)) {
let a = 'Invalid password format'; 0 === e.password.length && (a = 'Fill password field please'), this._showWarning(this._warnings.pass, a), t = !1;
} if (this._hideWarning(this._warnings.repass), e.repass !== e.password) {
let a = 'Passwords dont match'; 0 === e.repass.length && (a = 'Repeat password please'), this._showWarning(this._warnings.repass, a), t = !1;
}
} return t;
} _showWarning(e, t) {
e.classList.remove('hidden'), e.innerHTML = '', e.innerHTML += t;
} _hideWarning(e) {
e.classList.add('hidden'), e.innerHTML = '';
} _uploadAvatar(e) {
const t = new FormData; t.append('file', e), console.log('upload photo'), d.postPhoto({url: '/user/Avatar', body: t}).then((e) => {
201 === e.status ? e.json().then((e) => {
console.log('Okey photo');
}) : e.json().then((e) => {
this._showWarning(this._warnings.email, e.error);
});
});
} _handleFileSelect(e, t = 250, a = 250) {
const n = e.target.files[0]; if (!n.type.match('image.*')) return void alert('Image only please....'); this._uploadAvatar(n); const s = new FileReader; s.onload = ((e) => (function(n) {
document.getElementById('output').innerHTML = ['<img class="thumb" title="', escape(e.name), '" src="', n.target.result, '" width="' + a + '" height="' + t + '"  />'].join('');
}))(n), s.readAsDataURL(n);
} _getAvatar(e = 250, t = 250) {
d.get({url: '/user/Avatar'}).then((a) => {
if (console.log(a.status), 200 === a.status) {
return console.log('_getAvatar1121212'), a.blob();
} console.log('Heeeelpppp2323'), document.getElementById('output').innerHTML = ['<img class="thumb" ', '" src="./img/qrosh.png" width="' + e + '" height="' + t + '"  />'].join(''), a.json().then((e) => {
this._showWarning(this._warnings.email, e.error);
});
}).then((e) => {
const t = URL.createObjectURL(e); console.log('_getAvatar112' + t), document.getElementById('output').innerHTML = ['<img class="thumb" ', '" src="', t + '"  />'].join('');
});
} _changeProfile(e) {
console.log(e), d.put({url: '/user', body: e}).then((t) => {
if (console.log(t.status), 200 !== t.status) return t.json(); e.password = '', e.repassword = '', y.setUser({...e}), I();
}).then((e) => {
this._showWarning(this._warnings.email, e.message);
});
} 
} a.d(t, 'createProfile', function() {
return I;
}); const A = document.getElementById('application'); function M() {
const e = new p({el: A}); e.data = y, e.render();
} function I() {
const e = new T({el: A}); e.data = y, e.render();
} const k = {menu: M, sign_in: function() {
const e = new j({el: A}); e.data = y, e.render();
}, sign_up: function() {
const e = new S({el: A}); e.data = y, e.render();
}, leaders: function() {
new u({el: A}).render();
}, about: function() {
const e = new m({el: A}); e.data = y, e.render();
}, profile: I, sign_out: function() {
d.delete({url: '/user/logout'}).then((e) => {
if (200 === e.status) {
y.removeUser(); const e = new p({el: A}); e.data = y, e.render();
}
});
}}; let O; O = M, d.get({url: '/user'}).then((e) => {
200 === e.status ? e.json().then((e) => {
y.setUser({...e}), O();
}) : (console.log('No Auth'), y.removeUser(), O());
}).catch((e) => {
console.log(e);
}), A.addEventListener('click', function(e) {
if (!(e.target instanceof HTMLAnchorElement) || e.target.classList.contains('team__a')) return; e.preventDefault(); const t = e.target; console.log({href: t.href, dataHref: t.dataset.href}), A.innerHTML = '', k[t.dataset.href]();
});
}]);
