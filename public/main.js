'use strict';

import {LeaderBoardComponent} from './views/LeaderBoardView/LeaderBoard.js';
import {SignOutComponent} from './views/SignOut/SignOut.js';
import {MainMenuComponent} from './views/MainMenuView/MainMenu.js';
import {AuthorsComponent} from './views/AuthorsView/Authors.js';
import {SignUpComponent} from './views/SignUpView/SignUp.js';
import {SignInComponent} from './views/SignInView/SignIn.js';
import {ProfileComponent} from './views/ProfileView/Profile.js';
import {User, checkAuth} from './utils/user.js';

const application = document.getElementById('application');


/** */
function createMenu() {
  const menu = new MainMenuComponent({
    el: application,
  });
  menu.data = User;
  menu.render();
}


/**
 *
 */
function signOut() {
  const signout = new SignOutComponent();
  signout.signOut(User);
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
  const board = new LeaderBoardComponent({
    el: application,
  });
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
