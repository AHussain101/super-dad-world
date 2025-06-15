// ===== GAME STATE MANAGEMENT =====
class SuperDadWorld {
    constructor() {
        console.log('🍄 SuperDadWorld constructor called');
        this.currentScreen = 'start-screen';
        this.currentLevel = 1;
        this.completedLevels = new Set();
        this.levelData = this.initializeLevelData();
        this.gameProgress = this.loadProgress();
        this.musicPlaying = false;
        this.selectedCharacter = null;
        this.currentMarioGame = null;
        this.transitionInProgress = false;
        
        // Enhanced state management
        this.screenHistory = [];
        this.levelStates = new Map();
        this.autoSave = true;
        this.debugMode = false;
        
        console.log('🍄 About to initialize game...');
        this.init();
    }

    initializeLevelData() {
        console.log('🍄 Initializing level data...');
        return {
            1: {
                title: "World 1-1: Baby Years (0-2)",
                subtitle: "Tiny Adventurer",
                icon: "👶",
                folder: "baby-years",
                placeholder: "assets/images/baby-years/placeholder.jpg",
                caption: "The beginning of our amazing journey together...",
                storyPlaceholder: "Write about your earliest memories with Dad, those precious baby moments...",
                completed: false,
                unlocked: true,
                gameCompleted: false
            },
            2: {
                title: "World 1-2: Early Childhood (3-5)",
                subtitle: "First Steps Hero",
                icon: "🧒",
                folder: "early-childhood",
                placeholder: "assets/images/early-childhood/placeholder.jpg",
                caption: "Taking first steps into adventure...",
                storyPlaceholder: "Share memories of learning to walk, talk, and explore the world with Dad's guidance...",
                completed: false,
                unlocked: false,
                gameCompleted: false
            },
            3: {
                title: "World 2-1: Elementary Days (6-8)",
                subtitle: "School Zone Explorer",
                icon: "🎒",
                folder: "elementary-days",
                placeholder: "assets/images/elementary-days/placeholder.jpg",
                caption: "School adventures and growing wisdom...",
                storyPlaceholder: "Remember the school days, homework help, and Dad's encouragement in learning...",
                completed: false,
                unlocked: false,
                gameCompleted: false
            },
            4: {
                title: "World 2-2: Middle School (9-11)",
                subtitle: "Growing Up Quest",
                icon: "📚",
                folder: "middle-school",
                placeholder: "assets/images/middle-school/placeholder.jpg",
                caption: "Navigating new challenges together...",
                storyPlaceholder: "Those middle school years - Dad's support through growing pains and new discoveries...",
                completed: false,
                unlocked: false,
                gameCompleted: false
            },
            5: {
                title: "World 3-1: Early Teens (12-14)",
                subtitle: "Teenage Warrior",
                icon: "⚡",
                folder: "early-teens",
                placeholder: "assets/images/early-teens/placeholder.jpg",
                caption: "Finding strength and identity...",
                storyPlaceholder: "The teenage transition - Dad's patience and wisdom during those challenging years...",
                completed: false,
                unlocked: false,
                gameCompleted: false
            },
            6: {
                title: "World 3-2: Mid Teens (15-17)",
                subtitle: "Level Up Champion",
                icon: "🏆",
                folder: "mid-teens",
                placeholder: "assets/images/mid-teens/placeholder.jpg",
                caption: "Achieving new milestones...",
                storyPlaceholder: "High school adventures, driving lessons, and Dad's trust in your growing independence...",
                completed: false,
                unlocked: false,
                gameCompleted: false
            },
            7: {
                title: "World 4-1: Late Teens (18-19)",
                subtitle: "Final Boss: Adulthood",
                icon: "👑",
                folder: "late-teens",
                placeholder: "assets/images/late-teens/placeholder.jpg",
                caption: "Ready to conquer the world...",
                storyPlaceholder: "Approaching adulthood - Dad's pride in who you've become and lessons for the future...",
                completed: false,
                unlocked: false,  
                gameCompleted: false
            }
        };
    }

    init() {
        console.log('🍄 Initializing Super Dad World...');
        this.setupEventListeners();
        this.loadProgress();
        this.refreshLevelStates();
        this.showScreen('start-screen');
        this.setupMusic();
        this.drawCharacterPreviews();
        this.setupPerformanceOptimizations();
    }

    // ===== ENHANCED SCREEN MANAGEMENT =====
    showScreen(screenId, transition = true) {
        if (this.transitionInProgress) return;
        
        console.log(`🍄 Transitioning to screen: ${screenId}`);
        
        if (transition && this.currentScreen !== screenId) {
            this.transitionInProgress = true;
            
            // Add current screen to history
            if (this.currentScreen) {
                this.screenHistory.push(this.currentScreen);
                if (this.screenHistory.length > 10) {
                    this.screenHistory.shift(); // Keep history manageable
                }
            }
            
            // Smooth transition
            this.performScreenTransition(this.currentScreen, screenId);
        } else {
            this.setActiveScreen(screenId);
        }
    }

    performScreenTransition(fromScreen, toScreen) {
        const fromElement = fromScreen ? document.getElementById(fromScreen) : null;
        const toElement = document.getElementById(toScreen);
        
        if (!toElement) {
            console.error(`Screen ${toScreen} not found`);
            this.transitionInProgress = false;
            return;
        }

        // Prepare the incoming screen
        toElement.style.display = 'block';
        toElement.classList.remove('active', 'exiting');
        toElement.classList.add('screen');
        
        // Add loading state if needed
        if (toScreen === 'level-screen') {
            toElement.classList.add('loading');
        }

        // Animate out current screen
        if (fromElement) {
            fromElement.classList.add('exiting');
            
            setTimeout(() => {
                fromElement.classList.remove('active', 'exiting');
                fromElement.style.display = 'none';
                
                // Animate in new screen
                requestAnimationFrame(() => {
                    toElement.classList.add('active');
                    toElement.classList.remove('loading');
                    
                    setTimeout(() => {
                        this.transitionInProgress = false;
                        this.onScreenTransitionComplete(toScreen);
                    }, 400);
                });
            }, 400);
        } else {
            // No current screen, just show the new one
            requestAnimationFrame(() => {
                toElement.classList.add('active');
                toElement.classList.remove('loading');
                
                setTimeout(() => {
                    this.transitionInProgress = false;
                    this.onScreenTransitionComplete(toScreen);
                }, 400);
            });
        }

        this.currentScreen = toScreen;
    }

    onScreenTransitionComplete(screenId) {
        console.log(`🍄 Screen transition complete: ${screenId}`);
        
        // Screen-specific post-transition actions
        switch(screenId) {
            case 'world-map':
                this.refreshWorldMap();
                break;
            case 'level-screen':
                this.initializeLevelScreen();
                break;
            case 'character-select':
                this.refreshCharacterSelection();
                break;
        }
        
        // Auto-save progress
        if (this.autoSave) {
            this.saveProgress();
        }
    }

    setActiveScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active', 'exiting');
            screen.style.display = 'none';
        });

        // Show the active screen
        const activeScreen = document.getElementById(screenId);
        if (activeScreen) {
            activeScreen.style.display = 'block';
            activeScreen.classList.add('active');
            this.currentScreen = screenId;
        }
    }

    // ===== ENHANCED LEVEL MANAGEMENT =====
    refreshLevelStates() {
        console.log('🍄 Refreshing level states...');
        
        // Update level unlock states based on completed levels
        const sortedLevels = Object.keys(this.levelData).map(Number).sort();
        
        for (let i = 0; i < sortedLevels.length; i++) {
            const levelNum = sortedLevels[i];
            const level = this.levelData[levelNum];
            
            if (levelNum === 1) {
                level.unlocked = true; // First level always unlocked
            } else {
                const previousLevel = sortedLevels[i - 1];
                level.unlocked = this.levelData[previousLevel].completed;
            }
        }
        
        this.updateWorldMapDisplay();
    }

    updateWorldMapDisplay() {
        console.log('🍄 Updating world map display...');
        
        document.querySelectorAll('.world-level').forEach((levelElement, index) => {
            const levelNum = index + 1;
            const levelData = this.levelData[levelNum];
            
            if (!levelData) return;
            
            // Update classes based on state
            levelElement.classList.remove('locked', 'completed', 'unlocked');
            
            if (levelData.completed) {
                levelElement.classList.add('completed');
            } else if (levelData.unlocked) {
                levelElement.classList.add('unlocked');
            } else {
                levelElement.classList.add('locked');
            }
            
            // Update status icon
            const statusElement = levelElement.querySelector('.level-status');
            if (statusElement) {
                if (levelData.completed) {
                    statusElement.textContent = '✅';
                    statusElement.className = 'level-status completed';
                } else if (levelData.unlocked) {
                    statusElement.textContent = '✨';
                    statusElement.className = 'level-status unlocked';
                } else {
                    statusElement.textContent = '🔒';
                    statusElement.className = 'level-status locked';
                }
            }
            
            // Update click behavior
            if (levelData.unlocked && !levelData.completed) {
                levelElement.style.cursor = 'pointer';
                levelElement.setAttribute('title', 'Click to play!');
            } else if (levelData.completed) {
                levelElement.style.cursor = 'pointer';
                levelElement.setAttribute('title', 'Completed! Click to replay.');
            } else {
                levelElement.style.cursor = 'not-allowed';
                levelElement.setAttribute('title', 'Complete previous levels to unlock');
            }
        });
        
        // Update memory counter
        const completedCount = Object.values(this.levelData).filter(l => l.completed).length;
        const memoriesElement = document.getElementById('memories-collected');
        if (memoriesElement) {
            memoriesElement.textContent = completedCount;
        }
    }

    refreshWorldMap() {
        console.log('🍄 Refreshing world map...');
        this.refreshLevelStates();
        this.updateWorldMapDisplay();
        
        // Add entrance animation to levels
        document.querySelectorAll('.world-level').forEach((level, index) => {
            level.style.animationDelay = `${index * 0.1}s`;
            level.classList.add('level-entrance');
        });
    }

    enterLevel(levelNum) {
        console.log(`🍄 Entering level ${levelNum}`);
        
        const levelData = this.levelData[levelNum];
        if (!levelData || !levelData.unlocked) {
            console.log('Level not unlocked');
            this.showNotification('🔒 Complete previous levels first!', 'warning');
            return;
        }

        this.currentLevel = levelNum;
        this.showScreen('level-screen');
    }

    initializeLevelScreen() {
        console.log(`🍄 Initializing level screen for level ${this.currentLevel}`);
        
        const levelData = this.levelData[this.currentLevel];
        if (!levelData) return;

        // Update level title
        const titleElement = document.getElementById('current-level-title');
        if (titleElement) {
            titleElement.textContent = levelData.title;
        }

        // Initialize mini-game
        this.initializeMarioGame();
        
        // Setup photo section
        this.setupPhotoSection();
        
        // Reset level state
        this.resetLevelState();
    }

    initializeMarioGame() {
        console.log(`🍄 Initializing Mario game for level ${this.currentLevel}`);
        
        // Clean up existing game
        if (this.currentMarioGame) {
            this.currentMarioGame.cleanup();
            this.currentMarioGame = null;
        }

        // Create new game instance
        try {
            this.currentMarioGame = new MarioMiniGame(
                'mario-canvas', 
                this.currentLevel, 
                this.selectedCharacter || 'mario'
            );
            
            // Set completion callback
            this.currentMarioGame.setOnComplete(() => {
                console.log('🍄 Mario game completed!');
                this.onMarioGameComplete();
            });
            
        } catch (error) {
            console.error('Error initializing Mario game:', error);
            this.showNotification('⚠️ Game loading error. Please refresh!', 'error');
        }
    }

    onMarioGameComplete() {
        console.log('🍄 Mario game completed, revealing photo...');
        this.revealPhoto();
        this.playSound('level-complete');
        this.showNotification('🎉 Great job! Memory unlocked!', 'success');
    }

    setupPhotoSection() {
        const photoSection = document.querySelector('.photo-reveal-section');
        const placeholder = document.querySelector('.photo-placeholder');
        const reveal = document.querySelector('.photo-reveal');
        
        if (photoSection && placeholder) {
            // Show placeholder initially
            placeholder.style.display = 'block';
            if (reveal) reveal.style.display = 'none';
            
            // Update placeholder content
            const levelData = this.levelData[this.currentLevel];
            const iconDisplay = placeholder.querySelector('.level-icon-display');
            const titleElement = placeholder.querySelector('h3');
            const descElement = placeholder.querySelector('p');
            
            if (iconDisplay) iconDisplay.textContent = levelData.icon;
            if (titleElement) titleElement.textContent = 'Memory Locked';
            if (descElement) descElement.textContent = levelData.caption;
        }
    }

    resetLevelState() {
        // Reset any level-specific state
        this.levelStates.set(this.currentLevel, {
            gameCompleted: false,
            photoRevealed: false,
            startTime: Date.now()
        });
    }

    revealPhoto() {
        console.log('🍄 Revealing photo...');
        
        const placeholder = document.querySelector('.photo-placeholder');
        const reveal = document.querySelector('.photo-reveal');
        
        if (placeholder && reveal) {
            // Hide placeholder with animation
            placeholder.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            placeholder.style.opacity = '0';
            placeholder.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                placeholder.style.display = 'none';
                
                // Show photo reveal
                reveal.style.display = 'block';
                reveal.style.opacity = '0';
                reveal.style.transform = 'scale(0.8) rotateY(90deg)';
                
                // Load the actual photo
                this.loadLevelPhoto(this.currentLevel);
                
                // Animate in
                requestAnimationFrame(() => {
                    reveal.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    reveal.style.opacity = '1';
                    reveal.style.transform = 'scale(1) rotateY(0deg)';
                });
                
                // Update level state
                const levelState = this.levelStates.get(this.currentLevel) || {};
                levelState.photoRevealed = true;
                this.levelStates.set(this.currentLevel, levelState);
                
            }, 500);
        }
    }

    completeLevel() {
        console.log(`🍄 Completing level ${this.currentLevel}`);
        
        // Mark level as completed
        this.levelData[this.currentLevel].completed = true;
        this.completedLevels.add(this.currentLevel);
        
        // Save progress
        this.saveProgress();
        
        // Refresh level states
        this.refreshLevelStates();
        
        // Show completion notification
        this.showNotification('🎉 Level completed! New memories unlocked!', 'success');
        
        // Play completion sound
        this.playSound('level-complete');
        
        // Check if game is complete
        this.checkGameCompletion();
        
        // Return to world map after delay
        setTimeout(() => {
            this.showScreen('world-map');
        }, 2000);
    }

    checkGameCompletion() {
        const totalLevels = Object.keys(this.levelData).length;
        const completedCount = Object.values(this.levelData).filter(l => l.completed).length;
        
        if (completedCount === totalLevels) {
            console.log('🍄 Game completed!');
            setTimeout(() => {
                this.showScreen('victory-screen');
                this.setupVictoryScreen();
            }, 3000);
        }
    }

    // ===== ENHANCED PROGRESS MANAGEMENT =====
    saveProgress() {
        console.log('🍄 Saving progress...');
        
        const progressData = {
            currentLevel: this.currentLevel,
            completedLevels: Array.from(this.completedLevels),
            selectedCharacter: this.selectedCharacter,
            levelData: this.levelData,
            musicPlaying: this.musicPlaying,
            timestamp: Date.now(),
            version: '2.0'
        };
        
        try {
            localStorage.setItem('superDadWorld_progress', JSON.stringify(progressData));
            console.log('Progress saved successfully');
        } catch (error) {
            console.error('Error saving progress:', error);
            this.showNotification('⚠️ Could not save progress', 'warning');
        }
    }

    loadProgress() {
        console.log('🍄 Loading progress...');
        
        try {
            const savedData = localStorage.getItem('superDadWorld_progress');
            if (savedData) {
                const progressData = JSON.parse(savedData);
                
                // Validate saved data
                if (progressData.version && progressData.levelData) {
                    this.currentLevel = progressData.currentLevel || 1;
                    this.completedLevels = new Set(progressData.completedLevels || []);
                    this.selectedCharacter = progressData.selectedCharacter;
                    this.musicPlaying = progressData.musicPlaying || false;
                    
                    // Merge level data carefully
                    Object.keys(this.levelData).forEach(levelNum => {
                        if (progressData.levelData[levelNum]) {
                            this.levelData[levelNum].completed = progressData.levelData[levelNum].completed || false;
                        }
                    });
                    
                    console.log('Progress loaded successfully');
                    return progressData;
                }
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }
        
        return null;
    }

    resetGame() {
        console.log('🍄 Resetting game...');
        
        // Clear all progress - both localStorage keys
        localStorage.removeItem('superDadWorld_progress');
        localStorage.removeItem('super-dad-world-progress');
        
        // Clear any other game-related localStorage keys
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes('superDadWorld') || key.includes('super-dad-world'))) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Reset state
        this.currentLevel = 1;
        this.completedLevels.clear();
        this.selectedCharacter = null;
        this.levelStates.clear();
        
        // Reset level data
        Object.values(this.levelData).forEach(level => {
            level.completed = false;
            level.unlocked = false;
            level.gameCompleted = false;
        });
        this.levelData[1].unlocked = true; // First level always unlocked
        
        // Clean up current game
        if (this.currentMarioGame) {
            this.currentMarioGame.cleanup();
            this.currentMarioGame = null;
        }
        
        // Refresh UI
        this.refreshLevelStates();
        this.showScreen('start-screen');
        
        this.showNotification('🔄 Game reset successfully!', 'info');
    }

    // ===== NOTIFICATION SYSTEM =====
    showNotification(message, type = 'info', duration = 3000) {
        // Create notification element if it doesn't exist
        let notificationContainer = document.getElementById('notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            notificationContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            margin-bottom: 0.5rem;
            border-radius: 8px;
            font-family: 'Press Start 2P', cursive;
            font-size: 0.7rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            transition: all 0.3s ease;
            pointer-events: auto;
            border: 2px solid rgba(255, 255, 255, 0.3);
        `;
        
        notificationContainer.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Auto-remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    getNotificationColor(type) {
        const colors = {
            'success': 'linear-gradient(45deg, #28a745, #20c997)',
            'error': 'linear-gradient(45deg, #dc3545, #c82333)',
            'warning': 'linear-gradient(45deg, #ffc107, #fd7e14)',
            'info': 'linear-gradient(45deg, #007bff, #6f42c1)'
        };
        return colors[type] || colors.info;
    }

    // ===== PERFORMANCE OPTIMIZATIONS =====
    setupPerformanceOptimizations() {
        console.log('🍄 Setting up performance optimizations...');
        
        // Preload critical images
        this.preloadImages();
        
        // Setup intersection observer for lazy loading
        this.setupLazyLoading();
        
        // Setup resize handler with debouncing
        this.setupResizeHandler();
    }

    preloadImages() {
        const imagesToPreload = [
            'assets/images/baby-years/DSC00794.JPG',
            'assets/images/early-childhood/IMG_4081.JPG',
            'assets/images/elementary-days/IMG_2753.JPG',
            'assets/images/middle-school/IMG_0003.JPG',
            'assets/images/early-teens/IMG_0214.jpeg',
            'assets/images/mid-teens/IMG_0059.JPG',
            'assets/images/late-teens/IMG_0063.JPG'
        ];
        
        imagesToPreload.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });
            
            // Observe images with data-src attributes
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    handleResize() {
        // Refresh Mario game canvas if active
        if (this.currentMarioGame && this.currentScreen === 'level-screen') {
            this.currentMarioGame.handleResize();
        }
        
        // Refresh character previews if needed
        if (this.currentScreen === 'character-select') {
            this.drawCharacterPreviews();
        }
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Start button
        const startBtn = document.getElementById('start-game');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                console.log('🍄 Start game clicked');
                this.showScreen('character-select');
            });
        }

        // New game button
        const newGameBtn = document.getElementById('new-game');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => {
                console.log('🍄 New game clicked - resetting progress');
                this.resetGame();
                // Force reload to ensure clean state
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            });
        }

        // Character selection
        document.querySelectorAll('.character-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const character = e.currentTarget.dataset.character;
                this.selectCharacter(character);
            });
        });

        // Character selection buttons
        const backToStartBtn = document.getElementById('back-to-start');
        if (backToStartBtn) {
            backToStartBtn.addEventListener('click', () => {
                console.log('🍄 Back to start clicked');
                this.showScreen('start-screen');
            });
        }

        const confirmCharacterBtn = document.getElementById('confirm-character');
        if (confirmCharacterBtn) {
            confirmCharacterBtn.addEventListener('click', () => {
                console.log('🍄 Confirm character clicked');
                if (this.selectedCharacter) {
                    this.showScreen('world-map');
                }
            });
        }

        // Level selection
        document.querySelectorAll('.world-level').forEach(level => {
            level.addEventListener('click', (e) => {
                const levelNum = parseInt(e.currentTarget.dataset.level);
                console.log(`🍄 Level ${levelNum} clicked`);
                
                if (this.isLevelUnlocked(levelNum)) {
                    this.enterLevel(levelNum);
                } else {
                    this.showNotification('🔒 Complete previous levels first!', 'warning');
                }
            });
        });

        // Back button
        const backBtn = document.getElementById('back-to-world');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                console.log('🍄 Back to world clicked');
                
                // Clean up current Mario game
                if (this.currentMarioGame) {
                    this.currentMarioGame.cleanup();
                    this.currentMarioGame = null;
                }
                
                this.showScreen('world-map');
            });
        }

        // Complete level button
        const completeBtn = document.getElementById('complete-level');
        if (completeBtn) {
            completeBtn.addEventListener('click', () => {
                console.log('🍄 Complete level clicked');
                this.completeLevel();
            });
        }

        // View gallery from level button
        const viewGalleryFromLevelBtn = document.getElementById('view-gallery-from-level');
        if (viewGalleryFromLevelBtn) {
            viewGalleryFromLevelBtn.addEventListener('click', () => {
                console.log('🍄 View gallery from level clicked');
                this.showPhotoGallery();
            });
        }

        // Victory screen buttons
        const playAgainBtn = document.getElementById('play-again');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                console.log('🍄 Play again clicked');
                this.showResetModal();
            });
        }

        const shareBtn = document.getElementById('share-journey');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                console.log('🍄 Share journey clicked');
                this.shareJourney();
            });
        }

        // Photo Gallery buttons
        const viewGalleryBtn = document.getElementById('view-gallery');
        if (viewGalleryBtn) {
            viewGalleryBtn.addEventListener('click', () => {
                console.log('🍄 View gallery clicked');
                this.showPhotoGallery();
            });
        }

        const backFromGalleryBtn = document.getElementById('back-from-gallery');
        if (backFromGalleryBtn) {
            backFromGalleryBtn.addEventListener('click', () => {
                console.log('🍄 Back from gallery clicked');
                this.showScreen('victory-screen');
            });
        }

        // Reset modal buttons
        const cancelResetBtn = document.getElementById('cancel-reset');
        if (cancelResetBtn) {
            cancelResetBtn.addEventListener('click', () => {
                this.hideResetModal();
            });
        }

        const confirmResetBtn = document.getElementById('confirm-reset');
        if (confirmResetBtn) {
            confirmResetBtn.addEventListener('click', () => {
                this.hideResetModal();
                this.resetGame();
            });
        }

        // Music toggle
        const musicToggle = document.getElementById('music-toggle');
        if (musicToggle) {
            musicToggle.addEventListener('click', () => {
                this.toggleMusic();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });

        // Prevent context menu on canvas
        document.addEventListener('contextmenu', (e) => {
            if (e.target.tagName === 'CANVAS') {
                e.preventDefault();
            }
        });
    }

    // ===== UTILITY METHODS =====
    isLevelUnlocked(levelNum) {
        return this.levelData[levelNum] && this.levelData[levelNum].unlocked;
    }

    refreshCharacterSelection() {
        // Refresh character selection if needed
        if (this.selectedCharacter) {
            const selectedOption = document.querySelector(`[data-character="${this.selectedCharacter}"]`);
            if (selectedOption) {
                selectedOption.classList.add('selected');
                const confirmBtn = document.getElementById('confirm-character');
                if (confirmBtn) confirmBtn.disabled = false;
            }
        }
    }

    // ===== CHARACTER SELECTION =====
    selectCharacter(character) {
        // Remove previous selection
        document.querySelectorAll('.character-option').forEach(option => {
            option.classList.remove('selected');
        });

        // Add selection to clicked character
        const selectedOption = document.querySelector(`[data-character="${character}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
            this.selectedCharacter = character;
            
            // Enable confirm button
            const confirmBtn = document.getElementById('confirm-character');
            if (confirmBtn) {
                confirmBtn.disabled = false;
                confirmBtn.textContent = `Play as ${this.getCharacterName(character)}`;
            }
        }
    }

    getCharacterName(character) {
        const names = {
            'mario': 'Mario',
            'luigi': 'Luigi', 
            'donkey': 'Donkey Kong'
        };
        return names[character] || 'Mario';
    }

    // ===== WORLD MAP =====
    updateWorldMap() {
        // Update memories collected counter
        document.getElementById('memories-collected').textContent = this.completedLevels.size;
        
        // Update level states
        document.querySelectorAll('.world-level').forEach(levelElement => {
            const levelNum = parseInt(levelElement.dataset.level);
            const statusElement = levelElement.querySelector('.level-status');
            
            levelElement.classList.remove('locked', 'completed');
            
            if (this.completedLevels.has(levelNum)) {
                levelElement.classList.add('completed');
                statusElement.textContent = '✅';
            } else if (this.isLevelUnlocked(levelNum)) {
                statusElement.textContent = '✨';
            } else {
                levelElement.classList.add('locked');
                statusElement.textContent = '🔒';
            }
        });
    }

    // ===== VICTORY SCREEN =====
    setupVictoryScreen() {
        document.getElementById('final-memories').textContent = this.completedLevels.size;
        document.getElementById('final-chapters').textContent = this.completedLevels.size;
        
        // Map of actual photo filenames for each level
        const photoFilenames = {
            1: 'DSC00794.JPG',      // baby-years
            2: 'IMG_4081.JPG',      // early-childhood  
            3: 'IMG_2753.JPG',      // elementary-days
            4: 'IMG_0003.JPG',      // middle-school
            5: 'IMG_0214.jpeg',     // early-teens
            6: 'IMG_0059.JPG',      // mid-teens
            7: 'IMG_0063.JPG'       // late-teens
        };
        
        // Create photo montage
        const montageGrid = document.getElementById('final-montage');
        montageGrid.innerHTML = '';
        
        Object.keys(this.levelData).forEach(levelNum => {
            if (this.completedLevels.has(parseInt(levelNum))) {
                const levelData = this.levelData[levelNum];
                const img = document.createElement('img');
                img.className = 'montage-photo';
                
                // Use actual filename
                const actualFilename = photoFilenames[parseInt(levelNum)];
                if (actualFilename) {
                    img.src = `assets/images/${levelData.folder}/${actualFilename}`;
                } else {
                    img.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'><rect width='150' height='150' fill='%23333'/><text x='75' y='70' text-anchor='middle' dy='.3em' fill='%23666' font-family='Arial' font-size='12'>${levelData.icon}</text><text x='75' y='90' text-anchor='middle' dy='.3em' fill='%23666' font-family='Arial' font-size='8'>${levelData.subtitle}</text></svg>`;
                }
                
                img.onerror = () => {
                    img.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'><rect width='150' height='150' fill='%23333'/><text x='75' y='70' text-anchor='middle' dy='.3em' fill='%23666' font-family='Arial' font-size='12'>${levelData.icon}</text><text x='75' y='90' text-anchor='middle' dy='.3em' fill='%23666' font-family='Arial' font-size='8'>${levelData.subtitle}</text></svg>`;
                };
                
                img.alt = `Memory from ${levelData.subtitle}`;
                montageGrid.appendChild(img);
            }
        });
    }

    // ===== AUDIO MANAGEMENT =====
    setupMusic() {
        // Initialize audio elements but don't autoplay
        this.backgroundMusic = document.getElementById('background-music');
        this.coinSound = document.getElementById('coin-sound');
        this.completeSound = document.getElementById('complete-sound');
        
        // Set volume levels
        if (this.backgroundMusic) this.backgroundMusic.volume = 0.3;
        if (this.coinSound) this.coinSound.volume = 0.5;
        if (this.completeSound) this.completeSound.volume = 0.7;
        
        console.log('🍄 Audio setup complete');
    }

    initializeAudio() {
        // Initialize audio elements but don't autoplay
        this.backgroundMusic = document.getElementById('background-music');
        this.coinSound = document.getElementById('coin-sound');
        this.completeSound = document.getElementById('complete-sound');
        
        // Set volume levels
        if (this.backgroundMusic) this.backgroundMusic.volume = 0.3;
        if (this.coinSound) this.coinSound.volume = 0.5;
        if (this.completeSound) this.completeSound.volume = 0.7;
    }

    toggleMusic() {
        const musicBtn = document.getElementById('music-toggle');
        
        if (this.musicPlaying) {
            this.backgroundMusic.pause();
            this.musicPlaying = false;
            musicBtn.textContent = '🔇';
            musicBtn.classList.remove('playing');
            musicBtn.title = 'Music Off - Click to Enable';
            this.showNotification('🔇 Music disabled', 'info', 1500);
        } else {
            this.backgroundMusic.play().catch(e => console.log('Audio play failed:', e));
            this.musicPlaying = true;
            musicBtn.textContent = '🎵';
            musicBtn.classList.add('playing');
            musicBtn.title = 'Music On - Click to Mute';
            this.showNotification('🎵 Music enabled!', 'success', 1500);
        }
        
        // Add click effect
        musicBtn.style.transform = 'scale(0.8)';
        setTimeout(() => {
            musicBtn.style.transform = '';
        }, 150);
    }

    playSound(soundType) {
        try {
            if (soundType === 'coin' && this.coinSound) {
                this.coinSound.currentTime = 0;
                this.coinSound.play();
            } else if (soundType === 'complete' && this.completeSound) {
                this.completeSound.currentTime = 0;
                this.completeSound.play();
            }
        } catch (e) {
            console.log('Sound play failed:', e);
        }
    }

    // ===== GAME PROGRESS =====
    loadProgress() {
        const saved = localStorage.getItem('super-dad-world-progress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.completedLevels = new Set(progress.completedLevels || []);
            return progress;
        }
        return {
            completedLevels: [],
            stories: {}
        };
    }

    saveProgress() {
        this.gameProgress.completedLevels = Array.from(this.completedLevels);
        localStorage.setItem('super-dad-world-progress', JSON.stringify(this.gameProgress));
    }

    resetGame() {
        console.log('🍄 Resetting game...');
        
        // Clear progress but keep photos accessible
        this.completedLevels.clear();
        this.currentLevel = 1;
        
        // Save the reset state
        this.saveProgress();
        
        // Hide modal and return to start
        this.hideResetModal();
        this.showScreen('start-screen');
        this.updateWorldMap();
        
        console.log('🍄 Game reset complete!');
    }

    // ===== KEYBOARD CONTROLS =====
    handleKeyboard(e) {
        switch (e.key) {
            case 'Escape':
                if (this.currentScreen === 'level-screen') {
                    this.showScreen('world-map');
                }
                break;
            case 'Enter':
                if (this.currentScreen === 'start-screen') {
                    document.getElementById('start-btn').click();
                } else if (this.currentScreen === 'level-screen') {
                    if (e.ctrlKey || e.metaKey) {
                        document.getElementById('save-story').click();
                    }
                }
                break;
            case 'm':
            case 'M':
                this.toggleMusic();
                break;
        }
    }

    // ===== SHARING =====
    shareJourney() {
        // Create a shareable message
        const message = `🎮 I just completed Super Dad World! 🍄\n\n` +
                       `🏆 Memories Collected: ${this.completedLevels.size}/7\n` +
                       `❤️ A beautiful journey through ${this.completedLevels.size} life stages with Dad!\n\n` +
                       `#SuperDadWorld #FathersDay #Gaming #Memories`;
        
        // Try to use Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: 'Super Dad World - My Journey',
                text: message,
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(message).then(() => {
                alert('Journey details copied to clipboard! Share it with your friends!');
            }).catch(() => {
                // Final fallback: show message
                alert(message);
            });
        }
    }

    // ===== PHOTO GALLERY =====
    showPhotoGallery() {
        this.showScreen('photo-gallery-screen');
        this.populatePhotoGallery();
    }

    populatePhotoGallery() {
        const galleryGrid = document.getElementById('gallery-photos');
        if (!galleryGrid) return;

        // Map of actual photo filenames for each level
        const photoFilenames = {
            1: 'DSC00794.JPG',      // baby-years
            2: 'IMG_4081.JPG',      // early-childhood  
            3: 'IMG_2753.JPG',      // elementary-days
            4: 'IMG_0003.JPG',      // middle-school
            5: 'IMG_0214.jpeg',     // early-teens
            6: 'IMG_0059.JPG',      // mid-teens
            7: 'IMG_0063.JPG'       // late-teens
        };

        const levelTitles = {
            1: 'Baby Years (0-2)',
            2: 'Early Childhood (3-5)', 
            3: 'Elementary Days (6-8)',
            4: 'Middle School (9-11)',
            5: 'Early Teens (12-14)',
            6: 'Mid Teens (15-17)',
            7: 'Late Teens (18-19)'
        };

        const photoDescriptions = {
            1: 'The sweetest beginning - where our incredible journey started ❤️',
            2: 'First steps, first words, first adventures together 👶',
            3: 'School days and growing dreams with Dad by my side 🎒',
            4: 'Learning, laughing, and navigating new challenges 📚',
            5: 'Finding my way with Dad\'s wisdom guiding me ⚡',
            6: 'Growing stronger and more independent every day 🏆',
            7: 'Ready for the world, thanks to everything Dad taught me 👑'
        };

        galleryGrid.innerHTML = '';

        // Only show completed levels
        for (let level = 1; level <= 7; level++) {
            if (this.completedLevels.has(level)) {
                const photoItem = document.createElement('div');
                photoItem.className = 'gallery-photo-item';
                
                const filename = photoFilenames[level];
                const folderName = this.levelData[level].folder;
                const levelIcon = this.levelData[level].icon;
                
                photoItem.innerHTML = `
                    <div class="photo-wrapper">
                        <img src="assets/images/${folderName}/${filename}" 
                             alt="${levelTitles[level]}" 
                             class="gallery-photo"
                             onerror="this.src='assets/images/placeholder.jpg'"
                             loading="lazy">
                        <div class="photo-overlay">
                            <span class="photo-icon">${levelIcon}</span>
                            <p class="photo-description">${photoDescriptions[level]}</p>
                        </div>
                    </div>
                    <h3 class="gallery-photo-title">${levelTitles[level]}</h3>
                `;
                
                // Add click effect for photos
                photoItem.addEventListener('click', () => {
                    this.showPhotoModal(level, filename, folderName, levelTitles[level], photoDescriptions[level]);
                });
                
                galleryGrid.appendChild(photoItem);
            }
        }

        // If no photos yet, show beautiful empty message
        if (this.completedLevels.size === 0) {
            galleryGrid.innerHTML = `
                <div class="gallery-empty">
                    <div class="empty-icon">📸</div>
                    <h3>Your Memory Gallery Awaits!</h3>
                    <p>Complete levels to unlock precious photos and memories from your journey with Dad.</p>
                    <div class="empty-progress">
                        <div class="progress-dots">
                            <span class="dot"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                        </div>
                        <p>Start your adventure to collect memories!</p>
                    </div>
                </div>
            `;
        }
    }

    showPhotoModal(level, filename, folderName, title, description) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'photo-modal';
        modal.innerHTML = `
            <div class="photo-modal-content">
                <button class="photo-modal-close">&times;</button>
                <img src="assets/images/${folderName}/${filename}" alt="${title}" class="modal-photo">
                <div class="modal-info">
                    <h2>${title}</h2>
                    <p>${description}</p>
                    <div class="modal-actions">
                        <button class="modal-btn download-btn" onclick="window.open('assets/images/${folderName}/${filename}', '_blank')">
                            💾 Save Photo
                        </button>
                        <button class="modal-btn share-btn" onclick="this.sharePhoto('${title}', '${description}')">
                            📤 Share Memory
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add to page
        document.body.appendChild(modal);

        // Add event listeners
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('photo-modal-close')) {
                this.closePhotoModal(modal);
            }
        });

        // Animate in
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
    }

    closePhotoModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    // ===== RESET FUNCTIONALITY =====
    showResetModal() {
        const modal = document.getElementById('reset-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    hideResetModal() {
        const modal = document.getElementById('reset-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    loadLevelPhoto(levelNum) {
        const levelData = this.levelData[levelNum];
        const photo = document.getElementById('level-photo');
        
        // Map of actual photo filenames for each level
        const photoFilenames = {
            1: 'DSC00794.JPG',      // baby-years
            2: 'IMG_4081.JPG',      // early-childhood  
            3: 'IMG_2753.JPG',      // elementary-days
            4: 'IMG_0003.JPG',      // middle-school
            5: 'IMG_0214.jpeg',     // early-teens
            6: 'IMG_0059.JPG',      // mid-teens
            7: 'IMG_0063.JPG'       // late-teens
        };
        
        // Try to load actual photo with correct filename
        const actualFilename = photoFilenames[levelNum];
        if (actualFilename) {
            photo.src = `assets/images/${levelData.folder}/${actualFilename}`;
            photo.onerror = () => {
                // Fallback to placeholder if photo fails to load
                photo.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='250' height='250' viewBox='0 0 250 250'><defs><linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%23007bff;stop-opacity:1' /><stop offset='100%' style='stop-color:%231a1a2e;stop-opacity:1' /></linearGradient></defs><rect width='250' height='250' fill='url(%23grad)'/><text x='125' y='100' text-anchor='middle' dy='.3em' fill='%23fff' font-family='Arial' font-size='50'>${levelData.icon}</text><text x='125' y='150' text-anchor='middle' dy='.3em' fill='%23ccc' font-family='Arial' font-size='18'>${levelData.subtitle}</text><text x='125' y='180' text-anchor='middle' dy='.3em' fill='%23999' font-family='Arial' font-size='12'>Photo Placeholder</text></svg>`;
            };
        } else {
            // Fallback to placeholder
            photo.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='250' height='250' viewBox='0 0 250 250'><defs><linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%23007bff;stop-opacity:1' /><stop offset='100%' style='stop-color:%231a1a2e;stop-opacity:1' /></linearGradient></defs><rect width='250' height='250' fill='url(%23grad)'/><text x='125' y='100' text-anchor='middle' dy='.3em' fill='%23fff' font-family='Arial' font-size='50'>${levelData.icon}</text><text x='125' y='150' text-anchor='middle' dy='.3em' fill='%23ccc' font-family='Arial' font-size='18'>${levelData.subtitle}</text><text x='125' y='180' text-anchor='middle' dy='.3em' fill='%23999' font-family='Arial' font-size='12'>Photo Placeholder</text></svg>`;
        }
    }

    drawCharacterPreviews() {
        // Draw Mario preview
        const marioCanvas = document.getElementById('mario-preview');
        if (marioCanvas) {
            const ctx = marioCanvas.getContext('2d');
            ctx.clearRect(0, 0, 64, 64);
            this.drawMarioPreview(ctx, 16, 8);
        }
        
        // Draw Luigi preview
        const luigiCanvas = document.getElementById('luigi-preview');
        if (luigiCanvas) {
            const ctx = luigiCanvas.getContext('2d');
            ctx.clearRect(0, 0, 64, 64);
            this.drawLuigiPreview(ctx, 16, 6);
        }
        
        // Draw Donkey Kong preview
        const donkeyCanvas = document.getElementById('donkey-preview');
        if (donkeyCanvas) {
            const ctx = donkeyCanvas.getContext('2d');
            ctx.clearRect(0, 0, 64, 64);
            this.drawDonkeyPreview(ctx, 16, 4);
        }
    }
    
    drawMarioPreview(ctx, x, y) {
        // Mario preview sprite - simplified version
        // Hat (red)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(x + 4, y + 1, 8, 4);
        ctx.fillRect(x + 2, y + 3, 12, 3);
        
        // Hat brim
        ctx.fillStyle = '#CC0000';
        ctx.fillRect(x + 2, y + 5, 12, 1);
        
        // Face (peach)
        ctx.fillStyle = '#FFDBAC';
        ctx.fillRect(x + 4, y + 6, 8, 6);
        ctx.fillRect(x + 3, y + 7, 10, 4);
        
        // Eyes (black)
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 6, y + 7, 1, 1);
        ctx.fillRect(x + 9, y + 7, 1, 1);
        
        // Mustache (brown)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 6, y + 9, 4, 1);
        
        // Shirt (red)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(x + 5, y + 11, 6, 3);
        
        // Overalls (blue)
        ctx.fillStyle = '#0066CC';
        ctx.fillRect(x + 4, y + 12, 8, 7);
        
        // Overall straps
        ctx.fillRect(x + 5, y + 11, 1, 3);
        ctx.fillRect(x + 10, y + 11, 1, 3);
        
        // Buttons (yellow)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(x + 5, y + 13, 1, 1);
        ctx.fillRect(x + 10, y + 15, 1, 1);
        
        // Arms (peach)
        ctx.fillStyle = '#FFDBAC';
        ctx.fillRect(x + 1, y + 12, 3, 4);
        ctx.fillRect(x + 12, y + 12, 3, 4);
        
        // Gloves (white)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 1, y + 14, 3, 2);
        ctx.fillRect(x + 12, y + 14, 3, 2);
        
        // Legs (blue)
        ctx.fillStyle = '#0066CC';
        ctx.fillRect(x + 5, y + 19, 2, 3);
        ctx.fillRect(x + 9, y + 19, 2, 3);
        
        // Shoes (brown)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 4, y + 20, 4, 2);
        ctx.fillRect(x + 8, y + 20, 4, 2);
        
        // "M" emblem on hat
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '4px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('M', x + 8, y + 4);
    }
    
    drawLuigiPreview(ctx, x, y) {
        // Luigi preview sprite - simplified version
        // Hat (green)
        ctx.fillStyle = '#00AA00';
        ctx.fillRect(x + 4, y + 1, 8, 4);
        ctx.fillRect(x + 2, y + 3, 12, 3);
        
        // Hat brim
        ctx.fillStyle = '#008800';
        ctx.fillRect(x + 2, y + 5, 12, 1);
        
        // Face (peach) - slightly longer
        ctx.fillStyle = '#FFDBAC';
        ctx.fillRect(x + 4, y + 6, 8, 7);
        ctx.fillRect(x + 3, y + 7, 10, 5);
        
        // Eyes (black)
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 6, y + 8, 1, 1);
        ctx.fillRect(x + 9, y + 8, 1, 1);
        
        // Mustache (brown)
        ctx.fillStyle = '#654321';
        ctx.fillRect(x + 5, y + 10, 6, 1);
        
        // Shirt (green)
        ctx.fillStyle = '#00AA00';
        ctx.fillRect(x + 5, y + 12, 6, 3);
        
        // Overalls (dark blue)
        ctx.fillStyle = '#003366';
        ctx.fillRect(x + 4, y + 13, 8, 7);
        
        // Overall straps
        ctx.fillRect(x + 5, y + 12, 1, 3);
        ctx.fillRect(x + 10, y + 12, 1, 3);
        
        // Buttons (yellow)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(x + 5, y + 14, 1, 1);
        ctx.fillRect(x + 10, y + 16, 1, 1);
        
        // Arms (peach)
        ctx.fillStyle = '#FFDBAC';
        ctx.fillRect(x + 1, y + 13, 3, 4);
        ctx.fillRect(x + 12, y + 13, 3, 4);
        
        // Gloves (white)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 1, y + 15, 3, 2);
        ctx.fillRect(x + 12, y + 15, 3, 2);
        
        // Legs (dark blue)
        ctx.fillStyle = '#003366';
        ctx.fillRect(x + 5, y + 20, 2, 3);
        ctx.fillRect(x + 9, y + 20, 2, 3);
        
        // Shoes (brown)
        ctx.fillStyle = '#654321';
        ctx.fillRect(x + 4, y + 21, 4, 2);
        ctx.fillRect(x + 8, y + 21, 4, 2);
        
        // "L" emblem on hat
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '4px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('L', x + 8, y + 4);
    }
    
    drawDonkeyPreview(ctx, x, y) {
        // Donkey Kong preview sprite - simplified version
        // Head (brown)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 2, y + 1, 12, 9);
        ctx.fillRect(x + 1, y + 4, 14, 6);
        
        // Face (tan)
        ctx.fillStyle = '#D2691E';
        ctx.fillRect(x + 4, y + 5, 8, 6);
        ctx.fillRect(x + 5, y + 4, 6, 8);
        
        // Eyes (white)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 5, y + 5, 2, 2);
        ctx.fillRect(x + 9, y + 5, 2, 2);
        
        // Eye pupils (black)
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 5, y + 5, 1, 1);
        ctx.fillRect(x + 9, y + 5, 1, 1);
        
        // Nostrils (black)
        ctx.fillRect(x + 7, y + 7, 1, 1);
        ctx.fillRect(x + 8, y + 7, 1, 1);
        
        // Body (brown)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 2, y + 11, 12, 10);
        ctx.fillRect(x + 1, y + 13, 14, 8);
        
        // Chest (tan)
        ctx.fillStyle = '#D2691E';
        ctx.fillRect(x + 5, y + 12, 6, 7);
        ctx.fillRect(x + 4, y + 14, 8, 5);
        
        // Red tie
        ctx.fillStyle = '#CC0000';
        ctx.fillRect(x + 7, y + 12, 2, 8);
        ctx.fillRect(x + 6, y + 14, 4, 6);
        
        // Tie knot
        ctx.fillStyle = '#990000';
        ctx.fillRect(x + 6, y + 12, 4, 3);
        
        // Arms (brown)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x, y + 13, 4, 6);
        ctx.fillRect(x + 12, y + 13, 4, 6);
        
        // Hands (tan)
        ctx.fillStyle = '#D2691E';
        ctx.fillRect(x - 1, y + 18, 5, 3);
        ctx.fillRect(x + 12, y + 18, 5, 3);
        
        // Legs (brown)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 4, y + 21, 3, 4);
        ctx.fillRect(x + 9, y + 21, 3, 4);
        
        // Feet (dark brown)
        ctx.fillStyle = '#654321';
        ctx.fillRect(x + 2, y + 23, 6, 2);
        ctx.fillRect(x + 8, y + 23, 6, 2);
        
        // "DK" on tie
        ctx.fillStyle = '#FFFF00';
        ctx.font = '3px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('DK', x + 8, y + 16);
    }
}

// ===== ADDITIONAL UTILITIES =====

// Mario-style animations
function addMarioJump(element) {
    element.style.transform = 'translateY(-10px)';
    setTimeout(() => {
        element.style.transform = 'translateY(0)';
    }, 200);
}

// Power-up effect for buttons
function addPowerUpEffect(element) {
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = 'questionPulse 0.5s ease-in-out 3';
    }, 10);
}

// Coin collection animation
function animateCoinCollection(x, y) {
    const coin = document.createElement('div');
    coin.textContent = '🪙';
    coin.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: 2rem;
        pointer-events: none;
        z-index: 1000;
        animation: coinCollect 1s ease-out forwards;
    `;
    
    document.body.appendChild(coin);
    
    setTimeout(() => {
        coin.remove();
    }, 1000);
}

// Add coin collection animation to CSS (injected dynamically)
const coinAnimationCSS = `
@keyframes coinCollect {
    0% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
    50% {
        transform: translateY(-50px) scale(1.2);
        opacity: 1;
    }
    100% {
        transform: translateY(-100px) scale(0);
        opacity: 0;
    }
}
`;

// Inject animation CSS
const style = document.createElement('style');
style.textContent = coinAnimationCSS;
document.head.appendChild(style);

// ===== INITIALIZE GAME =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🍄 DOM Content Loaded event fired!');
    
    try {
        console.log('🍄 Creating SuperDadWorld instance...');
        window.game = new SuperDadWorld();
        console.log('🍄 Game instance created successfully:', window.game);
    } catch (error) {
        console.error('🍄 ERROR creating game instance:', error);
    }
    
    // Add some Mario-style interactivity to buttons
    console.log('🍄 Adding button interactions...');
    document.querySelectorAll('.mario-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            console.log('🍄 Mario button clicked:', this);
            addMarioJump(this);
            
            // Add coin animation at click position
            const rect = this.getBoundingClientRect();
            animateCoinCollection(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2
            );
        });
    });
    
    // Add hover effects to world levels
    console.log('🍄 Adding hover effects...');
    document.querySelectorAll('.world-level').forEach(level => {
        level.addEventListener('mouseenter', function() {
            if (!this.classList.contains('locked')) {
                addPowerUpEffect(this);
            }
        });
    });
    
    console.log('🍄 Super Dad World initialized! Press M to toggle music, ESC to go back.');
    
    // Additional debugging - check if CSS is loaded
    const startScreen = document.getElementById('start-screen');
    if (startScreen) {
        const styles = window.getComputedStyle(startScreen);
        console.log('🍄 Start screen display style:', styles.display);
        console.log('🍄 Start screen has active class:', startScreen.classList.contains('active'));
    }
});