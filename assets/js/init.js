// ===== SUPER DAD WORLD - ENHANCED INITIALIZATION =====
// Father's Day Interactive Experience
// Version 2.0 - Enhanced with multiple agent improvements

console.log('🍄 Super Dad World v2.0 Loading...');

// Global game instance
let game = null;

// Enhanced error handling
window.addEventListener('error', (e) => {
    console.error('Game Error:', e.error);
    showErrorMessage('Something went wrong. Please refresh the page.');
});

// Enhanced loading state
function showLoadingState() {
    const body = document.body;
    body.classList.add('loading');
    
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner">👨‍👦</div>
            <h2>Super Dad World</h2>
            <h3>A Father's Day Journey</h3>
            <p>Loading a lifetime of precious memories...</p>
            <p class="loading-subtitle">From Aarfan to the most amazing Baba ❤️</p>
            <div class="loading-bar">
                <div class="loading-progress" id="loading-progress"></div>
            </div>
            <div class="loading-hearts">
                <span class="heart">💝</span>
                <span class="heart">👨‍👦</span>
                <span class="heart">❤️</span>
            </div>
        </div>
    `;
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #000000, #1a1a2e, #16213e);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
        font-family: 'Press Start 2P', cursive;
        text-align: center;
    `;
    
    body.appendChild(loadingOverlay);
    
    // Animate loading bar
    let progress = 0;
    const progressBar = document.getElementById('loading-progress');
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
        }
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    }, 150);
    
    return loadingOverlay;
}

function hideLoadingState(overlay) {
    if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.transform = 'scale(0.95)';
        overlay.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 500);
    }
    
    document.body.classList.remove('loading');
}

function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(45deg, #dc3545, #c82333);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-family: 'Press Start 2P', cursive;
        font-size: 0.8rem;
        z-index: 10001;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.3);
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.opacity = '0';
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 300);
    }, 5000);
}

// Enhanced CSS injection for loading styles
function injectLoadingStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .loading-content {
            text-align: center;
            max-width: 500px;
            padding: 2rem;
        }
        
        .loading-spinner {
            font-size: 4rem;
            animation: bounce 1.5s ease-in-out infinite;
            margin-bottom: 2rem;
        }
        
        .loading-content h2 {
            font-size: 2rem;
            color: #FFD93D;
            margin-bottom: 0.5rem;
            text-shadow: 2px 2px 0px #000000;
        }
        
        .loading-content h3 {
            font-size: 1.2rem;
            color: #FF6B6B;
            margin-bottom: 1rem;
            text-shadow: 1px 1px 0px #000000;
        }
        
        .loading-content p {
            font-size: 0.9rem;
            color: #cccccc;
            margin-bottom: 1rem;
            line-height: 1.5;
        }
        
        .loading-subtitle {
            font-size: 1rem !important;
            color: #4ECDC4 !important;
            font-style: italic;
            margin-bottom: 2rem !important;
        }
        
        .loading-hearts {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .loading-hearts .heart {
            font-size: 1.5rem;
            animation: heartbeat 2s ease-in-out infinite;
        }
        
        .loading-hearts .heart:nth-child(2) {
            animation-delay: 0.5s;
        }
        
        .loading-hearts .heart:nth-child(3) {
            animation-delay: 1s;
        }
        
        @keyframes heartbeat {
            0%, 50%, 100% {
                transform: scale(1);
            }
            25% {
                transform: scale(1.2);
            }
        }
        
        .loading-bar {
            width: 100%;
            height: 20px;
            background: #1a1a1a;
            border: 2px solid #007bff;
            border-radius: 10px;
            overflow: hidden;
            position: relative;
        }
        
        .loading-progress {
            height: 100%;
            background: linear-gradient(90deg, #007bff, #66b3ff);
            width: 0%;
            transition: width 0.3s ease;
            border-radius: 8px;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-20px);
            }
            60% {
                transform: translateY(-10px);
            }
        }
        
        body.loading {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
}

// DOM Content Loaded handler
function initializeGame() {
    console.log('🍄 DOM loaded, initializing game...');
    
    try {
        // Check for reset parameters
        const urlParams = new URLSearchParams(window.location.search);
        const forceReset = urlParams.get('reset') === 'true';
        
        // Force reset if parameter is present or if it's a hard refresh
        const isHardRefresh = performance.navigation ? 
            (performance.navigation.type === performance.navigation.TYPE_RELOAD) : 
            false;
            
        if (forceReset || isHardRefresh) {
            console.log('🍄 Force reset detected, clearing saved progress...');
            // Clear all possible localStorage keys used by the game
            localStorage.removeItem('superDadWorld_progress');
            localStorage.removeItem('super-dad-world-progress');
            
            // Also clear any other potential keys (just in case)
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.includes('superDadWorld') || key.includes('super-dad-world'))) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
            
            // Clean URL by removing reset parameter
            if (forceReset) {
                const cleanUrl = window.location.origin + window.location.pathname;
                window.history.replaceState({}, document.title, cleanUrl);
            }
        }
        
        // Initialize the main game
        game = new SuperDadWorld();
        window.game = game; // Make globally accessible
        
        console.log('🍄 Game initialized successfully!');
        
        // Setup performance monitoring
        setupPerformanceMonitoring();
        
        // Setup service worker for offline capabilities
        setupServiceWorker();
        
        return true;
    } catch (error) {
        console.error('🍄 Failed to initialize game:', error);
        showErrorMessage('Failed to load the game. Please refresh and try again.');
        return false;
    }
}

// Performance monitoring
function setupPerformanceMonitoring() {
    if ('performance' in window) {
        // Monitor frame rate
        let frameCount = 0;
        let lastTime = performance.now();
        
        function checkPerformance() {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                if (fps < 30) {
                    console.warn('🍄 Low FPS detected:', fps);
                    // Could add performance adjustments here
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(checkPerformance);
        }
        
        requestAnimationFrame(checkPerformance);
    }
}

// Service Worker setup for offline support
function setupServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js', { scope: './' })
            .then(registration => {
                console.log('🍄 Service Worker registered successfully');
            })
            .catch(error => {
                console.log('🍄 Service Worker registration failed:', error);
                // Continue without service worker - not critical
            });
    }
}

// Enhanced preloading
function preloadCriticalResources() {
    const criticalResources = [
        'assets/images/baby-years/DSC00794.JPG',
        'assets/images/early-childhood/IMG_4081.JPG',
        'assets/images/elementary-days/IMG_2753.JPG',
        'assets/images/middle-school/IMG_0003.JPG',
        'assets/images/early-teens/IMG_0214.jpeg',
        'assets/images/mid-teens/IMG_0059.JPG',
        'assets/images/late-teens/IMG_0063.JPG',
        'assets/audio/coin.mp3',
        'assets/audio/level-complete.mp3'
    ];
    
    let loadedCount = 0;
    const totalCount = criticalResources.length;
    
    return new Promise((resolve) => {
        criticalResources.forEach(src => {
            if (src.endsWith('.mp3')) {
                const audio = new Audio();
                audio.addEventListener('canplaythrough', () => {
                    loadedCount++;
                    if (loadedCount >= totalCount) resolve();
                });
                audio.addEventListener('error', () => {
                    loadedCount++;
                    if (loadedCount >= totalCount) resolve();
                });
                audio.src = src;
                audio.load();
            } else {
                const img = new Image();
                img.addEventListener('load', () => {
                    loadedCount++;
                    if (loadedCount >= totalCount) resolve();
                });
                img.addEventListener('error', () => {
                    loadedCount++;
                    if (loadedCount >= totalCount) resolve();
                });
                img.src = src;
            }
        });
        
        // Timeout fallback
        setTimeout(resolve, 10000);
    });
}

// Enhanced mobile detection and optimization
function setupMobileOptimizations() {
    // Enhanced mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     ('ontouchstart' in window) || 
                     (navigator.maxTouchPoints > 0);
    
    if (isMobile) {
        console.log('🍄 Mobile device detected, applying comprehensive optimizations...');
        
        document.body.classList.add('mobile-device');
        
        // Enhanced viewport settings
        let viewport = document.querySelector('meta[name=viewport]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
        
        // Prevent pull-to-refresh and overscroll
        document.body.style.overscrollBehavior = 'none';
        document.documentElement.style.overscrollBehavior = 'none';
        
        // Prevent iOS Safari bounce and context menu
        document.addEventListener('touchmove', function(e) {
            if (e.target.closest('.screen') || e.target.tagName === 'CANVAS') {
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('contextmenu', function(e) {
            if (e.target.closest('.mobile-btn') || e.target.tagName === 'CANVAS' || e.target.closest('.mario-btn')) {
                e.preventDefault();
            }
        });
        
        // Optimize touch events
        document.addEventListener('touchstart', function() {}, { passive: true });
        
        // Add mobile-specific CSS enhancements
        const mobileStyle = document.createElement('style');
        mobileStyle.textContent = `
            .mobile-device {
                -webkit-text-size-adjust: 100%;
                -webkit-tap-highlight-color: transparent;
                -webkit-touch-callout: none;
            }
            
            .mobile-device * {
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                user-select: none;
            }
            
            .mobile-device .mario-btn {
                padding: 1.2rem 2rem;
                font-size: 0.9rem;
                min-height: 44px; /* Touch target size */
                touch-action: manipulation;
            }
            
            .mobile-device .world-level {
                min-height: 100px;
                padding: 1.5rem;
                touch-action: manipulation;
            }
            
            .mobile-device #mario-canvas {
                max-width: 100%;
                height: auto;
                border-radius: 15px;
                touch-action: none;
            }
            
            .mobile-device .mobile-controls {
                display: flex !important;
            }
            
            /* Prevent text selection on game elements */
            .mobile-device .game-title,
            .mobile-device .level-icon,
            .mobile-device .mobile-btn {
                -webkit-user-select: none;
                user-select: none;
            }
            
            /* Optimize for notched devices */
            @supports (padding: max(0px)) {
                .mobile-device .mobile-controls {
                    padding-left: max(20px, env(safe-area-inset-left));
                    padding-right: max(20px, env(safe-area-inset-right));
                    padding-bottom: max(20px, env(safe-area-inset-bottom));
                }
            }
        `;
        document.head.appendChild(mobileStyle);
        
        // Set mobile mode flag for game
        window.mobileMode = true;
        
        console.log('🍄 Comprehensive mobile optimizations applied');
    }
    
    return isMobile;
}

// Main initialization sequence
async function initApp() {
    console.log('🍄 Starting Super Dad World initialization...');
    
    // Inject loading styles first
    injectLoadingStyles();
    
    // Show loading state
    const loadingOverlay = showLoadingState();
    
    try {
        // Setup mobile optimizations
        setupMobileOptimizations();
        
        // Preload critical resources
        await preloadCriticalResources();
        
        // Small delay to ensure DOM is fully ready
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Initialize the game
        const success = initializeGame();
        
        if (success) {
            // Hide loading state
            setTimeout(() => {
                hideLoadingState(loadingOverlay);
                console.log('🍄 Super Dad World loaded successfully!');
            }, 800);
        } else {
            hideLoadingState(loadingOverlay);
        }
        
    } catch (error) {
        console.error('🍄 Initialization failed:', error);
        hideLoadingState(loadingOverlay);
        showErrorMessage('Failed to load the game. Please refresh and try again.');
    }
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM is already ready
    initApp();
}

// Helper function for complete reset
function clearAllGameData() {
    console.log('🍄 Clearing ALL game data...');
    
    // Clear all localStorage keys
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('superDadWorld') || key.includes('super-dad-world') || key.includes('dad') || key.includes('mario'))) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(key => {
        console.log('🗑️ Removing:', key);
        localStorage.removeItem(key);
    });
    
    // Clear sessionStorage too
    const sessionKeysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.includes('superDadWorld') || key.includes('super-dad-world') || key.includes('dad') || key.includes('mario'))) {
            sessionKeysToRemove.push(key);
        }
    }
    sessionKeysToRemove.forEach(key => {
        console.log('🗑️ Removing session:', key);
        sessionStorage.removeItem(key);
    });
    
    console.log('✅ All game data cleared!');
    return true;
}

// Export for global access
window.SuperDadWorldInit = {
    game: () => game,
    restart: () => {
        if (game) {
            game.resetGame();
        }
    },
    clearAllData: clearAllGameData,
    forceReset: () => {
        clearAllGameData();
        window.location.reload();
    },
    version: '2.0'
};

console.log('🍄 Super Dad World initialization script loaded!'); 