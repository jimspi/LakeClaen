// Utility Functions
class Utils {
    // Date formatting
    static formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    static formatDateTime(isoString) {
        return new Date(isoString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    static formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour12 = hours % 12 || 12;
        const ampm = hours < 12 ? 'AM' : 'PM';
        return `${hour12}:${minutes} ${ampm}`;
    }

    // Get urgency level for cleaning requests
    static getUrgency(checkoutDate) {
        const checkout = new Date(checkoutDate);
        const today = new Date();
        const diffTime = checkout - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 1) return { text: '🔴 URGENT - Today', level: 'critical' };
        if (diffDays === 1) return { text: '🟡 Tomorrow', level: 'high' };
        if (diffDays <= 3) return { text: '🟢 This Week', level: 'medium' };
        return { text: '⚪ Scheduled', level: 'low' };
    }

    // Notification system
    static showNotification(message, type = 'success', duration = 4000) {
        const notification = document.getElementById('notification');
        if (!notification) return;

        notification.textContent = message;
        notification.className = `notification ${type === 'error' ? 'error' : ''}`;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, duration);
    }

    // Loading state management
    static showLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.remove('hidden');
    }

    static hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.add('hidden');
    }

    // Generate unique IDs
    static generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }

    // Validate email
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate form data
    static validateCleaningRequest(data) {
        const errors = [];

        if (!data.ownerEmail || !this.isValidEmail(data.ownerEmail)) {
            errors.push('Valid email address is required');
        }

        if (!data.cabinAddress || data.cabinAddress.trim().length < 10) {
            errors.push('Cabin address must be at least 10 characters');
        }

        if (!data.checkoutDate) {
            errors.push('Checkout date is required');
        } else {
            const checkoutDate = new Date(data.checkoutDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (checkoutDate < today) {
                errors.push('Checkout date cannot be in the past');
            }
        }

        if (!data.checkoutTime) {
            errors.push('Checkout time is required');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Create floating particles
    static createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        // Clear existing particles
        particlesContainer.innerHTML = '';
        
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Local storage helpers
    static setStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    static getStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    }

    static removeStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }

    // Debounce function for performance
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for performance
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Page transition helpers
    static async transitionPage(fromContent, toContent) {
        if (fromContent) {
            fromContent.classList.add('animate-out');
            await new Promise(resolve => setTimeout(resolve, 300));
            fromContent.classList.add('hidden');
        }

        if (toContent) {
            toContent.classList.remove('hidden');
            toContent.classList.add('animate-in');
        }
    }

    // Copy to clipboard
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('Copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy:', error);
            this.showNotification('Failed to copy to clipboard', 'error');
        }
    }

    // Format currency
    static formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    // Capitalize first letter
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Escape HTML to prevent XSS
    static escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // Check if device is mobile
    static isMobile() {
        return window.innerWidth <= 768;
    }

    // Check if device supports touch
    static isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    // Generate calendar grid
    static generateCalendarGrid(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dateStr = date.toISOString().split('T')[0];
            const isCurrentMonth = date.getMonth() === month;
            const isToday = dateStr === todayStr;

            days.push({
                date: date.getDate(),
                dateStr,
                isCurrentMonth,
                isToday,
                fullDate: new Date(date)
            });
        }

        return days;
    }

    // Analytics and tracking (placeholder for future implementation)
    static trackEvent(eventName, properties = {}) {
        // In production, integrate with analytics service
        console.log('Analytics Event:', eventName, properties);
    }

    // Error handling
    static handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        this.showNotification('An error occurred. Please try again.', 'error');
        
        // In production, send to error tracking service
        // Sentry.captureException(error, { context });
    }
}
