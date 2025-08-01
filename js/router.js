// Router - Handles client-side routing and navigation
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.middlewares = [];
        
        // Bind event listeners
        window.addEventListener('popstate', this.handlePopState.bind(this));
        document.addEventListener('DOMContentLoaded', this.handleDOMContentLoaded.bind(this));
    }

    // Register a route
    route(path, handler, options = {}) {
        this.routes[path] = {
            handler,
            requiresAuth: options.requiresAuth || false,
            userType: options.userType || null,
            title: options.title || 'LakeClean'
        };
        return this;
    }

    // Add middleware
    use(middleware) {
        this.middlewares.push(middleware);
        return this;
    }

    // Navigate to a route
    async navigate(path, pushState = true) {
        try {
            Utils.showLoading();

            // Update URL if needed
            if (pushState && window.location.pathname !== path) {
                history.pushState({}, '', path);
            }

            // Run middlewares
            for (const middleware of this.middlewares) {
                const result = await middleware(path);
                if (result === false) {
                    Utils.hideLoading();
                    return; // Middleware blocked navigation
                }
            }

            // Find matching route
            const route = this.findRoute(path);
            if (!route) {
                throw new Error(`Route not found: ${path}`);
            }

            // Check authentication
            if (route.requiresAuth) {
                if (!api.isAuthenticated(route.userType)) {
                    this.navigate('/login');
                    return;
                }
            }

            // Update page title
            document.title = route.title;

            // Clear current content with animation
            const app = document.getElementById('app');
            if (this.currentRoute) {
                app.classList.add('fade-out');
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            // Execute route handler
            await route.handler(this.getRouteParams(path));
            
            // Show new content with animation
            app.classList.remove('fade-out');
            app.classList.add('fade-in');
            setTimeout(() => app.classList.remove('fade-in'), 500);

            this.currentRoute = path;
            Utils.hideLoading();

        } catch (error) {
            Utils.hideLoading();
            Utils.handleError(error, 'Router navigation');
            
            // Fallback to home page
            if (path !== '/') {
                this.navigate('/');
            }
        }
    }

    // Find route by path
    findRoute(path) {
        // Exact match first
        if (this.routes[path]) {
            return this.routes[path];
        }

        // Pattern matching for dynamic routes
        for (const routePath in this.routes) {
            if (this.matchRoute(routePath, path)) {
                return this.routes[routePath];
            }
        }

        return null;
    }

    // Match route patterns (simple implementation)
    matchRoute(pattern, path) {
        // Convert pattern to regex
        const regexPattern = pattern
            .replace(/:[^/]+/g, '([^/]+)')  // :param becomes capture group
            .replace(/\*/g, '.*');          // * becomes wildcard

        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(path);
    }

    // Extract route parameters
    getRouteParams(path) {
        const params = {};
        
        // Simple parameter extraction (can be enhanced)
        const pathParts = path.split('/').filter(Boolean);
        const routeParts = this.currentRoute?.split('/').filter(Boolean) || [];

        routeParts.forEach((part, index) => {
            if (part.startsWith(':')) {
                const paramName = part.slice(1);
                params[paramName] = pathParts[index];
            }
        });

        return params;
    }

    // Handle browser back/forward
    handlePopState(event) {
        this.navigate(window.location.pathname, false);
    }

    // Handle initial page load
    handleDOMContentLoaded() {
        const path = window.location.pathname;
        this.navigate(path, false);
    }

    // Helper method to build URLs with query params
    buildUrl(path, params = {}) {
        const url = new URL(path, window.location.origin);
        Object.keys(params).forEach(key => {
            url.searchParams.set(key, params[key]);
        });
        return url.pathname + url.search;
    }

    // Get current query parameters
    getQueryParams() {
        const params = {};
        const searchParams = new URLSearchParams(window.location.search);
        
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
        
        return params;
    }

    // Redirect helper
    redirect(path) {
        this.navigate(path);
    }

    // Back navigation
    back() {
        history.back();
    }

    // Forward navigation
    forward() {
        history.forward();
    }

    // Check if current route matches pattern
    isCurrentRoute(pattern) {
        return this.matchRoute(pattern, this.currentRoute || window.location.pathname);
    }
}

// Authentication middleware
const authMiddleware = async (path) => {
    // Routes that require authentication
    const protectedRoutes = ['/cleaner'];
    const ownerRoutes = ['/owner'];
    
    if (protectedRoutes.some(route => path.startsWith(route))) {
        if (!api.isAuthenticated('cleaner')) {
            router.navigate('/login?type=cleaner&redirect=' + encodeURIComponent(path));
            return false;
        }
    }

    if (ownerRoutes.some(route => path.startsWith(route))) {
        const ownerEmail = Utils.getStorage('ownerEmail');
        if (!ownerEmail) {
            router.navigate('/owner-setup?redirect=' + encodeURIComponent(path));
            return false;
        }
    }

    return true;
};

// Create global router instance
const router = new Router();

// Add middleware
router.use(authMiddleware);

// Define routes
router.route('/', () => {
    Components.renderLanding();
}, { title: 'LakeClean - Property Care Platform' });

router.route('/owner', () => {
    Components.renderOwnerPortal();
}, { title: 'LakeClean - Cabin Owner Portal' });

router.route('/cleaner', () => {
    Components.renderCleanerDashboard();
}, { 
    requiresAuth: true, 
    userType: 'cleaner',
    title: 'LakeClean - Cleaner Dashboard' 
});

router.route('/login', () => {
    Components.renderLogin();
}, { title: 'LakeClean - Login' });

router.route('/owner-setup', () => {
    Components.renderOwnerSetup();
}, { title: 'LakeClean - Setup' });

// Helper function to handle link clicks
function handleNavigation(event) {
    // Check if it's a navigation link
    const link = event.target.closest('[data-route]');
    if (!link) return;

    event.preventDefault();
    const route = link.dataset.route;
    
    if (route) {
        router.navigate(route);
    }
}

// Add global click handler for navigation
document.addEventListener('click', handleNavigation);

// Expose router globally
window.router = router;
