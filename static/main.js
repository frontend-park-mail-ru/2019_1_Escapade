'use strict';

const application = document.getElementById('application');

function createMenuLink () {
	const menuLink = document.createElement('a');
	menuLink.href = menuLink.dataset.href = 'menu';

	menuLink.textContent = 'Назад в меню';

	return menuLink;
}

function createMenu () {
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
    main.classList.add('wrapper');

    const mainForm = document.createElement('form');
    mainForm.id = 'mainForm';
    mainForm.classList.add('form-signin');

    const mainFormMenu = document.createElement('div');
    mainFormMenu.id = 'mainFormMenu';
    mainFormMenu.classList.add('menu');

    main.appendChild(mainForm);
	mainForm.appendChild(mainFormMenu);

	const titles = {
		sign_in: 'Играть вдвоем',
		sign_up: 'Играть одному',
        leaders: 'Таблица лидеров',
        about: 'О нас'
	};


	Object.entries(titles).forEach( (entry) => {
		const href = entry[ 0 ];
		const title = entry[ 1 ];

		const a = document.createElement('a');
		a.href = href;
		a.dataset.href = href;
		a.textContent = title;
		a.classList.add('menu-button');
        a.classList.add('menu__link');
        
        
  

        const br = document.createElement('br');    


        const svg = document.createElement('svg'); //Get svg element
        const newElement = document.createElement('path'); //Create a path in SVG namespace
        svg.setAttribute("viewBox", "0 0 152.9 43.4"); 
        newElement.setAttribute("d","M151.9,13.6c0,0,3.3-9.5-85-8.3c-97,1.3-58.3,29-58.3,29s9.7,8.1,69.7,8.1c68.3,0,69.3-23.1,69.3-23.1 s1.7-10.5-14.7-18.4"); //Set path data
        

        svg.appendChild(newElement);
		a.appendChild(svg);
		
        mainFormMenu.appendChild(a);
        mainFormMenu.appendChild(br);
	});


	menuSection.appendChild(header);
	menuSection.appendChild(main);

	application.appendChild(menuSection);

}

function createSignIn () {
	const signInSection = document.createElement('section');
	signInSection.dataset.sectionName = 'sign_in';

	const header = document.createElement('h1');
	header.textContent = 'Вход';


	const form = document.createElement('form');

	const inputs = [
		{
			name: 'email',
			type: 'email',
			placeholder: 'Email'
		},
		{
			name: 'password',
			type: 'password',
			placeholder: 'Password'
		},
		{
			name: 'submit',
			type: 'submit'
		}
	];

	inputs.forEach(function (item) {
		const input = document.createElement('input');

		input.name = item.name;
		input.type = item.type;

		input.placeholder = item.placeholder;

		form.appendChild(input);
		form.appendChild(document.createElement('br'));
	});

	signInSection.appendChild(header);
	signInSection.appendChild(form);
	signInSection.appendChild(createMenuLink());

	/*form.addEventListener('submit', function (event) {
		event.preventDefault();

		const email = form.elements[ 'email' ].value;
		const password = form.elements[ 'password' ].value;
	});*/

	application.appendChild(signInSection);
}

function createSignUp () {
	const signUpSection = document.createElement('section');
	signUpSection.dataset.sectionName = 'sign_in';

	const header = document.createElement('h1');
	header.textContent = 'Регистрация';


	const form = document.createElement('form');

	const inputs = [
		{
			name: 'email',
			type: 'email',
			placeholder: 'Email'
		},
		{
			name: 'password',
			type: 'password',
			placeholder: 'Password'
		},
		{
			name: 'password_repeat',
			type: 'password',
			placeholder: 'Repeat Password'
		},
		{
			name: 'submit',
			type: 'submit'
		}
	];

	inputs.forEach(function (item) {
		const input = document.createElement('input');

		input.name = item.name;
		input.type = item.type;

		input.placeholder = item.placeholder;

		form.appendChild(input);
		form.appendChild(document.createElement('br'));
	});

	signUpSection.appendChild(header);
	signUpSection.appendChild(form);
	signUpSection.appendChild(createMenuLink());

	/*form.addEventListener('submit', function (event) {
		event.preventDefault();

		const email = form.elements[ 'email' ].value;
		const password = form.elements[ 'password' ].value;
		const password_repeat = form.elements[ 'password_repeat' ].value;

		if (password !== password_repeat) {
			alert('Passwords is not equals');

			return;
		}

	});*/

	application.appendChild(signUpSection);
}

function createLeaderboard () {
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