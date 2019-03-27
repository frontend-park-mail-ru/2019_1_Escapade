'use strict';

import {MainMenuView} from './views/MainMenuView/MainMenu.js';
import {AuthorsView} from './views/AuthorsView/Authors.js';
import signOut from './views/SignOut/SignOut';
import {checkAuth} from './utils/user.js';
import Router from './utils/router';
import bus from './utils/bus.js';
import LeaderBoardMV from './ModelView/LeaderBoardMV';
import SignInMV from './ModelView/SignInMV';
import SignUpMV from './ModelView/SignUpMV.js';
import ProfileMV from './ModelView/ProfileMV.js';

const root = document.getElementById('application');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
      .register('./dist/sw.js')
      .catch((err) => console.error({err}));
}
const router = new Router(root);

router
    .register('/', MainMenuView)
    .register('/sign_in', SignInMV.view)
    .register('/sign_up', SignUpMV.view)
    .register('/leaders', LeaderBoardMV.view)
    .register('/about', AuthorsView)
    .register('/profile', ProfileMV.view);

bus.on('logout', signOut);
checkAuth(router.start.bind(router));

export default router;
