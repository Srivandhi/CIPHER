export class Router {
    constructor(routes) {
        this.routes = routes;
        this.root = document.getElementById('app');
        window.addEventListener('popstate', () => this.loadRoute(location.pathname));
    }

    init() {
        this.loadRoute(location.pathname);
    }

    navigateTo(path) {
        history.pushState(null, null, path);
        this.loadRoute(path);
    }

    async loadRoute(path) {
        // Handle query parameters
        const pathname = path.split('?')[0];

        // Simple matching logic
        let route = this.routes[pathname] || this.routes['/404'];

        // Check auth guards
        if (route.protected && !localStorage.getItem('currentUser')) {
            this.navigateTo('/login');
            return;
        }

        if (route.guestOnly && localStorage.getItem('currentUser')) {
            this.navigateTo('/dashboard');
            return;
        }

        // Clear current content
        this.root.innerHTML = '';

        // Render new content
        if (route.component) {
            const element = await route.component();
            this.root.appendChild(element);
        }
    }
}
