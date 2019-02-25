'use strict';

const way = "static/"
// Для локалхоста ""
// Для деплоя "static/"

const application = document.getElementById('application');

function createMenuLink () {
	const menuLink = document.createElement('a');
	menuLink.href = menuLink.dataset.href = 'menu';

	menuLink.textContent = 'Назад в меню';

	return menuLink;
}


function createHead(styles){
	document.getElementsByTagName("head")[0].innerHTML = "";
	var meta = document.createElement('meta');
	meta['httpEquiv'] = 'Content-Type';
	meta['content'] = 'text/html; charset=utf-8';
	document.getElementsByTagName('head')[0].appendChild(meta);

	styles.forEach( (style) => {
		const link = document.createElement('link');
		link.id = 'styleLinkMenu';
		link.rel = 'stylesheet';
		link.href = style;
		document.head.appendChild(link);
	});
	

}

function createMenu () {
	
	let styles = [way + "css/menu_style.css"];
	createHead(styles);


	const menuSection = document.createElement('section');
	menuSection.dataset.sectionName = 'menu';

	const header = document.createElement('header');
    header.id = 'header';
	const textHeader = document.createElement('h1');
    textHeader.textContent = 'Logic game';
    const navHeader = document.createElement('nav');

    const titlesHeader = {
		sign_in: 'Войти',
		sign_up: 'Зарегистрироваться',
	};


	Object.entries(titlesHeader).forEach( (entry) => {
		const href = entry[ 0 ];
		const title = entry[ 1 ];

		const a = document.createElement('a');
		a.href = href;
		a.dataset.href = href;
		a.textContent = title;
		a.classList.add('menu-button');

		navHeader.appendChild(a);
	});

    header.appendChild(textHeader);
    header.appendChild(navHeader);


	const main = document.createElement('div');
	main.id = 'main';
	main.classList.add('menu-wrapper');

	const menu = document.createElement('div');
	menu.id = 'menu';
	menu.classList.add('menu-wrapper__menu');


	main.appendChild(menu);

	const titles = {
		sign_in: 'Играть вдвоем',
		sign_up: 'Играть одному',
		leaders: 'Таблица лидеров',
		about: 'О нас'
	};


	Object.entries(titles).forEach((entry) => {
		const href = entry[0];
		const title = entry[1];

		const a = document.createElement('a');
		a.href = href;
		a.dataset.href = href;
		a.textContent = title
		a.classList.add('menu__link');

		const br = document.createElement('br');

		menu.appendChild(a);
		menu.appendChild(br);
	});


	menuSection.appendChild(header);
	menuSection.appendChild(main);

	application.appendChild(menuSection);

}

function createSignIn () {
	let styles = ["https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css", 
	way + "css/sign_in.css"];
	createHead(styles);


	const signInSection = document.createElement('section');
	signInSection.dataset.sectionName = 'sign_in';


	const wrapper = document.createElement("div");
	wrapper.classList.add('wrapper');

	const form = document.createElement('form');
	form.classList.add('form-signin');

	const formHeading = document.createElement('h2');
	formHeading.classList.add('form-signin-heading');
	formHeading.textContent = "Вход";

	// email input
	const inputEmail = document.createElement('input');
	inputEmail.name = 'email';
	inputEmail.type = 'email';
	inputEmail.placeholder = 'email';
	inputEmail.classList.add('form-control');
	


	// password input
	const divPass = document.createElement('div');
	divPass.classList.add('form-group');
	divPass.classList.add('has-feedback');

	const inputPass = document.createElement('input');
	inputPass.name = 'password';
	inputPass.type = 'password';
	inputPass.placeholder = 'Password';
	inputPass.classList.add('form-control');

	const eyePass = document.createElement('i');
	eyePass.classList.add('glyphicon');
	eyePass.classList.add('glyphicon-eye-open');
	eyePass.classList.add('form-control-feedback');

	const divHint = document.createElement('div');
	divHint.textContent = "Введите пароль"
	divHint.classList.add('hint');

	const submit = document.createElement('input');
	submit.name = 'submit';
	submit.type = 'submit';
	submit.textContent = 'Войти';
	submit.classList.add('btn');
	submit.classList.add('btn-lg');
	submit.classList.add('btn-primary');
	submit.classList.add('btn-block');
	submit.classList.add('btn_enter');

	divPass.appendChild(inputPass);
	divPass.appendChild(eyePass);
	divPass.appendChild(divHint);

	form.appendChild(formHeading);
	form.appendChild(inputEmail);
	form.appendChild(divPass);
	form.appendChild(submit);
	form.appendChild(createMenuLink());

	wrapper.appendChild(form);
	signInSection.appendChild(wrapper);
	signInSection.appendChild(createMenuLink());

	/*form.addEventListener('submit', function (event) {
		event.preventDefault();

		const email = form.elements[ 'email' ].value;
		const password = form.elements[ 'password' ].value;
	});*/
	
	application.appendChild(signInSection);
}

function createSignUp () {
	let styles = ["https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css",
	 way + "css/sign_up.css"];
	createHead(styles);


	const signInSection = document.createElement('section');
	signInSection.dataset.sectionName = 'sign_up';


	const wrapper = document.createElement("div");
	wrapper.classList.add('wrapper');

	const form = document.createElement('form');
	form.classList.add('form-signin');

	const formHeading = document.createElement('h2');
	formHeading.classList.add('form-signin-heading');
	formHeading.textContent = "Регистрация";

	// email input
	const inputEmail = document.createElement('input');
	inputEmail.name = 'email';
	inputEmail.type = 'email';
	inputEmail.placeholder = 'email';
	inputEmail.classList.add('form-control');
	

	form.appendChild(formHeading);
	form.appendChild(inputEmail);

	const inputs = [
		{
			name: 'password',
			type: 'password',
			placeholder: 'Пароль'
		},
		{
			name: 'password_repeat',
			type: 'password',
			placeholder: 'Повторите пароль'
		}
	];

	inputs.forEach( (item) => {
		const divPass = document.createElement('div');
		divPass.classList.add('form-group');
		divPass.classList.add('has-feedback');

		const inputPass = document.createElement('input');
		inputPass.name =  item.name;
		inputPass.type = item.type;
		inputPass.placeholder = item.placeholder;
		inputPass.classList.add('form-control');

		const eyePass = document.createElement('i');
		eyePass.classList.add('glyphicon');
		eyePass.classList.add('glyphicon-eye-open');
		eyePass.classList.add('form-control-feedback');

		const divHint = document.createElement('div');
		divHint.textContent = "Введите пароль"
		divHint.classList.add('hint');

		divPass.appendChild(inputPass);
		divPass.appendChild(eyePass);
		divPass.appendChild(divHint);
		form.appendChild(divPass);
	});


	const submit = document.createElement('input');
	submit.name = 'submit';
	submit.type = 'submit';
	submit.textContent = 'Войти';
	submit.classList.add('btn');
	submit.classList.add('btn-lg');
	submit.classList.add('btn-primary');
	submit.classList.add('btn-block');
	submit.classList.add('btn_enter');
	form.appendChild(submit);
	form.appendChild(createMenuLink());

	wrapper.appendChild(form);
	signInSection.appendChild(wrapper);
	signInSection.appendChild(createMenuLink());

	/*form.addEventListener('submit', function (event) {
		event.preventDefault();

		const email = form.elements[ 'email' ].value;
		const password = form.elements[ 'password' ].value;
	});*/

	application.appendChild(signInSection);
}

function createLeaderboard () {
	let styles = ["https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css",
	 way + "css/leaderboard.css"];
	createHead(styles);
	const leaderboardSection = document.createElement('section');
	leaderboardSection.dataset.sectionName = 'leaderboard';

	const header = document.createElement('h1');
	header.textContent = 'Таблица лидеров';

	leaderboardSection.appendChild(header);
	leaderboardSection.appendChild(document.createElement('br'));
    const users = [
		{
			email: 'ivan@mail.ru',
			score: '120000'
		},
		{
			email: 'artem@mail.ru',
			score: '545454'
		},
		{
			email: 'sanya@mail.ru',
			score: '323232'
		},
		{
			email: 'vasya@mail.ru',
			score: '5454'
		}
	];

	if (users) {
		const table = document.createElement('table');
		const thead = document.createElement('thead');
		thead.innerHTML = `
		<tr>
			<th>Email</th>
			<th>Score</th>
		</th>
		`;
		const tbody = document.createElement('tbody');

		table.appendChild(thead);
		table.appendChild(tbody);
		table.border = 1;
		table.cellSpacing = table.cellPadding = 0;

		users.forEach(function (user) {
			const email = user.email;
			const score = user.score;

			const tr = document.createElement('tr');
			const tdEmail = document.createElement('td');
			const tdScore = document.createElement('td');

			tdEmail.textContent = email;
			tdScore.textContent = score;

			tr.appendChild(tdEmail);
			tr.appendChild(tdScore);

			tbody.appendChild(tr);

			leaderboardSection.appendChild(table);
		});
	} 
    leaderboardSection.appendChild(createMenuLink());
	application.appendChild(leaderboardSection);
}

function createAuthors () {
	const signInSection = document.createElement('section');
	signInSection.dataset.sectionName = 'about';

	const header = document.createElement('h1');
	header.textContent = 'О нас';

	const authors = {
		author1: 'Иван',
		author2: 'Артем',
		author3: 'Сергей'
	};

	signInSection.appendChild(header);

	Object.entries(authors).forEach( (entry) => {
		const href = entry[ 0 ];
		const title = entry[ 1 ];

		const a = document.createElement('a');
		a.href = href;
		a.dataset.href = href;
		a.textContent = title;
		a.classList.add('menu-button');

		signInSection.appendChild(a);
	});

	

	signInSection.appendChild(createMenuLink());


	application.appendChild(signInSection);
}

const pages = {
	menu: createMenu,
	sign_in: createSignIn,
	sign_up: createSignUp,
	leaders: createLeaderboard,
	about: createAuthors
};

createMenu();

application.addEventListener('click', function (event) {
	if (!(event.target instanceof HTMLAnchorElement)) {
		return;
	}

	event.preventDefault();
	const link = event.target;

	console.log({
		href: link.href,
		dataHref: link.dataset.href
	});

	application.innerHTML = '';

	pages[ link.dataset.href ]();
});