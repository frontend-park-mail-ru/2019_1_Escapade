import bus from './bus';


export default class Router {
  routes: any;
  currentView: any;
  root: any;

  constructor(root: any) {
    this.routes = {};
    this.currentView = null;
    this.root = root;
  }


  register(path: string, View: typeof import("../views/BaseView").default) {
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
  open(path: string) {
    bus.emit('currentPath', path);
    const route = this.routes[path];
    if (!route) {
      this.open('/');
      return;
    }

    let { View, view, el } = route;

    if (!el) {
      el = document.createElement('section');
      this.root.appendChild(el);
    }

    if (!view) {
      view = new View(el);
    }

    if (this.currentView !== null) {
      if (view.isOffline === false && !navigator.onLine) {
        this.currentView.showOfflineOverlay();
        this.root.removeChild(view.parent);
        this.routes[path].view = null;
        this.routes[path].el = null;
        return;
      }
    }

    this.currentView = view;

    if (!view.active) {
      Object.values(this.routes).forEach(function ({ view }) {
        if (view && view.active) {
          view.hide();
        }
      });

      view.show();
    }

    if (window.location.pathname !== path) {
      window.history.pushState(
        null,
        '',
        path
      );
    }

    this.routes[path] = { View, view, el };
  }

  start() {
    this.root.addEventListener('click', function (event: { target: { classList: { contains: (arg0: string) => void; }; }; preventDefault: () => void; }) {
      if (!(event.target instanceof HTMLAnchorElement) ||
        event.target.classList.contains('team__a')) {
        return;
      }

      event.preventDefault();
      const link = event.target;


      if (link.pathname === '/sign_out') {
        bus.emit('logout', null);
        return;
      }
      this.open(link.pathname);
    }.bind(this));

    window.addEventListener('popstate', function () {
      const currentPath = window.location.pathname;
      
      this.open(currentPath);
    }.bind(this));

    const currentPath = window.location.pathname;

    this.open(currentPath);
  }
}
