document.addEventListener('DOMContentLoaded', () => { 
    const audioCtx = new AudioContext();
    const gameState = new GameState();

    // Get the DOM elements 
    const screens = {
        intro: document.getElementById('intro-screen'),
        game: document.getElementById('game-screen'),
        gameOver: document.getElementById('game-over')
    };

    const buttons = {
        start: document.getElementById('start-btn'),
        restart: document.getElementById('restart-btn'),
        play: document.getElementById('play-btn'),
        save: document.getElementById('save-btn')
    };

    const displays = {
        score: document.getElementById('score'),
        level: document.getElementById('level'),
        finalScore: document.getElementById('final-score'),
        message: document.getElementById('message'),
        messageWrong: document.getElementById('messageWrong'),
        art: document.getElementById('art-display'),
        gallery: document.getElementById('gallery')
    };

    // Efficient code for the svg
    const shapes = Array.from({length: 4}, (_, i) => {
        const element = document.getElementById(`shape-${i}`);
        element.innerHTML = [raro, prisma, estrella, circle][i];
        return element;
    });

    // Add CSS for shape highlighting
    const style = document.createElement('style');
    style.textContent = `
        .active-shape {
            transform: scale(1.2);
            filter: brightness(1.5);
            transition: all 0.2s ease;
        }
    `;
    document.head.appendChild(style);

    // Event listeners
    buttons.start.addEventListener('click', startGame);
    buttons.restart.addEventListener('click', restartGame);
    buttons.play.addEventListener('click', playSequence);
    buttons.save?.addEventListener('click', () => {
        // Placeholder for save functionality
        buttons.save.disabled = true;
        displays.message.classList.add('visible');
        setTimeout(() => {
            displays.message.classList.remove('visible');
        }, 1000);
    });

    shapes.forEach((shape, index) => {
        shape.addEventListener('click', () => {
            if (gameState.canPlayerInteract) {
                playShape(index);
                
                const result = gameState.addPlayerMove(index);
                
                // Wrong sequence
                if (!result.correct) {
                    displays.messageWrong.classList.add('visible');
                    setTimeout(() => {
                        displays.messageWrong.classList.remove('visible');
                    }, 1000);
                    setTimeout(endGame, 1000);
                    return;
                }
                
                // Check if sequence is complete
                if (result.sequence) {
                    updateDisplay(result.score, result.level);
                    displays.message.classList.add('visible');
                    setTimeout(() => {
                        displays.message.classList.remove('visible');
                    }, 1000);
                    
                    // Display art (if implemented)
                    if (displays.art) {
                        displays.art.style.display = 'block';
                        if (buttons.save) buttons.save.disabled = false;
                    }
                    
                    setTimeout(() => {
                        const newState = gameState.levelUp();
                        updateDisplay(newState.score, newState.level);
                        gameState.generateNextSequence();
                        buttons.play.disabled = false;
                    }, 1500);
                }
            }
        });
    });

    function startGame() {
        screens.intro.classList.remove('active');
        screens.game.classList.add('active');
        
        const state = gameState.resetGame();
        updateDisplay(state.score, state.level);
        gameState.generateNextSequence();
        buttons.play.disabled = false;
        
        if (displays.art) displays.art.style.display = 'none';
        if (buttons.save) buttons.save.disabled = true;
    }

    function restartGame() {
        screens.gameOver.classList.remove('active');
        screens.game.classList.add('active');
        
        const state = gameState.resetGame();
        updateDisplay(state.score, state.level);
        gameState.generateNextSequence();
        buttons.play.disabled = false;
        
        if (displays.art) displays.art.style.display = 'none';
        if (buttons.save) buttons.save.disabled = true;
    }

    // Update the screen
    function updateDisplay(score, level) {
        displays.score.textContent = score;
        displays.level.textContent = level;
        displays.finalScore.textContent = score;
    }

    function playSequence() {
        if (gameState.isPlaying) return;

        const sequence = gameState.startPlayingSequence();
        buttons.play.disabled = true;
        if (buttons.save) buttons.save.disabled = true;

        // Play the sequence with proper timing based on level
        let i = 0;
        const playInterval = Math.max(500, 1000 - (gameState.level * 50)); // Speed up as level increases
        
        const interval = setInterval(() => {
            playShape(sequence[i]);
            i++;
            if (i >= sequence.length) {
                clearInterval(interval);
                setTimeout(() => {
                    gameState.finishPlayingSequence();
                }, 500);
            }
        }, playInterval);
    }

    function playShape(index) {
        // Highlight the shape visually
        shapes[index].classList.add('active-shape');
        setTimeout(() => {
            shapes[index].classList.remove('active-shape');
        }, 500);
        
        // Play the sound
        const soundInfo = gameState.soundMap[index];
        new SoundObject(
            audioCtx,
            soundInfo.frequency,
            soundInfo.type,
            soundInfo.duration
        );
    }

    function endGame() {
        screens.game.classList.remove('active');
        screens.gameOver.classList.add('active');
        
        // Display gallery if implemented
        if (displays.gallery) {
            // Placeholder for gallery display
        }
    }

    // Initialize audio context on first user interaction
    window.addEventListener('click', () => {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    });
});








