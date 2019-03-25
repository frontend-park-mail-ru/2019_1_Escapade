'use strict';

import {MainMenuView} from './views/MainMenuView/MainMenu.js';
import {AuthorsView} from './views/AuthorsView/Authors.js';
import {SignUpView} from './views/SignUpView/SignUp.js';
import {ProfileView} from './views/ProfileView/Profile.js';
import signOut from './views/SignOut/SignOut';
import {checkAuth} from './utils/user.js';
import Router from './utils/router';
import bus from './utils/bus.js';
import LeaderBoardMV from './ModelView/LeaderBoardMV';
import SignInMV from './ModelView/SignInMV';

const root = document.getElementById('application');

const router = new Router(root);

router
    .register('/', MainMenuView)
    .register('/sign_in', SignInMV.view)
    .register('/sign_up', SignUpView)
    .register('/leaders', LeaderBoardMV.view)
    .register('/about', AuthorsView)
    .register('/profile', ProfileView);

bus.on('logout', signOut);
checkAuth(router.start.bind(router));

export default router;
