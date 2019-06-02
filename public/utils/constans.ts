export const BLACKLIST_TAGS = [
  'iframe',
  'script',
];

export const WHITELIST_ATTRS = [
  'src',
  'alt',
];

export const WS_LOCAL_ADDRESS = 'ws://localhost:8081';

export const R_TAG = /<(\w+)\s?(.*?)>.*?(<\/(.*?)>)?/;
export const R_ATTRIBUTES = /(\w+\s*)=(\s*".*?")/g;
export const R_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
export const R_PASSWORD = /^[A-Za-z1-9]\w{3,30}$/i;
export const R_LOGIN = /^[[:space:]]*$/i;
