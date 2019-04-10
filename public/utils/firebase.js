import firebase from 'firebase/app';
import 'firebase/storage';

const config = {
  apiKey: 'AIzaSyBCttliGBOw8t9Djaa2erFHxFduC_NqdDg',
  authDomain: 'escapade-fc302.firebaseapp.com',
  databaseURL: 'https://escapade-fc302.firebaseio.com',
  projectId: 'escapade-fc302',
  storageBucket: 'escapade-fc302.appspot.com',
  messagingSenderId: '1063529652966',
};
firebase.initializeApp(config);

export const storage = firebase.storage();
