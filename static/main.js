'use strict';

const application = document.getElementById('application');
/**
 * @return {menu}
 */
function createMenuLink() {
  const menuLink = document.createElement('a');
  menuLink.href = menuLink.dataset.href = 'menu';

  menuLink.textContent = 'Назад в меню';

  return menuLink;
}

/** */
function createMenu() {
  const menuSection = document.createElement('section');
  menuSection.dataset.sectionName = 'menu';

  const header = document.createElement('header');
  header.id = 'header';
  header.classList.add('menu-header');
  const textHeader = document.createElement('h1');
  textHeader.textContent = 'Logic game';
  const navHeader = document.createElement('nav');

  const titlesHeader = {
    sign_in: 'Sign In',
    sign_up: 'Sign Up',
  };

  Object.entries(titlesHeader).forEach((entry) => {
    const href = entry[0];
    const title = entry[1];

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
    about: 'О нас',
  };

  Object.entries(titles).forEach((entry) => {
    const href = entry[0];
    const title = entry[1];

    const a = document.createElement('a');
    a.href = href;
    a.dataset.href = href;
    a.textContent = title;
    a.classList.add('menu__link');

    const br = document.createElement('br');

    menu.appendChild(a);
    menu.appendChild(br);
  });


  menuSection.appendChild(header);
  menuSection.appendChild(main);

  application.appendChild(menuSection);
}

/**
 *
 */
function createSignIn() {
  const signInSection = document.createElement('section');
  signInSection.dataset.sectionName = 'sign_in';

  const header = document.createElement('h1');
  header.textContent = 'Вход';


  const form = document.createElement('form');

  const inputs = [{
    name: 'email',
    type: 'email',
    placeholder: 'Email',
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'Password',
  },
  {
    name: 'submit',
    type: 'submit',
  },
  ];

  inputs.forEach(function(item) {
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

  application.appendChild(signInSection);
}

/**
 *
 */
function createSignUp() {
  const signUpSection = document.createElement('section');
  signUpSection.dataset.sectionName = 'sign_in';

  const header = document.createElement('h1');
  header.textContent = 'Регистрация';


  const form = document.createElement('form');

  const inputs = [{
    name: 'email',
    type: 'email',
    placeholder: 'Email',
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'Password',
  },
  {
    name: 'password_repeat',
    type: 'password',
    placeholder: 'Repeat Password',
  },
  {
    name: 'submit',
    type: 'submit',
  },
  ];


  inputs.forEach(function(item) {
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
  application.appendChild(signUpSection);
}

/**
 *
 */
function createLeaderboard() {
  const leaderboardSection = document.createElement('section');
  leaderboardSection.dataset.sectionName = 'leaderboard';

  const header = document.createElement('h1');
  header.classList.add('leaderboard__header');
  header.textContent = 'Таблица лидеров';

  const wrapper = document.createElement('div');
  wrapper.classList.add('leaderboard');
  const innerWrapper = document.createElement('div');
  innerWrapper.classList.add('leaderboard__wrapper');

  leaderboardSection.appendChild(header);
  leaderboardSection.appendChild(document.createElement('br'));
  leaderboardSection.appendChild(wrapper);
  wrapper.appendChild(innerWrapper);
  const users = [new Map([
    ['num', '1'],
    ['name', 'ser'],
    ['score', '120000'],
    ['games', '99'],
  ]),
  new Map([
    ['num', '2'],
    ['name', 'Dog'],
    ['score', '545454'],
    ['games', '3'],
  ]),
  new Map([
    ['num', '3'],
    ['name', 'Dog'],
    ['score', '545454'],
    ['games', '3'],
  ]),
  new Map([
    ['num', '4'],
    ['name', 'Dog'],
    ['score', '545454'],
    ['games', '3'],
  ]),
  new Map([
    ['num', '5'],
    ['name', 'Dog'],
    ['score', '545454'],
    ['games', '3'],
  ]),
  ];

  const table = document.createElement('table');
  innerWrapper.appendChild(table);
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
        <th></th>
        <th>User</th>
        <th>Score</th>
        <th>Games played</th>
    </tr>
    `;
  const tbody = document.createElement('tbody');

  table.appendChild(thead);
  table.appendChild(tbody);

  users.forEach(function(user, i) {
    const tr = document.createElement('tr');
    user.forEach(function(val) {
      const td = document.createElement('td');
      td.textContent = val;
      tr.appendChild(td);
    });
    const background = i % 2 ? 'white' : '#f2f2f2';
    tr.style.background = background;
    tbody.appendChild(tr);
  });
  innerWrapper.appendChild(createMenuLink());
  application.appendChild(leaderboardSection);
}

/**
 *
 */
function createAuthors() {
  const aboutSection = document.createElement('section');
  aboutSection.dataset.sectionName = 'about';

  const header = document.createElement('h1');
  header.classList.add('about__header');
  header.textContent = 'О нас';

  const wrapper = document.createElement('div');
  wrapper.classList.add('about');
  const innerWrapper = document.createElement('div');
  innerWrapper.classList.add('about__wrapper');

  wrapper.appendChild(innerWrapper);
  aboutSection.appendChild(header);
  aboutSection.appendChild(document.createElement('br'));
  aboutSection.appendChild(wrapper);

  const team = document.createElement('div');
  team.classList.add('team');
  innerWrapper.appendChild(team);

  const members = [{
    name: 'Дмитрий Липко',
    role: 'Лучший ментор',
    github: 'https://github.com/dlipko',
  },
  {
    name: 'Артём Доктор',
    role: 'Fullstack',
    github: 'https://github.com/SmartPhoneJava',
  },
  {
    name: 'Иван Спасенов',
    role: 'Fullstack',
    github: 'https://github.com/slevinsps',
  },
  {
    name: 'Сергей Апарин',
    role: 'Fullstack',
    github: 'https://github.com/Bigyin1',
  },
  ];

  members.forEach((member) => {
    const {
      name,
      role,
      github,
    } = member;

    const n = document.createElement('div');
    n.classList.add('team__name');
    team.appendChild(n);

    const a = document.createElement('a');
    a.classList.add('team__a');
    a.textContent = name;
    a.href = github;
    n.appendChild(a);

    const r = document.createElement('div');
    r.classList.add('team__role');
    r.textContent = role;
    team.appendChild(r);
  });

  innerWrapper.appendChild(createMenuLink());
  application.appendChild(aboutSection);
}

/** */
function createProfile() { // TODO
  const profileSection = document.createElement('section');
  profileSection.dataset.sectionName = 'profile';

  const header = document.createElement('h1');
  header.classList.add('profile__header');
  header.textContent = 'Ваш профиль';

  const wrapper = document.createElement('div');
  wrapper.classList.add('profile');

  const innerWrapper = document.createElement('div');
  innerWrapper.classList.add('profile__wrapper');

  const profile = document.createElement('div');
  profile.classList.add('profile__main');

  const avatarWrapper = document.createElement('div');
  avatarWrapper.classList.add('profile__avatar');

  const avatar = document.createElement('img');
  avatar.classList.add('profile__avatar__img');
  avatar.src = './img/qrosh.png';

  const info = document.createElement('div');
  info.classList.add('profile__info');

  const infoList = [{
    header: 'Name',
    value: 'Cat',
  },
  {
    header: 'Email',
    value: 'cat@js.ru',
  },
  {
    header: 'Password',
    value: '******',
  },
  {
    header: 'Games Played',
    value: 128,
  },
  ];

  infoList.forEach((ent) => {
    const row = document.createElement('div');
    row.classList.add('profile__row');

    const head = document.createElement('div');
    head.classList.add('profile__name');
    head.textContent = ent.header;

    const value = document.createElement('div');
    value.classList.add('profile__value');
    value.textContent = ent.value;

    row.appendChild(head);
    row.appendChild(value);
    info.appendChild(row);
  });

  avatarWrapper.appendChild(avatar);

  profile.appendChild(avatarWrapper);
  profile.appendChild(info);


  innerWrapper.appendChild(profile, createMenuLink());
  innerWrapper.appendChild(createMenuLink());

  wrapper.appendChild(innerWrapper);
  profileSection.appendChild(header);
  profileSection.appendChild(document.createElement('br'));
  profileSection.appendChild(wrapper);

  application.appendChild(profileSection);
}

const pages = {
  menu: createMenu,
  sign_in: createSignIn,
  sign_up: createSignUp,
  leaders: createLeaderboard,
  about: createAuthors,
  profile: createProfile,
};


createMenu();

application.addEventListener('click', function(event) {
  if (!(event.target instanceof HTMLAnchorElement) ||
    event.target.classList.contains('team__a')) {
    return;
  }
  event.preventDefault();
  const link = event.target;

  console.log({
    href: link.href,
    dataHref: link.dataset.href,
  });

  application.innerHTML = '';

  pages[link.dataset.href]();
});
