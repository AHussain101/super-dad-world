// ===== MARIO MINI-GAME ENGINE =====
class MarioMiniGame {
    constructor(canvasId, level, character = 'mario') {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.level = level;
        this.character = character;
        this.gameCompleted = false;
        this.gameStarted = false;
        
        // Game dimensions - MUCH BIGGER!
        this.canvas.width = 800;
        this.canvas.height = 500;
        
        // Game state
        this.camera = { x: 0, y: 0 };
        this.keys = {};
        this.coinsCollected = 0;
        this.coinsNeeded = this.getCoinsNeeded();
        this.animationFrame = 0;
        this.score = 0;
        this.particles = [];
        this.powerUps = [];
        
        // Character stats based on selection
        this.characterStats = this.getCharacterStats(character);
        
        // Game objects
        this.mario = {
            x: 80,
            y: 400,
            width: 32,
            height: 42,
            vx: 0,
            vy: 0,
            onGround: false,
            direction: 1, // 1 for right, -1 for left
            isJumping: false,
            isPowered: false,
            powerTimer: 0,
            character: character
        };
        
        this.platforms = this.generatePlatforms();
        this.coins = this.generateCoins();
        this.enemies = this.generateEnemies();
        this.goal = this.generateGoal();
        this.clouds = this.generateClouds();
        this.pipes = this.generatePipes();
        this.decorations = this.generateDecorations();
        
        this.setupEventListeners();
        
        // Auto-start the game immediately
        this.start();
    }
    
    getCoinsNeeded() {
        return [0, 2, 2, 3, 3, 3, 4, 4][this.level] || 2;
    }
    
    getCharacterStats(character) {
        const stats = {
            mario: {
                speed: 4,
                jumpPower: 12,
                acceleration: 0.6,
                friction: 0.85,
                gravity: 0.5,
                color: '#FF0000',
                name: 'Mario'
            },
            luigi: {
                speed: 3.5,
                jumpPower: 15,
                acceleration: 0.5,
                friction: 0.9,
                gravity: 0.4,
                color: '#00FF00',
                name: 'Luigi'
            },
            donkey: {
                speed: 5,
                jumpPower: 10,
                acceleration: 0.8,
                friction: 0.8,
                gravity: 0.6,
                color: '#8B4513',
                name: 'Donkey Kong'
            }
        };
        return stats[character] || stats.mario;
    }
    
    generateClouds() {
        return [
            { x: 120, y: 60, width: 80, height: 40 },
            { x: 350, y: 50, width: 100, height: 45 },
            { x: 580, y: 70, width: 90, height: 35 },
            { x: 50, y: 90, width: 70, height: 30 },
            { x: 650, y: 40, width: 85, height: 38 }
        ];
    }
    
    generatePipes() {
        const pipes = [];
        if (this.level >= 3) {
            pipes.push({ x: 550, y: 350, width: 60, height: 100, color: '#00AA00' });
        }
        if (this.level >= 5) {
            pipes.push({ x: 250, y: 320, width: 60, height: 130, color: '#00AA00' });
        }
        if (this.level >= 6) {
            pipes.push({ x: 680, y: 300, width: 60, height: 150, color: '#00AA00' });
        }
        return pipes;
    }
    
    generateDecorations() {
        return [
            { type: 'bush', x: 200, y: 430, width: 60, height: 30 },
            { type: 'bush', x: 400, y: 430, width: 80, height: 35 },
            { type: 'hill', x: 600, y: 400, width: 120, height: 50 },
            { type: 'castle', x: 720, y: 300, width: 60, height: 150 }
        ];
    }
    
    generatePlatforms() {
        const platforms = [
            // Ground - classic brick pattern
            { x: 0, y: 450, width: 800, height: 50, color: '#D2691E', type: 'ground' }
        ];
        
        switch(this.level) {
            case 1: // Baby Years - Very easy
                platforms.push(
                    { x: 180, y: 400, width: 120, height: 25, color: '#D2691E', type: 'brick' },
                    { x: 380, y: 350, width: 120, height: 25, color: '#D2691E', type: 'brick' },
                    { x: 580, y: 300, width: 100, height: 25, color: '#D2691E', type: 'brick' }
                );
                break;
                
            case 2: // Early Childhood - Easy
                platforms.push(
                    { x: 150, y: 400, width: 100, height: 25, color: '#D2691E', type: 'brick' },
                    { x: 320, y: 350, width: 100, height: 25, color: '#D2691E', type: 'brick' },
                    { x: 480, y: 300, width: 100, height: 25, color: '#D2691E', type: 'brick' },
                    { x: 640, y: 250, width: 100, height: 25, color: '#D2691E', type: 'brick' }
                );
                break;
                
            case 3: // Elementary - Question blocks
                platforms.push(
                    { x: 120, y: 400, width: 80, height: 25, color: '#D2691E', type: 'brick' },
                    { x: 280, y: 350, width: 25, height: 25, color: '#FFD700', type: 'question' },
                    { x: 380, y: 300, width: 100, height: 25, color: '#D2691E', type: 'brick' },
                    { x: 580, y: 250, width: 100, height: 25, color: '#D2691E', type: 'brick' },
                    { x: 320, y: 200, width: 25, height: 25, color: '#FFD700', type: 'question' }
                );
                break;
                
            case 4: // Middle School - More variety
                platforms.push(
                    { x: 180, y: 400, width: 80, height: 25, color: '#D2691E', type: 'brick' },
                    { x: 320, y: 350, width: 25, height: 25, color: '#FFD700', type: 'question' },
                    { x: 400, y: 350, width: 80, height: 25, color: '#D2691E', type: 'brick' },
                    { x: 560, y: 280, width: 100, height: 25, color: '#D2691E', type: 'brick' },
                    { x: 380, y: 200, width: 25, height: 25, color: '#FFD700', type: 'question' }
                );
                break;
                
            case 5: // Early Teens - Moving platforms (easier)
                platforms.push(
                    { x: 150, y: 400, width: 100, height: 25, color: '#32CD32', type: 'moving', moveSpeed: 1, moveRange: 80, originalX: 150 },
                    { x: 400, y: 320, width: 100, height: 25, color: '#32CD32', type: 'moving', moveSpeed: -1.2, moveRange: 100, originalX: 400 },
                    { x: 620, y: 250, width: 80, height: 25, color: '#D2691E', type: 'brick' },
                    { x: 320, y: 180, width: 25, height: 25, color: '#FFD700', type: 'question' }
                );
                break;
                
            case 6: // Mid Teens - Moderate challenge
                platforms.push(
                    { x: 120, y: 400, width: 70, height: 25, color: '#D2691E', type: 'brick' },
                    { x: 250, y: 350, width: 25, height: 25, color: '#FFD700', type: 'question' },
                    { x: 340, y: 300, width: 80, height: 25, color: '#D2691E', type: 'brick' },
                    { x: 480, y: 250, width: 80, height: 25, color: '#32CD32', type: 'moving', moveSpeed: 1.5, moveRange: 60, originalX: 480 },
                    { x: 620, y: 200, width: 80, height: 25, color: '#D2691E', type: 'brick' },
                    { x: 380, y: 150, width: 25, height: 25, color: '#FFD700', type: 'question' }
                );
                break;
                
            case 7: // Late Teens - Final challenge
                platforms.push(
                    { x: 150, y: 400, width: 80, height: 25, color: '#D2691E', type: 'brick' },
                    { x: 300, y: 350, width: 25, height: 25, color: '#FFD700', type: 'question' },
                    { x: 400, y: 300, width: 70, height: 25, color: '#D2691E', type: 'brick' },
                    { x: 540, y: 250, width: 80, height: 25, color: '#32CD32', type: 'moving', moveSpeed: -2, moveRange: 90, originalX: 540 },
                    { x: 680, y: 180, width: 80, height: 25, color: '#D2691E', type: 'brick' },
                    { x: 420, y: 120, width: 25, height: 25, color: '#FFD700', type: 'question' }
                );
                break;
        }
        
        return platforms;
    }
    
    generateCoins() {
        const coins = [];
        
        // Position coins based on level layout - easier positioning
        switch(this.level) {
            case 1: // Baby Years - 2 coins
                coins.push(
                    { x: 220, y: 370, width: 20, height: 20, collected: false },
                    { x: 420, y: 320, width: 20, height: 20, collected: false }
                );
                break;
                
            case 2: // Early Childhood - 2 coins
                coins.push(
                    { x: 180, y: 370, width: 20, height: 20, collected: false },
                    { x: 680, y: 220, width: 20, height: 20, collected: false }
                );
                break;
                
            case 3: // Elementary - 3 coins
                coins.push(
                    { x: 160, y: 370, width: 20, height: 20, collected: false },
                    { x: 420, y: 270, width: 20, height: 20, collected: false },
                    { x: 620, y: 220, width: 20, height: 20, collected: false }
                );
                break;
                
            case 4: // Middle School - 3 coins
                coins.push(
                    { x: 220, y: 370, width: 20, height: 20, collected: false },
                    { x: 440, y: 320, width: 20, height: 20, collected: false },
                    { x: 600, y: 250, width: 20, height: 20, collected: false }
                );
                break;
                
            case 5: // Early Teens - 3 coins
                coins.push(
                    { x: 200, y: 370, width: 20, height: 20, collected: false },
                    { x: 450, y: 290, width: 20, height: 20, collected: false },
                    { x: 660, y: 220, width: 20, height: 20, collected: false }
                );
                break;
                
            case 6: // Mid Teens - 4 coins
                coins.push(
                    { x: 160, y: 370, width: 20, height: 20, collected: false },
                    { x: 380, y: 270, width: 20, height: 20, collected: false },
                    { x: 520, y: 220, width: 20, height: 20, collected: false },
                    { x: 660, y: 170, width: 20, height: 20, collected: false }
                );
                break;
                
            case 7: // Late Teens - 4 coins
                coins.push(
                    { x: 190, y: 370, width: 20, height: 20, collected: false },
                    { x: 440, y: 270, width: 20, height: 20, collected: false },
                    { x: 580, y: 220, width: 20, height: 20, collected: false },
                    { x: 720, y: 150, width: 20, height: 20, collected: false }
                );
                break;
        }
        
        return coins;
    }
    
    generateEnemies() {
        // Fewer enemies, easier to avoid
        const enemies = [];
        
        if (this.level >= 5) {
            enemies.push({ x: 300, y: 420, width: 25, height: 25, vx: -0.6, type: 'goomba' });
        }
        
        if (this.level >= 7) {
            enemies.push({ x: 500, y: 420, width: 25, height: 25, vx: -0.8, type: 'goomba' });
        }
        
        return enemies;
    }
    
    generateGoal() {
        return { x: 720, y: 250, width: 40, height: 200, color: '#00ff00' };
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === ' ') e.preventDefault(); // Prevent page scroll
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Touch controls for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            
            if (x < this.canvas.width / 3) {
                this.keys['ArrowLeft'] = true;
            } else if (x > this.canvas.width * 2/3) {
                this.keys['ArrowRight'] = true;
            } else {
                this.keys[' '] = true; // Jump
            }
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys['ArrowLeft'] = false;
            this.keys['ArrowRight'] = false;
            this.keys[' '] = false;
        });
        
        // Canvas click to start
        this.canvas.addEventListener('click', () => {
            if (!this.gameStarted) {
                this.start();
            }
        });
        
        // Auto-start after a short delay
        setTimeout(() => {
            if (!this.gameStarted) {
                this.start();
            }
        }, 500);
    }
    
    update() {
        if (this.gameCompleted) return;
        
        this.animationFrame++;
        
        // Mario movement - easier controls
        if (this.keys['ArrowLeft'] || this.keys['a']) {
            this.mario.vx = -this.characterStats.speed;
            this.mario.direction = -1;
        } else if (this.keys['ArrowRight'] || this.keys['d']) {
            this.mario.vx = this.characterStats.speed;
            this.mario.direction = 1;
        } else {
            this.mario.vx *= this.characterStats.friction;
        }
        
        // Jumping - easier and higher
        if ((this.keys[' '] || this.keys['ArrowUp'] || this.keys['w']) && this.mario.onGround) {
            this.mario.vy = -this.characterStats.jumpPower;
            this.mario.onGround = false;
            this.mario.isJumping = true;
        }
        
        // Gravity - lighter for easier gameplay
        this.mario.vy += this.characterStats.gravity;
        
        // Update position
        this.mario.x += this.mario.vx;
        this.mario.y += this.mario.vy;
        
        // Update moving platforms
        for (let platform of this.platforms) {
            if (platform.type === 'moving') {
                platform.x += platform.moveSpeed;
                
                // Bounce back and forth
                if (platform.x <= platform.originalX - platform.moveRange/2 || 
                    platform.x >= platform.originalX + platform.moveRange/2) {
                    platform.moveSpeed *= -1;
                }
            }
        }
        
        // Update enemies - slower for easier avoidance
        for (let enemy of this.enemies) {
            enemy.x += enemy.vx;
            
            // Simple AI - turn around at edges
            if (enemy.x <= 50 || enemy.x >= 450) {
                enemy.vx *= -1;
            }
        }
        
        // Platform collision
        this.mario.onGround = false;
        this.mario.isJumping = false;
        
        for (let platform of this.platforms) {
            if (this.isColliding(this.mario, platform)) {
                // Landing on top
                if (this.mario.vy > 0 && this.mario.y < platform.y) {
                    this.mario.y = platform.y - this.mario.height;
                    this.mario.vy = 0;
                    this.mario.onGround = true;
                    
                    // Move with moving platform
                    if (platform.type === 'moving') {
                        this.mario.x += platform.moveSpeed;
                    }
                }
                // Hitting from below
                else if (this.mario.vy < 0 && this.mario.y > platform.y) {
                    this.mario.y = platform.y + platform.height;
                    this.mario.vy = 0;
                }
                // Side collision
                else if (this.mario.vx > 0 && this.mario.x < platform.x) {
                    this.mario.x = platform.x - this.mario.width;
                } else if (this.mario.vx < 0 && this.mario.x > platform.x) {
                    this.mario.x = platform.x + platform.width;
                }
            }
        }
        
        // Enemy collision - more forgiving
        for (let enemy of this.enemies) {
            if (this.isColliding(this.mario, enemy)) {
                // Mario jumps on enemy
                if (this.mario.vy > 0 && this.mario.y < enemy.y - 5) { // More forgiving collision
                    this.mario.vy = -8; // Bounce
                    enemy.defeated = true;
                    this.score += 100; // Score for defeating enemy
                } else {
                    // Reset Mario if hit by enemy - but give a small grace period
                    this.resetMario();
                }
            }
        }
        
        // Remove defeated enemies
        this.enemies = this.enemies.filter(enemy => !enemy.defeated);
        
        // Coin collection - larger collision area for easier collection
        for (let coin of this.coins) {
            if (!coin.collected) {
                // Expand collision area by 4 pixels on each side
                const expandedCoin = {
                    x: coin.x - 4,
                    y: coin.y - 4,
                    width: coin.width + 8,
                    height: coin.height + 8
                };
                
                if (this.isColliding(this.mario, expandedCoin)) {
                    coin.collected = true;
                    this.coinsCollected++;
                    this.score += 200; // Score for collecting coin
                    this.playCollectSound();
                    
                    // Create coin particles
                    for (let i = 0; i < 8; i++) {
                        this.createParticle(coin.x + coin.width/2, coin.y + coin.height/2, 'coin');
                    }
                }
            }
        }
        
        // Goal collision
        if (this.coinsCollected >= this.coinsNeeded && this.isColliding(this.mario, this.goal)) {
            this.score += 1000; // Bonus for completing level
            this.completeGame();
        }
        
        // Keep Mario in bounds
        if (this.mario.x < 0) this.mario.x = 0;
        if (this.mario.x > this.canvas.width - this.mario.width) this.mario.x = this.canvas.width - this.mario.width;
        
        // Reset if Mario falls - but give more room
        if (this.mario.y > this.canvas.height) {
            this.resetMario();
        }
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    resetMario() {
        this.mario.x = 80;
        this.mario.y = 400;
        this.mario.vx = 0;
        this.mario.vy = 0;
    }
    
    playCollectSound() {
        // Play coin collection sound if available
        if (window.game && window.game.coinSound) {
            window.game.playSound('coin');
        }
    }
    
    completeGame() {
        this.gameCompleted = true;
        
        // Call the level completion callback
        if (this.onComplete) {
            this.onComplete();
        }
        
        // Play completion sound
        if (window.game && window.game.completeSound) {
            window.game.playSound('complete');
        }
    }
    
    draw() {
        // Clear canvas with classic Mario sky blue
        this.ctx.fillStyle = '#5C94FC';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background elements
        this.drawBackground();
        
        // Draw platforms with classic Mario styling
        for (let platform of this.platforms) {
            if (platform.type === 'ground') {
                this.drawGround(platform);
            } else if (platform.type === 'brick') {
                this.drawBrick(platform);
            } else if (platform.type === 'question') {
                this.drawQuestionBlock(platform);
            } else if (platform.type === 'moving') {
                this.drawMovingPlatform(platform);
            }
        }
        
        // Draw pipes
        for (let pipe of this.pipes) {
            this.drawPipe(pipe.x, pipe.y, pipe.width, pipe.height);
        }
        
        // Draw coins with classic Mario coin animation
        const coinFrame = Math.floor(this.animationFrame / 8) % 4;
        for (let coin of this.coins) {
            if (!coin.collected) {
                this.drawCoin(coin.x + coin.width/2, coin.y + coin.height/2, coinFrame);
            }
        }
        
        // Draw enemies (Goombas)
        for (let enemy of this.enemies) {
            if (!enemy.defeated) {
                this.drawGoomba(enemy.x, enemy.y, enemy.width, enemy.height);
            }
        }
        
        // Draw goal (flagpole)
        if (this.coinsCollected >= this.coinsNeeded) {
            this.drawFlagpole();
        }
        
        // Draw particles
        this.drawParticles();
        
        // Draw Mario with proper sprite
        this.drawMario();
        
        // Classic Mario HUD
        this.drawClassicHUD();
        
        // Game completion overlay
        if (this.gameCompleted) {
            this.drawCompletionOverlay();
        }
    }
    
    drawCloud(x, y, width, height) {
        this.ctx.fillStyle = '#FFFFFF';
        // Main cloud body
        this.ctx.fillRect(x + 8, y + 4, width - 16, height - 8);
        this.ctx.fillRect(x + 4, y + 8, width - 8, height - 16);
        
        // Cloud bumps
        this.ctx.fillRect(x, y + 12, 8, height - 24);
        this.ctx.fillRect(x + width - 8, y + 12, 8, height - 24);
        this.ctx.fillRect(x + 12, y, 8, 8);
        this.ctx.fillRect(x + width - 20, y, 8, 8);
    }
    
    drawPipe(x, y, width, height) {
        // Pipe body
        this.ctx.fillStyle = '#00AA00';
        this.ctx.fillRect(x, y, width, height);
        
        // Pipe rim
        this.ctx.fillStyle = '#00CC00';
        this.ctx.fillRect(x - 4, y, width + 8, 8);
        
        // Pipe highlights
        this.ctx.fillStyle = '#00FF00';
        this.ctx.fillRect(x + 2, y + 8, 4, height - 8);
        this.ctx.fillRect(x + width - 6, y + 8, 4, height - 8);
    }
    
    drawGround(platform) {
        // Classic brick ground
        this.ctx.fillStyle = '#D2691E';
        this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Brick pattern
        this.ctx.fillStyle = '#8B4513';
        for (let i = 0; i < platform.width; i += 16) {
            for (let j = 0; j < platform.height; j += 8) {
                this.ctx.fillRect(platform.x + i, platform.y + j, 1, 8);
                if (j % 16 === 0) {
                    this.ctx.fillRect(platform.x + i + 8, platform.y + j, 1, 8);
                }
            }
        }
    }
    
    drawBrick(platform) {
        // Classic brick block
        this.ctx.fillStyle = '#D2691E';
        this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Brick outline
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(platform.x, platform.y, platform.width, 2);
        this.ctx.fillRect(platform.x, platform.y + platform.height - 2, platform.width, 2);
        this.ctx.fillRect(platform.x, platform.y, 2, platform.height);
        this.ctx.fillRect(platform.x + platform.width - 2, platform.y, 2, platform.height);
        
        // Brick lines
        for (let i = 8; i < platform.width; i += 16) {
            this.ctx.fillRect(platform.x + i, platform.y + 2, 1, platform.height - 4);
        }
        this.ctx.fillRect(platform.x + 2, platform.y + platform.height/2, platform.width - 4, 1);
    }
    
    drawQuestionBlock(platform) {
        // Question block background
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Question block outline
        this.ctx.fillStyle = '#FFA500';
        this.ctx.fillRect(platform.x, platform.y, platform.width, 2);
        this.ctx.fillRect(platform.x, platform.y + platform.height - 2, platform.width, 2);
        this.ctx.fillRect(platform.x, platform.y, 2, platform.height);
        this.ctx.fillRect(platform.x + platform.width - 2, platform.y, 2, platform.height);
        
        // Question mark
        this.ctx.fillStyle = '#8B4513';
        this.ctx.font = 'bold 12px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('?', platform.x + platform.width/2, platform.y + platform.height/2 + 4);
        this.ctx.textAlign = 'left';
    }
    
    drawMovingPlatform(platform) {
        // Moving platform (green)
        this.ctx.fillStyle = '#32CD32';
        this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Platform outline
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(platform.x, platform.y, platform.width, 2);
        this.ctx.fillRect(platform.x, platform.y + platform.height - 2, platform.width, 2);
        this.ctx.fillRect(platform.x, platform.y, 2, platform.height);
        this.ctx.fillRect(platform.x + platform.width - 2, platform.y, 2, platform.height);
        
        // Moving indicators
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(platform.x + 4, platform.y + 4, 2, 2);
        this.ctx.fillRect(platform.x + platform.width - 6, platform.y + 4, 2, 2);
    }
    
    drawCoin(x, y, frame) {
        // Classic Mario coin with rotation animation
        this.ctx.fillStyle = '#FFD700';
        
        if (frame === 0 || frame === 2) {
            // Full coin
            this.ctx.beginPath();
            this.ctx.arc(x, y, 8, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Coin details
            this.ctx.fillStyle = '#FFA500';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 6, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Coin center
            this.ctx.fillStyle = '#FFD700';
            this.ctx.fillRect(x - 2, y - 4, 4, 8);
        } else {
            // Rotated coin (thinner)
            this.ctx.fillRect(x - 2, y - 8, 4, 16);
            this.ctx.fillStyle = '#FFA500';
            this.ctx.fillRect(x - 1, y - 6, 2, 12);
        }
        
        // Coin sparkle
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(x - 3, y - 3, 1, 1);
    }
    
    drawGoomba(x, y, width, height) {
        // Goomba body (brown)
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(x + 2, y + 4, width - 4, height - 8);
        
        // Goomba head
        this.ctx.fillRect(x, y, width, height - 4);
        
        // Goomba eyes
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(x + 4, y + 4, 2, 2);
        this.ctx.fillRect(x + width - 6, y + 4, 2, 2);
        
        // Goomba eyebrows (angry look)
        this.ctx.fillRect(x + 3, y + 2, 4, 1);
        this.ctx.fillRect(x + width - 7, y + 2, 4, 1);
        
        // Goomba feet
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(x, y + height - 4, 6, 4);
        this.ctx.fillRect(x + width - 6, y + height - 4, 6, 4);
    }
    
    drawFlagpole() {
        const goal = this.goal;
        
        // Flagpole
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(goal.x + 12, goal.y, 6, goal.height);
        
        // Flag
        this.ctx.fillStyle = '#FF0000';
        const flagWave = Math.sin(this.animationFrame * 0.1) * 2;
        this.ctx.fillRect(goal.x + 18, goal.y + 10, 20 + flagWave, 15);
        
        // Flag details
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(goal.x + 20, goal.y + 12, 2, 2);
        this.ctx.fillRect(goal.x + 24, goal.y + 16, 2, 2);
        
        // Flagpole top
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(goal.x + 10, goal.y - 4, 10, 8);
    }
    
    drawMario() {
        this.ctx.save();
        
        // Character shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(this.mario.x + this.mario.width/2, this.mario.y + this.mario.height + 2, 
                        this.mario.width/2, 4, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Character sprite based on selection
        if (this.mario.direction === -1) {
            this.ctx.scale(-1, 1);
            this.ctx.translate(-this.mario.x - this.mario.width, 0);
        } else {
            this.ctx.translate(this.mario.x, 0);
        }
        
        // Draw character based on type
        if (this.character === 'mario') {
            this.drawMarioSprite();
        } else if (this.character === 'luigi') {
            this.drawLuigiSprite();
        } else if (this.character === 'donkey') {
            this.drawDonkeySprite();
        }
        
        // Power-up glow effect
        if (this.mario.isPowered) {
            this.ctx.shadowColor = '#FFD700';
            this.ctx.shadowBlur = 15;
            this.ctx.strokeStyle = '#FFD700';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(-2, this.mario.y - 2, this.mario.width + 4, this.mario.height + 4);
            this.ctx.shadowBlur = 0;
        }
        
        this.ctx.restore();
    }
    
    drawMarioSprite() {
        // Classic Mario - highly detailed pixel art style
        const x = 0;
        const y = this.mario.y;
        
        // === HAT (RED) ===
        this.ctx.fillStyle = '#FF0000';
        // Hat main body
        this.ctx.fillRect(x + 8, y + 2, 16, 8);
        this.ctx.fillRect(x + 6, y + 6, 20, 6);
        this.ctx.fillRect(x + 4, y + 8, 24, 4);
        
        // Hat brim
        this.ctx.fillStyle = '#CC0000';
        this.ctx.fillRect(x + 4, y + 10, 24, 2);
        this.ctx.fillRect(x + 2, y + 12, 28, 2);
        
        // Hat highlight
        this.ctx.fillStyle = '#FF6666';
        this.ctx.fillRect(x + 10, y + 4, 12, 2);
        
        // === FACE (PEACH) ===
        this.ctx.fillStyle = '#FFDBAC';
        // Face main area
        this.ctx.fillRect(x + 8, y + 12, 16, 8);
        this.ctx.fillRect(x + 6, y + 14, 20, 6);
        this.ctx.fillRect(x + 10, y + 20, 12, 4);
        
        // Face shading
        this.ctx.fillStyle = '#E6C4A0';
        this.ctx.fillRect(x + 22, y + 16, 2, 4);
        
        // === EYES (BLACK) ===
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(x + 12, y + 14, 2, 2);
        this.ctx.fillRect(x + 18, y + 14, 2, 2);
        
        // Eye highlights
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(x + 12, y + 14, 1, 1);
        this.ctx.fillRect(x + 18, y + 14, 1, 1);
        
        // === NOSE ===
        this.ctx.fillStyle = '#D2B48C';
        this.ctx.fillRect(x + 15, y + 16, 2, 2);
        
        // === MUSTACHE (BROWN) ===
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(x + 12, y + 18, 8, 2);
        this.ctx.fillRect(x + 11, y + 19, 10, 1);
        
        // Mustache highlights
        this.ctx.fillStyle = '#A0522D';
        this.ctx.fillRect(x + 13, y + 18, 6, 1);
        
        // === SHIRT (RED) ===
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillRect(x + 10, y + 22, 12, 6);
        
        // Shirt shading
        this.ctx.fillStyle = '#CC0000';
        this.ctx.fillRect(x + 20, y + 24, 2, 4);
        
        // === OVERALLS (BLUE) ===
        this.ctx.fillStyle = '#0066CC';
        // Main overalls body
        this.ctx.fillRect(x + 8, y + 24, 16, 12);
        
        // Overall straps
        this.ctx.fillRect(x + 10, y + 22, 3, 8);
        this.ctx.fillRect(x + 19, y + 22, 3, 8);
        
        // Overall shading
        this.ctx.fillStyle = '#004499';
        this.ctx.fillRect(x + 22, y + 26, 2, 10);
        this.ctx.fillRect(x + 8, y + 34, 16, 2);
        
        // Overall highlights
        this.ctx.fillStyle = '#3399FF';
        this.ctx.fillRect(x + 9, y + 25, 1, 8);
        
        // === BUTTONS (YELLOW) ===
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(x + 11, y + 26, 2, 2);
        this.ctx.fillRect(x + 19, y + 30, 2, 2);
        
        // Button highlights
        this.ctx.fillStyle = '#FFFF99';
        this.ctx.fillRect(x + 11, y + 26, 1, 1);
        this.ctx.fillRect(x + 19, y + 30, 1, 1);
        
        // === ARMS (PEACH) ===
        this.ctx.fillStyle = '#FFDBAC';
        if (this.mario.isJumping || !this.mario.onGround) {
            // Jumping pose - arms up and spread
            this.ctx.fillRect(x + 2, y + 18, 6, 10);
            this.ctx.fillRect(x + 24, y + 18, 6, 10);
            // Arm shading
            this.ctx.fillStyle = '#E6C4A0';
            this.ctx.fillRect(x + 6, y + 20, 2, 6);
            this.ctx.fillRect(x + 24, y + 20, 2, 6);
        } else if (Math.abs(this.mario.vx) > 0.5) {
            // Running animation - alternating arm positions
            const runFrame = Math.floor(this.animationFrame / 8) % 2;
            if (runFrame) {
                this.ctx.fillRect(x + 2, y + 24, 6, 8);
                this.ctx.fillRect(x + 24, y + 20, 6, 10);
            } else {
                this.ctx.fillRect(x + 2, y + 20, 6, 10);
                this.ctx.fillRect(x + 24, y + 24, 6, 8);
            }
            // Arm shading
            this.ctx.fillStyle = '#E6C4A0';
            this.ctx.fillRect(x + 6, y + 22, 2, 6);
            this.ctx.fillRect(x + 24, y + 22, 2, 6);
        } else {
            // Standing pose - arms at sides
            this.ctx.fillRect(x + 2, y + 24, 6, 8);
            this.ctx.fillRect(x + 24, y + 24, 6, 8);
            // Arm shading
            this.ctx.fillStyle = '#E6C4A0';
            this.ctx.fillRect(x + 6, y + 26, 2, 4);
            this.ctx.fillRect(x + 24, y + 26, 2, 4);
        }
        
        // === GLOVES (WHITE) ===
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(x + 2, y + 28, 6, 4);
        this.ctx.fillRect(x + 24, y + 28, 6, 4);
        
        // Glove details
        this.ctx.fillStyle = '#CCCCCC';
        this.ctx.fillRect(x + 2, y + 30, 6, 1);
        this.ctx.fillRect(x + 24, y + 30, 6, 1);
        
        // === LEGS (BLUE) ===
        this.ctx.fillStyle = '#0066CC';
        this.ctx.fillRect(x + 10, y + 36, 5, 6);
        this.ctx.fillRect(x + 17, y + 36, 5, 6);
        
        // Leg shading
        this.ctx.fillStyle = '#004499';
        this.ctx.fillRect(x + 13, y + 38, 2, 4);
        this.ctx.fillRect(x + 20, y + 38, 2, 4);
        
        // === SHOES (BROWN) ===
        this.ctx.fillStyle = '#8B4513';
        // Shoe main body
        this.ctx.fillRect(x + 6, y + 38, 10, 4);
        this.ctx.fillRect(x + 16, y + 38, 10, 4);
        
        // Shoe soles
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(x + 6, y + 40, 10, 2);
        this.ctx.fillRect(x + 16, y + 40, 10, 2);
        
        // Shoe highlights
        this.ctx.fillStyle = '#A0522D';
        this.ctx.fillRect(x + 7, y + 38, 8, 1);
        this.ctx.fillRect(x + 17, y + 38, 8, 1);
        
        // === "M" EMBLEM ON HAT ===
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 8px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('M', x + 16, y + 8);
        
        // M emblem shadow
        this.ctx.fillStyle = '#CCCCCC';
        this.ctx.fillText('M', x + 17, y + 9);
    }
    
    drawLuigiSprite() {
        // Luigi - taller, more detailed, and green
        const x = 0;
        const y = this.mario.y - 2; // Slightly taller than Mario
        
        // === HAT (GREEN) ===
        this.ctx.fillStyle = '#00AA00';
        // Hat main body
        this.ctx.fillRect(x + 8, y + 2, 16, 8);
        this.ctx.fillRect(x + 6, y + 6, 20, 6);
        this.ctx.fillRect(x + 4, y + 8, 24, 4);
        
        // Hat brim
        this.ctx.fillStyle = '#008800';
        this.ctx.fillRect(x + 4, y + 10, 24, 2);
        this.ctx.fillRect(x + 2, y + 12, 28, 2);
        
        // Hat highlight
        this.ctx.fillStyle = '#66CC66';
        this.ctx.fillRect(x + 10, y + 4, 12, 2);
        
        // === FACE (PEACH) ===
        this.ctx.fillStyle = '#FFDBAC';
        // Face main area (slightly longer than Mario)
        this.ctx.fillRect(x + 8, y + 12, 16, 10);
        this.ctx.fillRect(x + 6, y + 14, 20, 8);
        this.ctx.fillRect(x + 10, y + 22, 12, 4);
        
        // Face shading
        this.ctx.fillStyle = '#E6C4A0';
        this.ctx.fillRect(x + 22, y + 18, 2, 6);
        
        // === EYES (BLACK) ===
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(x + 12, y + 16, 2, 2);
        this.ctx.fillRect(x + 18, y + 16, 2, 2);
        
        // Eye highlights
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(x + 12, y + 16, 1, 1);
        this.ctx.fillRect(x + 18, y + 16, 1, 1);
        
        // === NOSE ===
        this.ctx.fillStyle = '#D2B48C';
        this.ctx.fillRect(x + 15, y + 18, 2, 3);
        
        // === MUSTACHE (BROWN - slightly different from Mario) ===
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(x + 11, y + 20, 10, 2);
        this.ctx.fillRect(x + 10, y + 21, 12, 1);
        
        // Mustache highlights
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(x + 12, y + 20, 8, 1);
        
        // === SHIRT (GREEN) ===
        this.ctx.fillStyle = '#00AA00';
        this.ctx.fillRect(x + 10, y + 24, 12, 6);
        
        // Shirt shading
        this.ctx.fillStyle = '#008800';
        this.ctx.fillRect(x + 20, y + 26, 2, 4);
        
        // === OVERALLS (DARK BLUE) ===
        this.ctx.fillStyle = '#003366';
        // Main overalls body
        this.ctx.fillRect(x + 8, y + 26, 16, 14);
        
        // Overall straps
        this.ctx.fillRect(x + 10, y + 24, 3, 8);
        this.ctx.fillRect(x + 19, y + 24, 3, 8);
        
        // Overall shading
        this.ctx.fillStyle = '#002244';
        this.ctx.fillRect(x + 22, y + 28, 2, 12);
        this.ctx.fillRect(x + 8, y + 38, 16, 2);
        
        // Overall highlights
        this.ctx.fillStyle = '#4466AA';
        this.ctx.fillRect(x + 9, y + 27, 1, 10);
        
        // === BUTTONS (YELLOW) ===
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(x + 11, y + 28, 2, 2);
        this.ctx.fillRect(x + 19, y + 32, 2, 2);
        
        // Button highlights
        this.ctx.fillStyle = '#FFFF99';
        this.ctx.fillRect(x + 11, y + 28, 1, 1);
        this.ctx.fillRect(x + 19, y + 32, 1, 1);
        
        // === ARMS (PEACH) ===
        this.ctx.fillStyle = '#FFDBAC';
        if (this.mario.isJumping || !this.mario.onGround) {
            // Jumping pose - Luigi style (higher arms)
            this.ctx.fillRect(x + 1, y + 18, 6, 12);
            this.ctx.fillRect(x + 25, y + 18, 6, 12);
            // Arm shading
            this.ctx.fillStyle = '#E6C4A0';
            this.ctx.fillRect(x + 5, y + 20, 2, 8);
            this.ctx.fillRect(x + 25, y + 20, 2, 8);
        } else if (Math.abs(this.mario.vx) > 0.5) {
            // Running animation - Luigi's longer stride
            const runFrame = Math.floor(this.animationFrame / 10) % 2;
            if (runFrame) {
                this.ctx.fillRect(x + 2, y + 26, 6, 8);
                this.ctx.fillRect(x + 24, y + 22, 6, 12);
            } else {
                this.ctx.fillRect(x + 2, y + 22, 6, 12);
                this.ctx.fillRect(x + 24, y + 26, 6, 8);
            }
            // Arm shading
            this.ctx.fillStyle = '#E6C4A0';
            this.ctx.fillRect(x + 6, y + 24, 2, 8);
            this.ctx.fillRect(x + 24, y + 24, 2, 8);
        } else {
            // Standing pose - arms at sides
            this.ctx.fillRect(x + 2, y + 26, 6, 8);
            this.ctx.fillRect(x + 24, y + 26, 6, 8);
            // Arm shading
            this.ctx.fillStyle = '#E6C4A0';
            this.ctx.fillRect(x + 6, y + 28, 2, 4);
            this.ctx.fillRect(x + 24, y + 28, 2, 4);
        }
        
        // === GLOVES (WHITE) ===
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(x + 2, y + 30, 6, 4);
        this.ctx.fillRect(x + 24, y + 30, 6, 4);
        
        // Glove details
        this.ctx.fillStyle = '#CCCCCC';
        this.ctx.fillRect(x + 2, y + 32, 6, 1);
        this.ctx.fillRect(x + 24, y + 32, 6, 1);
        
        // === LEGS (DARK BLUE) ===
        this.ctx.fillStyle = '#003366';
        this.ctx.fillRect(x + 10, y + 40, 5, 6);
        this.ctx.fillRect(x + 17, y + 40, 5, 6);
        
        // Leg shading
        this.ctx.fillStyle = '#002244';
        this.ctx.fillRect(x + 13, y + 42, 2, 4);
        this.ctx.fillRect(x + 20, y + 42, 2, 4);
        
        // === SHOES (BROWN) ===
        this.ctx.fillStyle = '#654321';
        // Shoe main body
        this.ctx.fillRect(x + 6, y + 42, 10, 4);
        this.ctx.fillRect(x + 16, y + 42, 10, 4);
        
        // Shoe soles
        this.ctx.fillStyle = '#4A2C17';
        this.ctx.fillRect(x + 6, y + 44, 10, 2);
        this.ctx.fillRect(x + 16, y + 44, 10, 2);
        
        // Shoe highlights
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(x + 7, y + 42, 8, 1);
        this.ctx.fillRect(x + 17, y + 42, 8, 1);
        
        // === "L" EMBLEM ON HAT ===
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 8px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('L', x + 16, y + 8);
        
        // L emblem shadow
        this.ctx.fillStyle = '#CCCCCC';
        this.ctx.fillText('L', x + 17, y + 9);
    }
    
    drawDonkeySprite() {
        // Donkey Kong - bigger, more detailed, and gorilla-like
        const x = 0;
        const y = this.mario.y - 6; // Much bigger than Mario and Luigi
        
        // === HEAD (BROWN FUR) ===
        this.ctx.fillStyle = '#8B4513';
        // Main head shape
        this.ctx.fillRect(x + 4, y + 2, 24, 18);
        this.ctx.fillRect(x + 2, y + 8, 28, 12);
        this.ctx.fillRect(x + 6, y + 20, 20, 6);
        
        // Head shading
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(x + 24, y + 4, 6, 16);
        this.ctx.fillRect(x + 4, y + 18, 24, 2);
        
        // Head highlights
        this.ctx.fillStyle = '#A0522D';
        this.ctx.fillRect(x + 6, y + 4, 2, 14);
        
        // === FACE (TAN) ===
        this.ctx.fillStyle = '#D2691E';
        // Face main area
        this.ctx.fillRect(x + 8, y + 10, 16, 12);
        this.ctx.fillRect(x + 10, y + 8, 12, 16);
        
        // Face shading
        this.ctx.fillStyle = '#CD853F';
        this.ctx.fillRect(x + 20, y + 12, 4, 10);
        
        // === EYES (WHITE WITH BLACK PUPILS) ===
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(x + 10, y + 10, 4, 4);
        this.ctx.fillRect(x + 18, y + 10, 4, 4);
        
        // Eye pupils (black)
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(x + 11, y + 11, 2, 2);
        this.ctx.fillRect(x + 19, y + 11, 2, 2);
        
        // Eye highlights
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(x + 11, y + 11, 1, 1);
        this.ctx.fillRect(x + 19, y + 11, 1, 1);
        
        // === NOSTRILS (BLACK) ===
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(x + 14, y + 14, 1, 2);
        this.ctx.fillRect(x + 17, y + 14, 1, 2);
        
        // === MOUTH AREA ===
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(x + 12, y + 16, 8, 6);
        
        // Mouth highlight
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(x + 13, y + 17, 6, 2);
        
        // === BODY (BROWN FUR) ===
        this.ctx.fillStyle = '#8B4513';
        // Main body
        this.ctx.fillRect(x + 4, y + 22, 24, 20);
        this.ctx.fillRect(x + 2, y + 26, 28, 16);
        
        // Body shading
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(x + 26, y + 24, 4, 18);
        this.ctx.fillRect(x + 4, y + 40, 24, 2);
        
        // Body highlights
        this.ctx.fillStyle = '#A0522D';
        this.ctx.fillRect(x + 6, y + 24, 2, 16);
        
        // === CHEST (TAN) ===
        this.ctx.fillStyle = '#D2691E';
        // Chest main area
        this.ctx.fillRect(x + 10, y + 24, 12, 14);
        this.ctx.fillRect(x + 8, y + 28, 16, 10);
        
        // Chest shading
        this.ctx.fillStyle = '#CD853F';
        this.ctx.fillRect(x + 20, y + 26, 4, 12);
        
        // === RED TIE ===
        this.ctx.fillStyle = '#CC0000';
        // Tie main body
        this.ctx.fillRect(x + 14, y + 24, 4, 16);
        this.ctx.fillRect(x + 13, y + 28, 6, 12);
        
        // Tie knot
        this.ctx.fillStyle = '#990000';
        this.ctx.fillRect(x + 12, y + 24, 8, 6);
        
        // Tie highlights
        this.ctx.fillStyle = '#FF3333';
        this.ctx.fillRect(x + 14, y + 25, 2, 14);
        
        // Tie shading
        this.ctx.fillStyle = '#880000';
        this.ctx.fillRect(x + 17, y + 26, 1, 12);
        
        // === ARMS (BROWN FUR) ===
        this.ctx.fillStyle = '#8B4513';
        if (this.mario.isJumping || !this.mario.onGround) {
            // Jumping pose - arms spread wide (gorilla style)
            this.ctx.fillRect(x - 2, y + 24, 8, 14);
            this.ctx.fillRect(x + 26, y + 24, 8, 14);
            // Arm shading
            this.ctx.fillStyle = '#654321';
            this.ctx.fillRect(x + 4, y + 26, 2, 10);
            this.ctx.fillRect(x + 26, y + 26, 2, 10);
        } else if (Math.abs(this.mario.vx) > 0.5) {
            // Running animation - gorilla knuckle-walking style
            const runFrame = Math.floor(this.animationFrame / 6) % 2;
            if (runFrame) {
                this.ctx.fillRect(x - 1, y + 26, 8, 12);
                this.ctx.fillRect(x + 25, y + 22, 8, 16);
            } else {
                this.ctx.fillRect(x - 1, y + 22, 8, 16);
                this.ctx.fillRect(x + 25, y + 26, 8, 12);
            }
            // Arm shading
            this.ctx.fillStyle = '#654321';
            this.ctx.fillRect(x + 5, y + 24, 2, 12);
            this.ctx.fillRect(x + 25, y + 24, 2, 12);
        } else {
            // Standing pose - arms at sides (gorilla posture)
            this.ctx.fillRect(x, y + 26, 8, 14);
            this.ctx.fillRect(x + 24, y + 26, 8, 14);
            // Arm shading
            this.ctx.fillStyle = '#654321';
            this.ctx.fillRect(x + 6, y + 28, 2, 10);
            this.ctx.fillRect(x + 24, y + 28, 2, 10);
        }
        
        // === HANDS (TAN) ===
        this.ctx.fillStyle = '#D2691E';
        this.ctx.fillRect(x - 2, y + 36, 10, 6);
        this.ctx.fillRect(x + 24, y + 36, 10, 6);
        
        // Hand details
        this.ctx.fillStyle = '#CD853F';
        this.ctx.fillRect(x, y + 38, 6, 2);
        this.ctx.fillRect(x + 26, y + 38, 6, 2);
        
        // Knuckles
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(x + 1, y + 37, 1, 1);
        this.ctx.fillRect(x + 3, y + 37, 1, 1);
        this.ctx.fillRect(x + 27, y + 37, 1, 1);
        this.ctx.fillRect(x + 29, y + 37, 1, 1);
        
        // === LEGS (BROWN FUR) ===
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(x + 8, y + 42, 6, 8);
        this.ctx.fillRect(x + 18, y + 42, 6, 8);
        
        // Leg shading
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(x + 12, y + 44, 2, 6);
        this.ctx.fillRect(x + 22, y + 44, 2, 6);
        
        // === FEET (DARK BROWN) ===
        this.ctx.fillStyle = '#654321';
        // Foot main body
        this.ctx.fillRect(x + 4, y + 46, 12, 6);
        this.ctx.fillRect(x + 16, y + 46, 12, 6);
        
        // Foot soles
        this.ctx.fillStyle = '#4A2C17';
        this.ctx.fillRect(x + 4, y + 50, 12, 2);
        this.ctx.fillRect(x + 16, y + 50, 12, 2);
        
        // Foot highlights
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(x + 5, y + 46, 10, 1);
        this.ctx.fillRect(x + 17, y + 46, 10, 1);
        
        // Toes
        this.ctx.fillStyle = '#4A2C17';
        this.ctx.fillRect(x + 6, y + 48, 1, 2);
        this.ctx.fillRect(x + 8, y + 48, 1, 2);
        this.ctx.fillRect(x + 10, y + 48, 1, 2);
        this.ctx.fillRect(x + 18, y + 48, 1, 2);
        this.ctx.fillRect(x + 20, y + 48, 1, 2);
        this.ctx.fillRect(x + 22, y + 48, 1, 2);
        
        // === "DK" ON TIE ===
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.font = 'bold 6px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('DK', x + 16, y + 32);
        
        // DK emblem shadow
        this.ctx.fillStyle = '#CCCC00';
        this.ctx.fillText('DK', x + 17, y + 33);
    }
    
    drawClassicHUD() {
        // Enhanced HUD with Mario-style design
        this.ctx.save();
        
        // HUD background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(0, 0, this.canvas.width, 50);
        
        // HUD border
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, this.canvas.width, 50);
        
        // Character name and score
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`${this.characterStats.name.toUpperCase()}`, 20, 20);
        this.ctx.fillText(`SCORE: ${this.score.toString().padStart(6, '0')}`, 20, 35);
        
        // Coins collected with better styling
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`🪙 ${this.coinsCollected}/${this.coinsNeeded}`, this.canvas.width/2 - 50, 25);
        
        // Level indicator
        this.ctx.fillStyle = '#00FF00';
        this.ctx.fillText(`WORLD ${Math.ceil(this.level/2)}-${((this.level-1)%2)+1}`, this.canvas.width/2 + 50, 25);
        
        // Character stats indicator
        this.ctx.fillStyle = '#CCCCCC';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`SPD:${this.characterStats.speed} JMP:${this.characterStats.jumpPower}`, this.canvas.width - 20, 20);
        
        // Status message with better positioning
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        if (this.coinsCollected >= this.coinsNeeded) {
            this.ctx.fillStyle = '#00FF00';
            this.ctx.fillText('🏁 REACH THE FLAG!', this.canvas.width/2, 45);
        } else {
            this.ctx.fillStyle = '#FFFF00';
            this.ctx.fillText('💰 COLLECT ALL COINS!', this.canvas.width/2, 45);
        }
        
        // Controls hint (smaller and less intrusive)
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.font = '8px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('WASD/ARROWS: MOVE | SPACE/UP: JUMP', 10, this.canvas.height - 8);
        
        this.ctx.restore();
    }
    
    drawCompletionOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('LEVEL COMPLETE!', this.canvas.width/2, this.canvas.height/2 - 20);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Memory Unlocked!', this.canvas.width/2, this.canvas.height/2 + 20);
        
        this.ctx.textAlign = 'left';
    }
    
    gameLoop() {
        if (!this.gameStarted) return;
        
        this.animationFrame++;
        this.updateMario();
        this.updateEnemies();
        this.updateMovingPlatforms();
        this.updateParticles();
        this.checkCollisions();
        this.checkGoal();
        
        // Clear and draw
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw everything with enhanced graphics
        this.drawBackground();
        this.drawPlatforms();
        this.drawPipes();
        
        // Draw coins with classic Mario coin animation
        const coinFrame = Math.floor(this.animationFrame / 8) % 4;
        for (let coin of this.coins) {
            if (!coin.collected) {
                this.drawCoin(coin.x + coin.width/2, coin.y + coin.height/2, coinFrame);
            }
        }
        
        this.drawEnemies();
        this.drawMario();
        this.drawGoal();
        this.drawParticles();
        this.drawClassicHUD();
        
        // Game completion overlay
        if (this.gameCompleted) {
            this.drawCompletionOverlay();
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    checkCollisions() {
        // Coin collection with particles
        this.coins.forEach(coin => {
            if (!coin.collected && this.isColliding(this.mario, coin)) {
                coin.collected = true;
                this.coinsCollected++;
                this.score += 200;
                
                // Create coin particles
                for (let i = 0; i < 8; i++) {
                    this.createParticle(coin.x + coin.width/2, coin.y + coin.height/2, 'coin');
                }
                
                // Play coin sound
                if (window.game && window.game.playSound) {
                    window.game.playSound('coin');
                }
            }
        });
        
        // Enemy collision (more forgiving)
        this.enemies.forEach(enemy => {
            if (this.isColliding(this.mario, enemy)) {
                // Check if Mario is jumping on enemy
                if (this.mario.vy > 0 && this.mario.y < enemy.y) {
                    // Mario jumped on enemy
                    enemy.defeated = true;
                    this.mario.vy = -8; // Bounce
                    this.score += 100;
                    
                    // Create star particles
                    for (let i = 0; i < 6; i++) {
                        this.createParticle(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 'star');
                    }
                } else {
                    // Mario got hit - reset position instead of game over
                    this.resetMario();
                }
            }
        });
        
        // Platform collision
        this.platforms.forEach(platform => {
            if (this.isColliding(this.mario, platform)) {
                // Top collision (landing)
                if (this.mario.vy > 0 && this.mario.y < platform.y) {
                    this.mario.y = platform.y - this.mario.height;
                    this.mario.vy = 0;
                    this.mario.onGround = true;
                    this.mario.isJumping = false;
                }
                // Bottom collision (hitting from below)
                else if (this.mario.vy < 0 && this.mario.y > platform.y) {
                    this.mario.y = platform.y + platform.height;
                    this.mario.vy = 0;
                    
                    // Question block interaction
                    if (platform.type === 'question' && !platform.used) {
                        platform.used = true;
                        platform.color = '#8B4513'; // Turn into regular block
                        
                        // Create power-up particles
                        for (let i = 0; i < 10; i++) {
                            this.createParticle(platform.x + platform.width/2, platform.y, 'star');
                        }
                        
                        this.score += 50;
                    }
                }
                // Side collisions
                else if (this.mario.vx > 0) {
                    this.mario.x = platform.x - this.mario.width;
                    this.mario.vx = 0;
                } else if (this.mario.vx < 0) {
                    this.mario.x = platform.x + platform.width;
                    this.mario.vx = 0;
                }
            }
        });
    }
    
    drawHUD() {
        // Enhanced HUD with Mario-style design
        this.ctx.save();
        
        // HUD background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(0, 0, this.canvas.width, 50);
        
        // HUD border
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, this.canvas.width, 50);
        
        // Character name and score
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`${this.characterStats.name.toUpperCase()}`, 20, 20);
        this.ctx.fillText(`SCORE: ${this.score.toString().padStart(6, '0')}`, 20, 35);
        
        // Coins collected with better styling
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`🪙 ${this.coinsCollected}/${this.coinsNeeded}`, this.canvas.width/2 - 50, 25);
        
        // Level indicator
        this.ctx.fillStyle = '#00FF00';
        this.ctx.fillText(`WORLD ${Math.ceil(this.level/2)}-${((this.level-1)%2)+1}`, this.canvas.width/2 + 50, 25);
        
        // Character stats indicator
        this.ctx.fillStyle = '#CCCCCC';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`SPD:${this.characterStats.speed} JMP:${this.characterStats.jumpPower}`, this.canvas.width - 20, 20);
        
        // Status message with better positioning
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        if (this.coinsCollected >= this.coinsNeeded) {
            this.ctx.fillStyle = '#00FF00';
            this.ctx.fillText('🏁 REACH THE FLAG!', this.canvas.width/2, 45);
        } else {
            this.ctx.fillStyle = '#FFFF00';
            this.ctx.fillText('💰 COLLECT ALL COINS!', this.canvas.width/2, 45);
        }
        
        // Controls hint (smaller and less intrusive)
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.font = '8px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('WASD/ARROWS: MOVE | SPACE/UP: JUMP', 10, this.canvas.height - 8);
        
        this.ctx.restore();
    }
    
    // ===== PARTICLE SYSTEM =====
    createParticle(x, y, type = 'coin') {
        const particle = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: -Math.random() * 3 - 2,
            life: 60,
            maxLife: 60,
            type: type,
            size: Math.random() * 8 + 4
        };
        this.particles.push(particle);
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2; // gravity
            p.life--;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    drawParticles() {
        this.particles.forEach(p => {
            const alpha = p.life / p.maxLife;
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            
            if (p.type === 'coin') {
                this.ctx.fillStyle = '#FFD700';
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (p.type === 'star') {
                this.ctx.fillStyle = '#FFFFFF';
                this.drawStar(p.x, p.y, p.size);
            }
            
            this.ctx.restore();
        });
    }
    
    drawStar(x, y, size) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            this.ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * size, 
                           -Math.sin((18 + i * 72) / 180 * Math.PI) * size);
            this.ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * size / 2, 
                           -Math.sin((54 + i * 72) / 180 * Math.PI) * size / 2);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }
    
    // ===== ENHANCED DRAWING METHODS =====
    drawBackground() {
        // Sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#5C94FC');
        gradient.addColorStop(0.7, '#87CEEB');
        gradient.addColorStop(1, '#98FB98');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw clouds with shadows
        this.clouds.forEach(cloud => {
            // Cloud shadow
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            this.drawCloud(cloud.x + 3, cloud.y + 3, cloud.width, cloud.height);
            
            // Cloud
            this.ctx.fillStyle = '#FFFFFF';
            this.drawCloud(cloud.x, cloud.y, cloud.width, cloud.height);
        });
        
        // Draw decorations
        this.decorations.forEach(decoration => {
            this.drawDecoration(decoration);
        });
    }
    
    drawCloud(x, y, width, height) {
        this.ctx.beginPath();
        this.ctx.arc(x + height/2, y + height/2, height/2, 0, Math.PI * 2);
        this.ctx.arc(x + width - height/2, y + height/2, height/2, 0, Math.PI * 2);
        this.ctx.arc(x + width/3, y + height/3, height/2.5, 0, Math.PI * 2);
        this.ctx.arc(x + 2*width/3, y + height/3, height/2.5, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawDecoration(decoration) {
        this.ctx.save();
        
        switch(decoration.type) {
            case 'bush':
                this.ctx.fillStyle = '#228B22';
                this.ctx.beginPath();
                this.ctx.arc(decoration.x + decoration.width/4, decoration.y + decoration.height/2, decoration.height/2, 0, Math.PI * 2);
                this.ctx.arc(decoration.x + 3*decoration.width/4, decoration.y + decoration.height/2, decoration.height/2, 0, Math.PI * 2);
                this.ctx.arc(decoration.x + decoration.width/2, decoration.y + decoration.height/3, decoration.height/2.2, 0, Math.PI * 2);
                this.ctx.fill();
                break;
                
            case 'hill':
                this.ctx.fillStyle = '#32CD32';
                this.ctx.beginPath();
                this.ctx.arc(decoration.x + decoration.width/2, decoration.y + decoration.height, decoration.width/2, 0, Math.PI, true);
                this.ctx.fill();
                break;
                
            case 'castle':
                this.ctx.fillStyle = '#696969';
                this.ctx.fillRect(decoration.x, decoration.y, decoration.width, decoration.height);
                // Castle details
                this.ctx.fillStyle = '#2F4F4F';
                for (let i = 0; i < 3; i++) {
                    this.ctx.fillRect(decoration.x + i * decoration.width/3, decoration.y, decoration.width/6, decoration.height/4);
                }
                break;
        }
        
        this.ctx.restore();
    }
    
    drawPlatforms() {
        this.platforms.forEach(platform => {
            this.ctx.save();
            
            // Platform shadow
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            this.ctx.fillRect(platform.x + 2, platform.y + 2, platform.width, platform.height);
            
            // Platform base
            this.ctx.fillStyle = platform.color;
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            
            // Platform details based on type
            if (platform.type === 'brick') {
                this.drawBrickPattern(platform);
            } else if (platform.type === 'question') {
                this.drawQuestionBlock(platform);
            } else if (platform.type === 'moving') {
                this.drawMovingPlatform(platform);
            } else if (platform.type === 'ground') {
                this.drawGroundPattern(platform);
            }
            
            this.ctx.restore();
        });
    }
    
    drawBrickPattern(platform) {
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 2;
        
        // Horizontal lines
        for (let y = platform.y; y <= platform.y + platform.height; y += platform.height / 3) {
            this.ctx.beginPath();
            this.ctx.moveTo(platform.x, y);
            this.ctx.lineTo(platform.x + platform.width, y);
            this.ctx.stroke();
        }
        
        // Vertical lines (offset pattern)
        const brickWidth = platform.width / 4;
        for (let row = 0; row < 3; row++) {
            const offset = (row % 2) * brickWidth / 2;
            for (let x = platform.x + offset; x < platform.x + platform.width; x += brickWidth) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, platform.y + row * platform.height / 3);
                this.ctx.lineTo(x, platform.y + (row + 1) * platform.height / 3);
                this.ctx.stroke();
            }
        }
    }
    
    drawQuestionBlock(platform) {
        // Animated glow effect
        const glowIntensity = Math.sin(this.animationFrame * 0.1) * 0.3 + 0.7;
        this.ctx.shadowColor = '#FFD700';
        this.ctx.shadowBlur = 10 * glowIntensity;
        
        // Question mark
        this.ctx.fillStyle = '#000000';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('?', platform.x + platform.width/2, platform.y + platform.height/2 + 6);
        
        // Border
        this.ctx.strokeStyle = '#B8860B';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        
        this.ctx.shadowBlur = 0;
    }
    
    drawMovingPlatform(platform) {
        // Animated energy effect
        this.ctx.shadowColor = '#32CD32';
        this.ctx.shadowBlur = 8;
        
        // Energy lines
        this.ctx.strokeStyle = '#90EE90';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            const y = platform.y + (i + 1) * platform.height / 4;
            this.ctx.beginPath();
            this.ctx.moveTo(platform.x + 5, y);
            this.ctx.lineTo(platform.x + platform.width - 5, y);
            this.ctx.stroke();
        }
        
        this.ctx.shadowBlur = 0;
    }
    
    drawGroundPattern(platform) {
        // Grass texture
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(platform.x, platform.y, platform.width, 8);
        
        // Dirt texture
        this.ctx.fillStyle = '#8B4513';
        for (let x = platform.x; x < platform.x + platform.width; x += 20) {
            for (let y = platform.y + 8; y < platform.y + platform.height; y += 15) {
                this.ctx.fillRect(x + Math.random() * 5, y + Math.random() * 5, 3, 3);
            }
        }
    }
    
    // ===== GAME INITIALIZATION =====
    start() {
        this.gameStarted = true;
        this.gameLoop();
    }
    
    // Public method to set completion callback
    setOnComplete(callback) {
        this.onComplete = callback;
    }
    
    // Reset the game
    reset() {
        this.gameCompleted = false;
        this.coinsCollected = 0;
        this.mario.x = 80;
        this.mario.y = 400;
        this.mario.vx = 0;
        this.mario.vy = 0;
        this.mario.direction = 1;
        this.mario.isJumping = false;
        this.mario.isPowered = false;
        this.mario.powerTimer = 0;
        this.animationFrame = 0;
        this.score = 0;
        this.particles = [];
        
        // Reset coins
        for (let coin of this.coins) {
            coin.collected = false;
        }
        
        // Reset enemies
        this.enemies = this.generateEnemies();
        
        // Reset moving platforms
        for (let platform of this.platforms) {
            if (platform.type === 'moving') {
                platform.x = platform.originalX;
                platform.moveSpeed = Math.abs(platform.moveSpeed) * (platform.moveSpeed > 0 ? 1 : -1);
            }
            if (platform.type === 'question') {
                platform.used = false;
                platform.color = '#FFD700';
            }
        }
    }
    
    // ===== UPDATE METHODS =====
    updateMario() {
        const stats = this.characterStats;
        
        // Handle input with less sensitive controls
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
            this.mario.vx = Math.max(this.mario.vx - stats.acceleration, -stats.speed);
            this.mario.direction = -1;
        } else if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
            this.mario.vx = Math.min(this.mario.vx + stats.acceleration, stats.speed);
            this.mario.direction = 1;
        } else {
            this.mario.vx *= stats.friction; // Apply friction when no input
        }
        
        // Jumping with character-specific power
        if ((this.keys['ArrowUp'] || this.keys['w'] || this.keys['W'] || this.keys[' ']) && this.mario.onGround) {
            this.mario.vy = -stats.jumpPower;
            this.mario.onGround = false;
            this.mario.isJumping = true;
        }
        
        // Apply character-specific gravity
        this.mario.vy += stats.gravity;
        this.mario.vy = Math.min(this.mario.vy, 15); // Terminal velocity
        
        // Update position
        this.mario.x += this.mario.vx;
        this.mario.y += this.mario.vy;
        
        // Boundary checks
        if (this.mario.x < 0) this.mario.x = 0;
        if (this.mario.x > this.canvas.width - this.mario.width) this.mario.x = this.canvas.width - this.mario.width;
        
        // Fall off screen
        if (this.mario.y > this.canvas.height) {
            this.resetMario();
        }
        
        // Reset onGround flag
        this.mario.onGround = false;
        
        // Update power-up timer
        if (this.mario.isPowered) {
            this.mario.powerTimer--;
            if (this.mario.powerTimer <= 0) {
                this.mario.isPowered = false;
            }
        }
    }
    
    updateEnemies() {
        this.enemies.forEach(enemy => {
            if (!enemy.defeated) {
                enemy.x += enemy.vx;
                
                // Reverse direction at edges or platforms
                if (enemy.x <= 0 || enemy.x >= this.canvas.width - enemy.width) {
                    enemy.vx *= -1;
                }
                
                // Simple platform edge detection
                let onPlatform = false;
                this.platforms.forEach(platform => {
                    if (enemy.x + enemy.width/2 >= platform.x && 
                        enemy.x + enemy.width/2 <= platform.x + platform.width &&
                        enemy.y + enemy.height >= platform.y - 5 &&
                        enemy.y + enemy.height <= platform.y + 5) {
                        onPlatform = true;
                    }
                });
                
                if (!onPlatform && (enemy.x <= 50 || enemy.x >= this.canvas.width - 50)) {
                    enemy.vx *= -1;
                }
            }
        });
        
        // Remove defeated enemies
        this.enemies = this.enemies.filter(enemy => !enemy.defeated);
    }
    
    updateMovingPlatforms() {
        this.platforms.forEach(platform => {
            if (platform.type === 'moving') {
                platform.x += platform.moveSpeed;
                
                // Reverse direction at range limits
                if (platform.x <= platform.originalX - platform.moveRange || 
                    platform.x >= platform.originalX + platform.moveRange) {
                    platform.moveSpeed *= -1;
                }
                
                // Keep Mario on moving platform
                if (this.mario.onGround && this.isColliding(this.mario, platform)) {
                    this.mario.x += platform.moveSpeed;
                }
            }
        });
    }
    
    checkGoal() {
        if (this.isColliding(this.mario, this.goal) && this.coinsCollected >= this.coinsNeeded) {
            if (!this.gameCompleted) {
                this.gameCompleted = true;
                
                // Victory particles
                for (let i = 0; i < 20; i++) {
                    this.createParticle(
                        this.goal.x + Math.random() * this.goal.width,
                        this.goal.y + Math.random() * this.goal.height,
                        'star'
                    );
                }
                
                // Call completion callback
                if (this.onComplete) {
                    setTimeout(() => this.onComplete(), 1000);
                }
            }
        }
    }
    
    // ===== DRAWING METHODS =====
    drawEnemies() {
        this.enemies.forEach(enemy => {
            if (!enemy.defeated) {
                this.ctx.save();
                
                // Enemy shadow
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                this.ctx.beginPath();
                this.ctx.ellipse(enemy.x + enemy.width/2, enemy.y + enemy.height + 2, 
                                enemy.width/2, 3, 0, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Goomba
                this.ctx.fillStyle = '#8B4513';
                this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                
                // Goomba face
                this.ctx.fillStyle = '#000000';
                this.ctx.fillRect(enemy.x + 4, enemy.y + 6, 3, 3); // Left eye
                this.ctx.fillRect(enemy.x + 18, enemy.y + 6, 3, 3); // Right eye
                this.ctx.fillRect(enemy.x + 8, enemy.y + 12, 8, 2); // Angry mouth
                
                // Goomba eyebrows (angry)
                this.ctx.fillRect(enemy.x + 2, enemy.y + 4, 6, 2);
                this.ctx.fillRect(enemy.x + 17, enemy.y + 4, 6, 2);
                
                this.ctx.restore();
            }
        });
    }
    
    drawPipes() {
        this.pipes.forEach(pipe => {
            this.ctx.save();
            
            // Pipe shadow
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            this.ctx.fillRect(pipe.x + 3, pipe.y + 3, pipe.width, pipe.height);
            
            // Pipe body
            this.ctx.fillStyle = pipe.color;
            this.ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
            
            // Pipe rim
            this.ctx.fillStyle = '#006600';
            this.ctx.fillRect(pipe.x - 4, pipe.y, pipe.width + 8, 12);
            
            // Pipe highlights
            this.ctx.fillStyle = '#00CC00';
            this.ctx.fillRect(pipe.x + 4, pipe.y + 12, 4, pipe.height - 12);
            
            this.ctx.restore();
        });
    }
    
    drawGoal() {
        this.ctx.save();
        
        // Flag pole
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(this.goal.x + this.goal.width/2 - 2, this.goal.y, 4, this.goal.height);
        
        // Flag
        const flagWave = Math.sin(this.animationFrame * 0.1) * 5;
        this.ctx.fillStyle = '#FF0000';
        this.ctx.beginPath();
        this.ctx.moveTo(this.goal.x + this.goal.width/2 + 2, this.goal.y + 10);
        this.ctx.lineTo(this.goal.x + this.goal.width/2 + 30 + flagWave, this.goal.y + 10);
        this.ctx.lineTo(this.goal.x + this.goal.width/2 + 25 + flagWave, this.goal.y + 25);
        this.ctx.lineTo(this.goal.x + this.goal.width/2 + 2, this.goal.y + 25);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Flag details
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(this.goal.x + this.goal.width/2 + 4, this.goal.y + 12, 8, 3);
        this.ctx.fillRect(this.goal.x + this.goal.width/2 + 4, this.goal.y + 18, 8, 3);
        
        // Subtle goal indicator when ready (much less prominent)
        if (this.coinsCollected >= this.coinsNeeded) {
            this.ctx.shadowColor = '#00FF00';
            this.ctx.shadowBlur = 5; // Reduced from 20
            this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)'; // Much more transparent
            this.ctx.lineWidth = 1; // Reduced from 3
            this.ctx.strokeRect(this.goal.x - 2, this.goal.y - 2, this.goal.width + 4, this.goal.height + 4);
            this.ctx.shadowBlur = 0;
        }
        
        this.ctx.restore();
    }
} 