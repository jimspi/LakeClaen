// Landing Page Component
const Landing = {
    render() {
        return `
            <!-- Navigation -->
            <nav class="nav">
                <div class="nav-logo">
                    ${this.getLogo()}
                    <div>
                        <div class="nav-title">LakeClean</div>
                        <div class="nav-subtitle">Property Care</div>
                    </div>
                </div>
                <div class="nav-actions">
                    <button class="nav-btn" onclick="showAbout()">About</button>
                    <button class="nav-btn primary" onclick="showContact()">Contact</button>
                </div>
            </nav>

            <!-- Hero Section -->
            <section class="hero">
                <div class="hero-logo">
                    ${this.getAnimatedLogo()}
                </div>

                <h1>Lake Property<br>Cleaning Made Simple</h1>
                <p>Seamless cleaning coordination for your rental property with automated scheduling, real-time updates, and professional service management.</p>
            </section>

            <!-- Portal Cards -->
            <section class="portals grid-2">
                <div class="card portal-card animate-card" onclick="router.navigate('/owner')">
                    <div class="portal-icon">🏡</div>
                    <h3>Cabin Owners</h3>
                    <p>Request cleaning services for your lake cabin rentals. Schedule cleanings, track progress, and manage your property care needs seamlessly.</p>
                    <button class="btn">Access Owner Portal</button>
                </div>

                <div class="card portal-card cleaner animate-card" onclick="router.navigate('/cleaner')">
                    <div class="portal-icon">🧹</div>
                    <h3>Cleaning Professionals</h3>
                    <p>Manage cleaning requests, view your schedule, and coordinate property care services with an intuitive professional dashboard.</p>
                    <button class="btn btn-success">Access Cleaner Portal</button>
                </div>
            </section>

            <!-- Features Section -->
            <section class="features">
                <h2>Why Choose LakeClean?</h2>
                <div class="features-grid grid-3">
                    <div class="card feature-item animate-card">
                        <div class="feature-icon">📅</div>
                        <h4>Smart Scheduling</h4>
                        <p>Automated scheduling based on checkout times with calendar integration and real-time availability tracking.</p>
                    </div>
                    <div class="card feature-item animate-card">
                        <div class="feature-icon">🔔</div>
                        <h4>Instant Notifications</h4>
                        <p>Get notified immediately when requests are submitted, approved, or completed via email and in-app alerts.</p>
                    </div>
                    <div class="card feature-item animate-card">
                        <div class="feature-icon">📱</div>
                        <h4>Mobile Responsive</h4>
                        <p>Access your dashboard from anywhere with our fully responsive design that works perfectly on all devices.</p>
                    </div>
                    <div class="card feature-item animate-card">
                        <div class="feature-icon">🔒</div>
                        <h4>Secure & Reliable</h4>
                        <p>Enterprise-grade security with encrypted data storage and reliable cloud infrastructure you can trust.</p>
                    </div>
                    <div class="card feature-item animate-card">
                        <div class="feature-icon">⚡</div>
                        <h4>Real-time Updates</h4>
                        <p>Live synchronization between owner and cleaner portals ensures everyone stays informed instantly.</p>
                    </div>
                    <div class="card feature-item animate-card">
                        <div class="feature-icon">💰</div>
                        <h4>Cost Effective</h4>
                        <p>Streamline your cleaning operations and reduce coordination time, saving money and improving efficiency.</p>
                    </div>
                </div>
            </section>
        `;
    },

    getLogo() {
        return `
            <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#4facfe"/>
                        <stop offset="50%" style="stop-color:#00f2fe"/>
                        <stop offset="100%" style="stop-color:#667eea"/>
                    </linearGradient>
                    <linearGradient id="houseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#764ba2"/>
                        <stop offset="100%" style="stop-color:#f093fb"/>
                    </linearGradient>
                </defs>
                <ellipse cx="60" cy="85" rx="55" ry="25" fill="url(#waterGradient)" opacity="0.8"/>
                <rect x="40" y="45" width="40" height="35" fill="url(#houseGradient)" rx="2"/>
                <polygon points="35,45 60,25 85,45" fill="url(#waterGradient)"/>
            </svg>
        `;
    },

    getAnimatedLogo() {
        return `
            <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="waterGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#4facfe"/>
                        <stop offset="50%" style="stop-color:#00f2fe"/>
                        <stop offset="100%" style="stop-color:#667eea"/>
                    </linearGradient>
                    <linearGradient id="houseGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#764ba2"/>
                        <stop offset="100%" style="stop-color:#f093fb"/>
                    </linearGradient>
                    <linearGradient id="cleanGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#56ab2f"/>
                        <stop offset="100%" style="stop-color:#a8e6cf"/>
                    </linearGradient>
                </defs>
                
                <!-- Lake/Water Base -->
                <ellipse cx="60" cy="85" rx="55" ry="25" fill="url(#waterGradient2)" opacity="0.8"/>
                
                <!-- Water Ripples -->
                <circle cx="45" cy="80" r="0" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1">
                    <animate attributeName="r" values="0;12;0" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite"/>
                </circle>
                <circle cx="75" cy="85" r="0" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1">
                    <animate attributeName="r" values="0;8;0" dur="2.5s" repeatCount="indefinite" begin="0.5s"/>
                    <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" begin="0.5s"/>
                </circle>
                
                <!-- House Structure -->
                <rect x="40" y="45" width="40" height="35" fill="url(#houseGradient2)" rx="2"/>
                <polygon points="35,45 60,25 85,45" fill="url(#cleanGradient2)"/>
                <rect x="70" y="30" width="6" height="15" fill="url(#houseGradient2)"/>
                <rect x="52" y="60" width="8" height="20" fill="rgba(255,255,255,0.9)" rx="1"/>
                <circle cx="58" cy="70" r="1" fill="url(#houseGradient2)"/>
                <rect x="44" y="52" width="6" height="6" fill="rgba(255,255,255,0.9)" rx="1"/>
                <rect x="70" y="52" width="6" height="6" fill="rgba(255,255,255,0.9)" rx="1"/>
                
                <!-- Dock -->
                <rect x="25" y="78" width="20" height="4" fill="rgba(118, 75, 162, 0.8)" rx="1"/>
                <rect x="27" y="82" width="2" height="8" fill="rgba(118, 75, 162, 0.6)"/>
                <rect x="31" y="82" width="2" height="8" fill="rgba(118, 75, 162, 0.6)"/>
                <rect x="35" y="82" width="2" height="8" fill="rgba(118, 75, 162, 0.6)"/>
                <rect x="39" y="82" width="2" height="8" fill="rgba(118, 75, 162, 0.6)"/>
                
                <!-- Cleaning Bubbles -->
                <circle cx="90" cy="40" r="3" fill="rgba(255,255,255,0.6)">
                    <animate attributeName="cy" values="40;20;40" dur="4s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="4s" repeatCount="indefinite"/>
                </circle>
                <circle cx="95" cy="50" r="2" fill="rgba(255,255,255,0.5)">
                    <animate attributeName="cy" values="50;30;50" dur="3.5s" repeatCount="indefinite" begin="0.5s"/>
                    <animate attributeName="opacity" values="0.5;0.1;0.5" dur="3.5s" repeatCount="indefinite" begin="0.5s"/>
                </circle>
            </svg>
        `;
    }
};

// Modal functions for About and Contact
function showAbout() {
    const modal = `
        <div class="modal" onclick="closeModal(event)">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <h2>About LakeClean</h2>
                <p style="margin-bottom: 20px; line-height: 1.6;">
                    LakeClean is a comprehensive property care platform designed specifically for lake cabin rentals. 
                    We streamline the cleaning coordination process between property owners and cleaning professionals.
                </p>
                <p style="line-height: 1.6;">
                    Our platform offers automated scheduling, real-time notifications, calendar integration, and 
                    professional dashboard management to ensure your property is always guest-ready.
                </p>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modal);
    setTimeout(() => document.querySelector('.modal').style.display = 'flex', 10);
}

function showContact() {
    const modal = `
        <div class="modal" onclick="closeModal(event)">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <h2>Contact Us</h2>
                <div style="line-height: 1.8;">
                    <p style="margin-bottom: 15px;"><strong>Email:</strong> support@lakeclean.com</p>
                    <p style="margin-bottom: 15px;"><strong>Phone:</strong> (555) 123-4567</p>
                    <p style="margin-bottom: 15px;"><strong>Hours:</strong> Mon-Fri 9AM-6PM EST</p>
                    <p>Need help getting started? We're here to assist you with setup and onboarding.</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modal);
    setTimeout(() => document.querySelector('.modal').style.display = 'flex', 10);
}

function closeModal(event) {
    if (event && event.target !== event.currentTarget) return;
    
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    }
}

// Add modal styles to document
const modalStyles = `
    <style>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: modalFadeIn 0.3s ease-out;
    }

    .modal-content {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(30px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        padding: 40px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        animation: modalSlideIn 0.4s ease-out;
        color: rgba(255, 255, 255, 0.9);
    }

    .modal-close {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        font-size: 24px;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    .modal-close:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }

    .modal h2 {
        margin-bottom: 20px;
        color: rgba(255, 255, 255, 0.95);
    }

    .hero {
        text-align: center;
        padding: 80px 0 120px;
        animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    .hero-logo {
        width: 120px;
        height: 120px;
        margin: 0 auto 40px;
        filter: drop-shadow(0 0 30px rgba(102, 126, 234, 0.5));
        animation: logoFloat 4s ease-in-out infinite;
    }

    .hero h1 {
        font-size: 4rem;
        font-weight: 900;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 24px;
        letter-spacing: -0.02em;
        line-height: 1.1;
        animation: textGlow 3s ease-in-out infinite alternate;
    }

    .hero p {
        font-size: 1.4rem;
        color: rgba(255, 255, 255, 0.8);
        max-width: 700px;
        margin: 0 auto 50px;
        line-height: 1.6;
    }

    .portals {
        margin-bottom: 80px;
    }

    .portal-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        animation: iconBounce 2s ease-in-out infinite;
    }

    .cleaner .portal-icon {
        background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
    }

    .portal-card h3 {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 16px;
        color: rgba(255, 255, 255, 0.95);
    }

    .portal-card p {
        font-size: 1.1rem;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 32px;
        line-height: 1.6;
    }

    .features {
        text-align: center;
    }

    .features h2 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 60px;
        color: rgba(255, 255, 255, 0.95);
    }

    .feature-icon {
        font-size: 3rem;
        margin-bottom: 20px;
        opacity: 0.8;
    }

    .feature-item h4 {
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 12px;
        color: rgba(255, 255, 255, 0.9);
    }

    .feature-item p {
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.5;
    }

    @media (max-width: 768px) {
        .hero h1 {
            font-size: 2.5rem;
        }

        .hero p {
            font-size: 1.1rem;
        }
    }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', modalStyles);
