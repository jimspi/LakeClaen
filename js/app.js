// Main Application Entry Point
class App {
    constructor() {
        this.isInitialized = false;
        this.autoRefreshInterval = null;
    }

    async init() {
        try {
            console.log('🚀 Initializing LakeClean App...');

            // Initialize particles
            Utils.createParticles();

            // Initialize demo data
            api.initializeDemoData();

            // Set up event listeners
            this.setupEventListeners();

            // Start auto-refresh for real-time updates
            this.startAutoRefresh();

            // Initialize router (will handle initial route)
            // Router initialization happens automatically via DOMContentLoaded

            this.isInitialized = true;
            console.log('✅ App initialized successfully');

        } catch (error) {
            Utils.handleError(error, 'App initialization');
        }
    }

    setupEventListeners() {
        // Listen for real-time updates
        window.addEventListener('newCleaningRequest', this.handleNewRequest.bind(this));
        window.addEventListener('requestStatusChange', this.handleStatusChange.bind(this));

        // Handle visibility change (pause/resume auto-refresh)
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

        // Handle online/offline status
        window.addEventListener('online', this.handleOnline.bind(this));
        window.addEventListener('offline', this.handleOffline.bind(this));

        // Global error handler
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    }

    startAutoRefresh() {
        // Refresh every 30 seconds when page is visible
        this.autoRefreshInterval = setInterval(() => {
            if (!document.hidden) {
                this.checkForUpdates();
            }
        }, 30000);
    }

    stopAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
            this.autoRefreshInterval = null;
        }
    }

    async checkForUpdates() {
        try {
            // This would normally check with backend for updates
            // For demo, we'll trigger component refreshes
            const currentRoute = router.currentRoute || window.location.pathname;
            
            if (currentRoute === '/owner' && window.OwnerPortal) {
                await window.OwnerPortal.refreshData();
            } else if (currentRoute === '/cleaner' && window.CleanerDashboard) {
                await window.CleanerDashboard.refreshData();
            }
        } catch (error) {
            console.warn('Auto-refresh failed:', error);
        }
    }

    handleNewRequest(event) {
        const request = event.detail;
        console.log('🔔 New cleaning request received:', request);
        
        // Show notification if on cleaner dashboard
        if (router.isCurrentRoute('/cleaner')) {
            Utils.showNotification(`New cleaning request from ${request.ownerEmail}!`);
        }
    }

    handleStatusChange(event) {
        const request = event.detail;
        console.log('📋 Request status changed:', request);
        
        // Show notification if on owner portal
        if (router.isCurrentRoute('/owner')) {
            const statusText = request.status === 'approved' ? 'approved' : 'completed';
            Utils.showNotification(`Your cleaning request has been ${statusText}!`);
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            console.log('📱 App went to background');
        } else {
            console.log('📱 App came to foreground');
            // Trigger immediate refresh when app becomes visible
            this.checkForUpdates();
        }
    }

    handleOnline() {
        console.log('🌐 App came online');
        Utils.showNotification('Connection restored');
        this.checkForUpdates();
    }

    handleOffline() {
        console.log('📴 App went offline');
        Utils.showNotification('Working offline', 'error');
    }

    handleGlobalError(event) {
        console.error('Global error:', event.error);
        Utils.handleError(event.error, 'Global error handler');
    }

    handleUnhandledRejection(event) {
        console.error('Unhandled promise rejection:', event.reason);
        Utils.handleError(event.reason, 'Unhandled promise rejection');
        event.preventDefault(); // Prevent the default browser behavior
    }

    // Cleanup when app is destroyed
    destroy() {
        this.stopAutoRefresh();
        console.log('🧹 App cleanup completed');
    }
}

// Components namespace for organizing all UI components
window.Components = {
    renderLanding() {
        document.getElementById('app').innerHTML = Landing.render();
    },

    renderOwnerPortal() {
        if (window.OwnerPortal) {
            window.OwnerPortal.render();
        } else {
            // Fallback loading state
            document.getElementById('app').innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading Owner Portal...</p></div>';
        }
    },

    renderCleanerDashboard() {
        if (window.CleanerDashboard) {
            window.CleanerDashboard.render();
        } else {
            // Fallback loading state
            document.getElementById('app').innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading Cleaner Dashboard...</p></div>';
        }
    },

    renderLogin() {
        if (window.Login) {
            window.Login.render();
        } else {
            // Fallback
            document.getElementById('app').innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading Login...</p></div>';
        }
    },

    renderOwnerSetup() {
        const html = `
            <div class="card" style="max-width: 500px; margin: 100px auto; text-align: center;">
                <h2>Welcome to LakeClean</h2>
                <p style="margin-bottom: 30px; color: rgba(255, 255, 255, 0.8);">
                    Please enter your email address to get started with your cabin cleaning coordination.
                </p>
                
                <form id="owner-setup-form">
                    <div class="form-group">
                        <label for="setup-email">Your Email Address</label>
                        <input type="email" id="setup-email" placeholder="owner@email.com" required>
                    </div>
                    
                    <button type="submit" class="btn">Continue to Owner Portal</button>
                </form>
            </div>
        `;
        
        document.getElementById('app').innerHTML = html;
        
        // Handle form submission
        document.getElementById('owner-setup-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('setup-email').value;
            
            if (Utils.isValidEmail(email)) {
                Utils.setStorage('ownerEmail', email);
                await api.login({ email, userType: 'owner' });
                
                const redirect = new URLSearchParams(window.location.search).get('redirect') || '/owner';
                router.navigate(redirect);
            } else {
                Utils.showNotification('Please enter a valid email address', 'error');
            }
        });
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    window.app.init();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.app) {
        window.app.destroy();
    }
});
