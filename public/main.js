'use strict';

import {LeaderBoardComponent} from './components/LeaderBoard/LeaderBoard.js';
import {MainMenuComponent} from './components/MainMenu/MainMenu.js';
import {AuthorsComponent} from './components/Authors/Authors.js';
import {SignUpComponent} from './components/SignUp/SignUp.js';
import {SignInComponent} from './components/SignIn/SignIn.js';
import {ProfileComponent} from './components/Profile/Profile.js';
import {User, checkAuth} from './utils/user.js';

const application = document.getElementById('application');

/** */
function createMenu() {
  checkAuth(
      () => {
        const menu = new MainMenuComponent({
          el: application,
        });
        menu.data = User;
        menu.render();
      });
}

/**
 *
 */
function createSignIn() {
  const signin = new SignInComponent({
    el: application,
  });
  signin.data = User;
  signin.render();
}

/**
 *
 */
function createSignUp() {
  const signup = new SignUpComponent({
    el: application,
  });
  signup.data = User;
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
  authors.data = User;
  authors.render();
}

/** */
export function createProfile() { // TODO
  const profile = new ProfileComponent({
    el: application,
  });
  profile.data = User;
  profile.render();
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
