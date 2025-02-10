document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const startButton = document.getElementById('startGame');
    const resetButton = document.getElementById('resetGame');
    const scoreElement = document.getElementById('score');
    const attemptsElement = document.getElementById('attempts');
    const timerElement = document.getElementById('timer');
    const gameMessage = document.getElementById('gameMessage');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');

    let cards = [];
    let score = 0;
    let attempts = 0;
    let flippedCards = [];
    let canFlip = true;
    let gameTimer = null;
    let seconds = 0;
    let currentDifficulty = 'medium';

    const difficulties = {
        easy: { pairs: 6, time: 120 },
        medium: { pairs: 8, time: 180 },
        hard: { pairs: 12, time: 240 }
    };

    const emojis = ['🌸', '🌺', '🌹', '🌷', '🌼', '🙃', '👑', '🍀', '🦋', '🎀', '💜', '✨'];

    function updateTimer() {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        
        if (seconds <= 0) {
            endGame(false);
        } else {
            seconds--;
        }
    }

    function startTimer() {
        seconds = difficulties[currentDifficulty].time;
        if (gameTimer) clearInterval(gameTimer);
        gameTimer = setInterval(updateTimer, 1000);
    }

    function shuffleCards(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createCard(emoji, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        
        card.addEventListener('click', () => flipCard(card));
        
        return card;
    }

    function flipCard(card) {
        if (!canFlip || flippedCards.includes(card) || card.classList.contains('matched')) {
            return;
        }

        card.textContent = card.dataset.emoji;
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            attempts++;
            attemptsElement.textContent = attempts;
            canFlip = false;

            checkMatch();
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;
        const match = card1.dataset.emoji === card2.dataset.emoji;

        if (match) {
            score++;
            scoreElement.textContent = score;
            card1.classList.add('matched');
            card2.classList.add('matched');
            
            if (score === difficulties[currentDifficulty].pairs) {
                endGame(true);
            }
        } else {
            setTimeout(() => {
                card1.textContent = '';
                card2.textContent = '';
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }, 1000);
        }

        setTimeout(() => {
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }

    function endGame(won) {
        clearInterval(gameTimer);
        canFlip = false;
        gameMessage.textContent = won ? 
            '🎉 مبروك! لقد فزت باللعبة! 🎉' : 
            '⏰ انتهى الوقت! حاول مرة أخرى! ⏰';
        gameMessage.classList.add(won ? 'win-message' : 'lose-message');
        resetButton.disabled = false;
        startButton.disabled = true;
    }

    function startGame() {
        gameBoard.innerHTML = '';
        score = 0;
        attempts = 0;
        scoreElement.textContent = score;
        attemptsElement.textContent = attempts;
        flippedCards = [];
        canFlip = true;
        gameMessage.textContent = '';
        gameMessage.className = 'game-message';
        resetButton.disabled = true;
        startButton.disabled = true;

        const numPairs = difficulties[currentDifficulty].pairs;
        const gameEmojis = emojis.slice(0, numPairs);
        const shuffledCards = shuffleCards([...gameEmojis, ...gameEmojis]);
        
        shuffledCards.forEach((emoji, index) => {
            const card = createCard(emoji, index);
            gameBoard.appendChild(card);
        });

        startTimer();
    }

    function resetGame() {
        clearInterval(gameTimer);
        startButton.disabled = false;
        resetButton.disabled = true;
        gameMessage.textContent = '';
        gameMessage.className = 'game-message';
        timerElement.textContent = '00:00';
    }

    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentDifficulty = button.dataset.level;
            difficultyButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            startButton.disabled = false;
        });
    });

    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', resetGame);
});
