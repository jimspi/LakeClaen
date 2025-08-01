// API Layer - Handles all backend communication
class API {
    constructor() {
        this.baseURL = '/api'; // In production, this would be your API endpoint
        this.isDemo = true; // Toggle for demo mode using localStorage
    }

    // Generic request method
    async request(endpoint, options = {}) {
        if (this.isDemo) {
            return this.handleDemoRequest(endpoint, options);
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            Utils.handleError(error, `API request to ${endpoint}`);
            throw error;
        }
    }

    // Demo mode - uses localStorage instead of backend
    async handleDemoRequest(endpoint, options) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

        const method = options.method || 'GET';
        const body = options.body ? JSON.parse(options.body) : null;

        switch (endpoint) {
            case '/cleaning-requests':
                return this.handleCleaningRequests(method, body, options.params);
            
            case '/auth/login':
                return this.handleAuth(body);
            
            case '/auth/logout':
                return this.handleLogout();
            
            default:
                if (endpoint.startsWith('/cleaning-requests/')) {
                    const id = endpoint.split('/').pop();
                    return this.handleCleaningRequestById(id, method, body);
                }
                throw new Error(`Unknown endpoint: ${endpoint}`);
        }
    }

    // Handle cleaning requests CRUD operations
    handleCleaningRequests(method, body, params) {
        const requests = Utils.getStorage('cleaningRequests', []);

        switch (method) {
            case 'GET':
                if (params?.ownerEmail) {
                    return requests.filter(req => req.ownerEmail === params.ownerEmail);
                }
                return requests;

            case 'POST':
                const newRequest = {
                    id: Utils.generateId(),
                    ...body,
                    status: 'pending',
                    submittedAt: new Date().toISOString(),
                    approvedAt: null,
                    completedAt: null
                };
                requests.push(newRequest);
                Utils.setStorage('cleaningRequests', requests);
                
                // Simulate notification to cleaner
                this.notifyNewRequest(newRequest);
                
                return newRequest;

            default:
                throw new Error(`Method ${method} not supported for /cleaning-requests`);
        }
    }

    // Handle individual cleaning request operations
    handleCleaningRequestById(id, method, body) {
        const requests = Utils.getStorage('cleaningRequests', []);
        const index = requests.findIndex(req => req.id == id);

        if (index === -1) {
            throw new Error('Request not found');
        }

        switch (method) {
            case 'GET':
                return requests[index];

            case 'PATCH':
                requests[index] = { ...requests[index], ...body };
                
                // Set timestamps based on status
                if (body.status === 'approved') {
                    requests[index].approvedAt = new Date().toISOString();
                } else if (body.status === 'completed') {
                    requests[index].completedAt = new Date().toISOString();
                }
                
                Utils.setStorage('cleaningRequests', requests);
                
                // Simulate notification to owner
                this.notifyStatusChange(requests[index]);
                
                return requests[index];

            case 'DELETE':
                requests.splice(index, 1);
                Utils.setStorage('cleaningRequests', requests);
                return { success: true };

            default:
                throw new Error(`Method ${method} not supported for request ${id}`);
        }
    }

    // Handle authentication
    handleAuth(credentials) {
        const { email, password, userType } = credentials;

        if (userType === 'cleaner') {
            // In demo, accept any email with password 'clean123'
            if (password === 'clean123') {
                const authData = {
                    user: {
                        id: 'cleaner-1',
                        email: email || 'cleaner@lakeclean.com',
                        name: 'Professional Cleaner',
                        type: 'cleaner'
                    },
                    token: 'demo-cleaner-token',
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                };
                
                Utils.setStorage('authData', authData);
                return authData;
            } else {
                throw new Error('Invalid credentials');
            }
        } else {
            // For cabin owners, just store email
            const authData = {
                user: {
                    id: Utils.generateId(),
                    email,
                    type: 'owner'
                }
            };
            
            Utils.setStorage('ownerEmail', email);
            Utils.setStorage('authData', authData);
            return authData;
        }
    }

    // Handle logout
    handleLogout() {
        Utils.removeStorage('authData');
        Utils.removeStorage('cleanerAuthenticated');
        return { success: true };
    }

    // Simulate real-time notifications
    notifyNewRequest(request) {
        // In production, this would send push notifications, emails, etc.
        console.log('📧 Notification sent to cleaner:', {
            type: 'new_request',
            request: request.id,
            cabin: request.cabinAddress,
            checkoutDate: request.checkoutDate
        });

        // Simulate real-time update for demo
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('newCleaningRequest', {
                detail: request
            }));
        }, 1000);
    }

    notifyStatusChange(request) {
        // In production, this would notify the cabin owner
        console.log('📧 Notification sent to owner:', {
            type: 'status_change',
            request: request.id,
            status: request.status,
            ownerEmail: request.ownerEmail
        });

        // Simulate real-time update for demo
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('requestStatusChange', {
                detail: request
            }));
        }, 500);
    }

    // Public API methods that components will use

    // Cleaning Requests
    async getCleaningRequests(ownerEmail = null) {
        const params = ownerEmail ? { ownerEmail } : {};
        return this.request('/cleaning-requests', { params });
    }

    async createCleaningRequest(requestData) {
        return this.request('/cleaning-requests', {
            method: 'POST',
            body: JSON.stringify(requestData)
        });
    }

    async updateCleaningRequest(id, updates) {
        return this.request(`/cleaning-requests/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(updates)
        });
    }

    async deleteCleaningRequest(id) {
        return this.request(`/cleaning-requests/${id}`, {
            method: 'DELETE'
        });
    }

    // Authentication
    async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    async logout() {
        return this.request('/auth/logout', {
            method: 'POST'
        });
    }

    // Get current user from storage
    getCurrentUser() {
        const authData = Utils.getStorage('authData');
        return authData?.user || null;
    }

    // Check if user is authenticated
    isAuthenticated(userType = null) {
        const user = this.getCurrentUser();
        if (!user) return false;
        
        if (userType) {
            return user.type === userType;
        }
        
        return true;
    }

    // Initialize demo data
    initializeDemoData() {
        const existingRequests = Utils.getStorage('cleaningRequests', []);
        
        if (existingRequests.length === 0) {
            const demoRequests = [
                {
                    id: 'demo-1001',
                    ownerEmail: 'demo@email.com',
                    cabinAddress: '123 Lakeshore Drive, Pine Lake Resort',
                    checkoutDate: '2025-08-02',
                    checkoutTime: '11:00',
                    specialRequests: 'Please pay extra attention to the dock area and kitchen. Guests left early due to weather.',
                    status: 'approved',
                    submittedAt: '2025-07-29T10:30:00Z',
                    approvedAt: '2025-07-29T14:45:00Z'
                },
                {
                    id: 'demo-1002',
                    ownerEmail: 'demo@email.com',
                    cabinAddress: '123 Lakeshore Drive, Pine Lake Resort',
                    checkoutDate: '2025-08-05',
                    checkoutTime: '10:30',
                    specialRequests: '',
                    status: 'pending',
                    submittedAt: '2025-07-29T16:15:00Z'
                },
                {
                    id: 'demo-1003',
                    ownerEmail: 'john.smith@email.com',
                    cabinAddress: '456 Waterfront Way, Crystal Lake',
                    checkoutDate: '2025-08-03',
                    checkoutTime: '12:00',
                    specialRequests: 'Deep clean needed - large family gathering',
                    status: 'completed',
                    submittedAt: '2025-07-28T09:15:00Z',
                    approvedAt: '2025-07-28T11:30:00Z',
                    completedAt: '2025-08-03T15:45:00Z'
                }
            ];
            
            Utils.setStorage('cleaningRequests', demoRequests);
            console.log('Demo data initialized with', demoRequests.length, 'requests');
        }

        // Set demo owner email if not exists
        const ownerEmail = Utils.getStorage('ownerEmail');
        if (!ownerEmail) {
            Utils.setStorage('ownerEmail', 'demo@email.com');
        }
    }

    // Statistics for dashboard
    async getStatistics() {
        const requests = await this.getCleaningRequests();
        
        return {
            total: requests.length,
            pending: requests.filter(r => r.status === 'pending').length,
            approved: requests.filter(r => r.status === 'approved').length,
            completed: requests.filter(r => r.status === 'completed').length,
            thisWeek: requests.filter(r => {
                const requestDate = new Date(r.submittedAt);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return requestDate > weekAgo;
            }).length
        };
    }
}

// Create global API instance
window.api = new API();
