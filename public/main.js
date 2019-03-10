'use strict';

import {LeaderBoardComponent} from './components/LeaderBoard/LeaderBoard.js';
import {MainMenuComponent} from './components/MainMenu/MainMenu.js';
import {AuthorsComponent} from './components/Authors/Authors.js';
import {SignUpComponent} from './components/SignUp/SignUp.js';
import {SignInComponent} from './components/SignIn/SignIn.js';
import {ProfileComponent} from './components/Profile/Profile.js';
import {User, checkAuth} from './utils/user.js';
import {Net} from './utils/net.js';

const application = document.getElementById('application');


/**
 * Создать и отрендерить главное меню
*/
function createMenu() {
  const menu = new MainMenuComponent({
    el: application,
  });
  menu.data = User;
  menu.render();
}


/**
 *Выход из аккаунта с последующим редиректом на главное меню
 */
function signOut() {
  Net.delete({url: '/logout'})
      .then((resp) => {
        if (resp.status === 200) {
          User.removeUser();
          const menu = new MainMenuComponent({
            el: application,
          });
          menu.data = User;
          menu.render();
        }
      });
}

/**
 *Создать и отрендерить страницу логина
 */
function createSignIn() {
  const signin = new SignInComponent({
    el: application,
  });
  signin.data = User;
  signin.render();
}

/**
 *Создать и отрендерить страницу регистрации
 */
function createSignUp() {
  const signup = new SignUpComponent({
    el: application,
  });
  signup.data = User;
  signup.render();
}

/**
 *Создать и отрендерить лидерборд
 */
function createLeaderboard() {
  const board = new LeaderBoardComponent({
    el: application,
  });
  board.render();
}

/**
 * Создать и отрендерить страницу авторов
 */
function createAuthors() {
  const authors = new AuthorsComponent({
    el: application,
  });
  authors.data = User;
  authors.render();
}

/**
 * Создать и отрендерить профиль
*/
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
