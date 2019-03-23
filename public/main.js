'use strict';

import {LeaderBoardView} from './views/LeaderBoardView/LeaderBoard.js';
import {SignOut} from './views/SignOut/SignOut.js';
import {MainMenuView} from './views/MainMenuView/MainMenu.js';
import {AuthorsView} from './views/AuthorsView/Authors.js';
import {SignUpView} from './views/SignUpView/SignUp.js';
import {SignInView} from './views/SignInView/SignIn.js';
import {ProfileView} from './views/ProfileView/Profile.js';
import {checkAuth} from './utils/user.js';
import Router from './utils/router';

const root = document.getElementById('application');

const router = new Router(root);

router
    .register('/', MainMenuView)
    .register('/sign_in', SignInView)
    .register('/sign_up', SignUpView)
    .register('/leaders', LeaderBoardView)
    .register('/about', AuthorsView)
    .register('/sign_in', SignInView)
    .register('/profile', ProfileView)
    .register('/sign_out', SignOut);

checkAuth(router.start.bind(router));

export default router;
