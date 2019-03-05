'use strict';

import {LeaderBoardComponent} from './components/LeaderBoard/LeaderBoard.js';
import {MainMenuComponent} from './components/MainMenu/MainMenu.js';
import {AuthorsComponent} from './components/Authors/Authors.js';
import {SignUpComponent} from './components/SignUp/SignUp.js';
import {SignInComponent} from './components/SignIn/SignIn.js';

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
  const menu = new MainMenuComponent({
    el: application,
  });
  menu.render();
}

/**
 *
 */
function createSignIn() {
  const signin = new SignInComponent({
    el: application,
  });
  signin.render();
}

/**
 *
 */
function createSignUp() {
  const signup = new SignUpComponent({
    el: application,
  });
  signup.render();
}

/**
 *
 */
function createLeaderboard() {
  const users = [{
    'num': '1',
    'name': 'ser',
    'score': '120000',
    'games': '99',
  },
  {
    'num': '2',
    'name': 'cat',
    'score': '23500',
    'games': '99',
  },
  {
    'num': '3',
    'name': 'damian',
    'score': '1200',
    'games': '99',
  },
  {
    'num': '4',
    'name': 'dog',
    'score': '120000',
    'games': '99',
  },
  {
    'num': '5',
    'name': 'pig',
    'score': '15000',
    'games': '99',
  },
  ];

  const board = new LeaderBoardComponent({
    el: application,
  });
  board.data = JSON.parse(JSON.stringify(users));
  board.render();
}

/**
 *
 */
function createAuthors() {
  const authors = new AuthorsComponent({
    el: application,
  });
  authors.render();
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
