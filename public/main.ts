'use strict';

import { MainMenuView } from './views/MainMenuView/MainMenu';
import SinglePlayerView from './views/SinglePlayerView/SinglePlayer';
import { AuthorsView } from './views/AuthorsView/Authors';
import { RulesView } from './views/RulesView/Rules';
import LobbyView from './views/LobbyView/Lobby';
import ChatView from './views/Chat.ts';
import signOut from './views/SignOut/SignOut';
import { checkAuth } from './utils/user';
import Router from './utils/router';
import bus from './utils/bus';
import LeaderBoardMV from './ModelView/LeaderBoardMV';
import SignInMV from './ModelView/SignInMV';
import SignUpMV from './ModelView/SignUpMV';
import MultiPlayerMV from './ModelView/MultiPlayerMV';
import SinglePlayerMV from './ModelView/SinglePlayerMV';
import ProfileMV from './ModelView/ProfileMV';

import './img/arrow-left.png';
import './img/arrow-right.png';
import './img/qrosh.png';
import './main.css';

const root = document.getElementById('application');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js', { scope: '/' })
    .then((reg) => {
      console.log('sw reg success:', reg);
    })
    .catch((err) => {
      console.error('sw reg err:', err);
    });
}

const router = new Router(root);

router
  .register('/', MainMenuView)
  .register('/sign_in', SignInMV.view)
  .register('/sign_up', SignUpMV.view)
  .register('/leaders', LeaderBoardMV.view)
  .register('/about', AuthorsView)
  .register('/rules', RulesView)
  .register('/lobby', LobbyView)
  .register('/profile', ProfileMV.views.ProfileView)
  .register('/single_player', SinglePlayerMV.view)
  .register('/multi_player', MultiPlayerMV.view)
  .register('/profile/edit', ProfileMV.views.ProfileEditView);

bus.on('logout', signOut);
checkAuth(router.start.bind(router));

export default router;
