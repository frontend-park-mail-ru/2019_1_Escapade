'use strict';

import {LeaderBoardView} from './views/LeaderBoardView/LeaderBoard.js';
import {SignOut} from './views/SignOut/SignOut.js';
import {MainMenuView} from './views/MainMenuView/MainMenu.js';
import {AuthorsView} from './views/AuthorsView/Authors.js';
import {SignUpView} from './views/SignUpView/SignUp.js';
import {SignInView} from './views/SignInView/SignIn.js';
import {ProfileView} from './views/ProfileView/Profile.js';
import {User, checkAuth} from './utils/user.js';

const application = document.getElementById('application');


/** */
function createMenu() {
  const menu = new MainMenuView({
    el: application,
  });
  menu.data = User;
  menu.render();
}


/**
 *
 */
function signOut() {
  const signout = new SignOut();
  signout.signOut(User);
}

/**
 *
 */
function createSignIn() {
  const signin = new SignInView({
    el: application,
  });
  signin.data = User;
  signin.render();
}

/**
 *
 */
function createSignUp() {
  const signup = new SignUpView(application);
  signup.data = User;
  signup.show();
}

/**
 *
 */
function createLeaderboard() {
  const board = new LeaderBoardView({
    el: application,
  });
  board.render();
}

/**
 *
 */
function createAuthors() {
  const authors = new AuthorsView({
    el: application,
  });
  authors.data = User;
  authors.render();
}

/** */
export function createProfile() { // TODO
  const profile = new ProfileView({
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
  sign_out: signOut,
};

checkAuth(createMenu);

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
