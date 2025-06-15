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
                storyPlaceholder: "Write about your earliest memories with Dad, those precious baby moments..."
            },
            2: {
                title: "World 1-2: Early Childhood (3-5)",
                subtitle: "First Steps Hero",
                icon: "🧒",
                folder: "early-childhood",
                placeholder: "assets/images/early-childhood/placeholder.jpg",
                caption: "Taking first steps into adventure...",
                storyPlaceholder: "Share memories of learning to walk, talk, and explore the world with Dad's guidance..."
            },
            3: {
                title: "World 2-1: Elementary Days (6-8)",
                subtitle: "School Zone Explorer",
                icon: "🎒",
                folder: "elementary-days",
                placeholder: "assets/images/elementary-days/placeholder.jpg",
                caption: "School adventures and growing wisdom...",
                storyPlaceholder: "Remember the school days, homework help, and Dad's encouragement in learning..."
            },
            4: {
                title: "World 2-2: Middle School (9-11)",
                subtitle: "Growing Up Quest",
                icon: "📚",
                folder: "middle-school",
                placeholder: "assets/images/middle-school/placeholder.jpg",
                caption: "Navigating new challenges together...",
                storyPlaceholder: "Those middle school years - Dad's support through growing pains and new discoveries..."
            },
            5: {
                title: "World 3-1: Early Teens (12-14)",
                subtitle: "Teenage Warrior",
                icon: "⚡",
                folder: "early-teens",
                placeholder: "assets/images/early-teens/placeholder.jpg",
                caption: "Finding strength and identity...",
                storyPlaceholder: "The teenage transition - Dad's patience and wisdom during those challenging years..."
            },
            6: {
                title: "World 3-2: Mid Teens (15-17)",
                subtitle: "Level Up Champion",
                icon: "🏆",
                folder: "mid-teens",
                placeholder: "assets/images/mid-teens/placeholder.jpg",
                caption: "Achieving new milestones...",
                storyPlaceholder: "High school adventures, driving lessons, and Dad's trust in your growing independence..."
            },
            7: {
                title: "World 4-1: Late Teens (18-19)",
                subtitle: "Final Boss: Adulthood",
                icon: "👑",
                folder: "late-teens",
                placeholder: "assets/images/late-teens/placeholder.jpg",
                caption: "Ready to conquer the world...",
                storyPlaceholder: "Approaching adulthood - Dad's pride in who you've become and lessons for the future..."
            }
        };
    }

    init() {
        console.log('🍄 Initializing Super Dad World...');
        this.setupEventListeners();
        this.loadProgress();
        this.showScreen('start-screen');
        this.setupMusic();
        this.drawCharacterPreviews();
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
                }
            });
        });

        // Back button
        const backBtn = document.getElementById('back-to-world');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                console.log('🍄 Back to world clicked');
                this.showScreen('world-map');
                this.updateWorldMap();
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
                console.log('🍄 Cancel reset clicked');
                this.hideResetModal();
            });
        }

        const confirmResetBtn = document.getElementById('confirm-reset');
        if (confirmResetBtn) {
            confirmResetBtn.addEventListener('click', () => {
                console.log('🍄 Confirm reset clicked');
                this.resetGame();
            });
        }

        // Music controls
        const musicToggle = document.getElementById('music-toggle');
        if (musicToggle) {
            musicToggle.addEventListener('click', () => {
                this.toggleMusic();
            });
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

    // ===== SCREEN MANAGEMENT =====
    showScreen(screenId) {
        console.log(`🍄 Showing screen: ${screenId}`);
        
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            
            // Special handling for different screens
            if (screenId === 'world-map') {
                this.updateWorldMap();
            } else if (screenId === 'victory-screen') {
                this.setupVictoryScreen();
            } else if (screenId === 'character-select') {
                // Redraw character previews when showing character selection
                setTimeout(() => this.drawCharacterPreviews(), 100);
            }
        }
        
        this.currentScreen = screenId;
    }

    // ===== LEVEL MANAGEMENT =====
    isLevelUnlocked(levelNum) {
        if (levelNum === 1) return true;
        return this.completedLevels.has(levelNum - 1);
    }

    enterLevel(levelNum) {
        this.currentLevel = levelNum;
        const levelData = this.levelData[levelNum];
        
        // Update level display
        document.getElementById('current-level-title').textContent = levelData.title;
        
        // Update placeholder section
        const levelIconDisplay = document.getElementById('level-icon-display');
        const challengeDescription = document.getElementById('challenge-description');
        
        if (levelIconDisplay) {
            levelIconDisplay.textContent = levelData.icon;
        }
        
        if (challengeDescription) {
            const challenges = {
                1: "Easy jumps - collect 2 coins and reach the flag!",
                2: "More platforms - collect 2 coins and reach the flag!",
                3: "Question blocks - collect 3 coins and reach the flag!",
                4: "Avoid enemies - collect 3 coins and reach the flag!",
                5: "Moving platforms - collect 3 coins and reach the flag!",
                6: "Advanced course - collect 4 coins and reach the flag!",
                7: "Final challenge - collect 4 coins and reach the flag!"
            };
            challengeDescription.textContent = challenges[levelNum] || "Complete the Mario challenge!";
        }
        
        // Show level screen
        this.showScreen('level-screen');
        
        // Initialize Mario mini-game
        setTimeout(() => {
            if (window.currentMarioGame) {
                window.currentMarioGame = null;
            }
            // Pass the selected character to the mini-game
            window.currentMarioGame = new MarioMiniGame('mario-canvas', levelNum, this.selectedCharacter || 'mario');
            
            // Set up game completion callback
            window.currentMarioGame.onComplete = () => {
                console.log('🍄 Mario game completed!');
                this.revealPhoto();
                
                // Show complete button after a delay
                setTimeout(() => {
                    const completeBtn = document.getElementById('complete-level');
                    if (completeBtn) {
                        completeBtn.style.display = 'block';
                        completeBtn.disabled = false;
                    }
                }, 1000);
            };
        }, 100);
        
        // Load photo if level is already completed
        if (this.completedLevels.has(levelNum)) {
            this.loadLevelPhoto(levelNum);
            const completeBtn = document.getElementById('complete-level');
            if (completeBtn) {
                completeBtn.style.display = 'block';
                completeBtn.disabled = false;
            }
        } else {
            // Hide photo section and complete button for uncompleted levels
            const photoReveal = document.querySelector('.photo-reveal');
            const photoPlaceholder = document.querySelector('.photo-placeholder');
            const completeBtn = document.getElementById('complete-level');
            
            if (photoReveal) photoReveal.style.display = 'none';
            if (photoPlaceholder) photoPlaceholder.style.display = 'block';
            if (completeBtn) {
                completeBtn.style.display = 'none';
                completeBtn.disabled = true;
            }
        }
    }

    revealPhoto() {
        console.log('🍄 Revealing photo for level', this.currentLevel);
        
        // Hide placeholder, show photo
        const photoPlaceholder = document.querySelector('.photo-placeholder');
        const photoReveal = document.querySelector('.photo-reveal');
        
        if (photoPlaceholder) photoPlaceholder.style.display = 'none';
        if (photoReveal) photoReveal.style.display = 'block';
        
        // Load the actual photo
        this.loadLevelPhoto(this.currentLevel);
        
        // Play completion sound
        this.playSound('level-complete');
    }

    completeLevel() {
        if (!this.canCompleteLevel()) return;
        
        this.completedLevels.add(this.currentLevel);
        this.gameProgress.completedLevels = Array.from(this.completedLevels);
        this.saveProgress();
        
        this.playSound('complete');
        
        // Check if all levels completed
        if (this.completedLevels.size === Object.keys(this.levelData).length) {
            setTimeout(() => {
                this.showScreen('victory-screen');
            }, 1500);
        } else {
            // Return to world map
            setTimeout(() => {
                this.showScreen('world-map');
            }, 1500);
        }
        
        // Visual feedback
        const completeBtn = document.getElementById('complete-level');
        completeBtn.textContent = 'Level Complete!';
        completeBtn.style.background = 'linear-gradient(45deg, #ffd700, #ffed4a)';
        completeBtn.style.color = '#000000';
    }

    canCompleteLevel() {
        // Now only requires Mario game completion (no story needed)
        const photoReveal = document.getElementById('photo-reveal');
        return photoReveal.style.display === 'block';
    }

    updateLevelProgress() {
        const photoReveal = document.getElementById('photo-reveal');
        
        let progress = 0;
        
        // Mario game completed: 100%
        if (photoReveal.style.display === 'block') {
            progress = 100;
        }
        
        // Update progress bar
        document.getElementById('level-progress-fill').style.width = progress + '%';
        document.getElementById('progress-text').textContent = progress + '%';
        
        // Enable/disable complete button
        const completeBtn = document.getElementById('complete-level');
        if (completeBtn) {
            completeBtn.disabled = progress < 100;
        }
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
        if (this.musicPlaying) {
            this.backgroundMusic.pause();
            this.musicPlaying = false;
            document.getElementById('music-toggle').textContent = '🔇';
        } else {
            this.backgroundMusic.play().catch(e => console.log('Audio play failed:', e));
            this.musicPlaying = true;
            document.getElementById('music-toggle').textContent = '🎵';
        }
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

        galleryGrid.innerHTML = '';

        // Only show completed levels
        for (let level = 1; level <= 7; level++) {
            if (this.completedLevels.has(level)) {
                const photoItem = document.createElement('div');
                photoItem.className = 'gallery-photo-item';
                
                const filename = photoFilenames[level];
                const folderName = this.levelData[level].folder;
                
                photoItem.innerHTML = `
                    <img src="assets/images/${folderName}/${filename}" 
                         alt="${levelTitles[level]}" 
                         class="gallery-photo"
                         onerror="this.src='assets/images/placeholder.jpg'">
                    <h3 class="gallery-photo-title">${levelTitles[level]}</h3>
                `;
                
                galleryGrid.appendChild(photoItem);
            }
        }

        // If no photos yet, show message
        if (this.completedLevels.size === 0) {
            galleryGrid.innerHTML = `
                <div class="gallery-empty">
                    <h3>No Photos Yet!</h3>
                    <p>Complete levels to unlock photos in your gallery.</p>
                </div>
            `;
        }
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