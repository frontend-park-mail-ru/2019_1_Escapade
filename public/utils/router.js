import {signOut} from '../views/SignOut/SignOut';

/**
 *
 */
export default class Router {
  /**
   * @param {*} root
   */
  constructor(root) {
    this.routes = {};

    this.root = root;
  }

  /**
   * @param {string} path
   * @param {BaseView} View
   * @return {*} this
   */
  register(path, View) {
    this.routes[path] = {
      View: View,
      view: null,
      el: null,
    };

    return this;
  }

  /**
   * @param {string} path
   */
  open(path) {
    const route = this.routes[path];

    if (!route) {
      this.open('/');
      return;
    }

    if (window.location.pathname !== path) {
      window.history.pushState(
          null,
          '',
          path
      );
    }

    let {View, view, el} = route;

    if (!el) {
      el = document.createElement('section');
      this.root.appendChild(el);
    }

    if (!view) {
      view = new View(el);
    }

    if (!view.active) {
      Object.values(this.routes).forEach(function({view}) {
        if (view && view.active) {
          view.hide();
        }
      });

      view.show();
    }

    this.routes[path] = {View, view, el};
  }

  /**
   *
   */
  start() {
    this.root.addEventListener('click', function(event) {
      if (!(event.target instanceof HTMLAnchorElement) ||
        event.target.classList.contains('team__a')) {
        return;
      }

      event.preventDefault();
      const link = event.target;

      console.log({
        pathname: link.pathname,
      });
      if (link.pathname === '/sign_out') {
        signOut.signOut();
        return;
      }
      this.open(link.pathname);
    }.bind(this));

    window.addEventListener('popstate', function() {
      const currentPath = window.location.pathname;

      this.open(currentPath);
    }.bind(this));

    const currentPath = window.location.pathname;

    this.open(currentPath);
  }
}