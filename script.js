let randomNumber = parseInt(Math.random() * 100 + 1);

const submit = document.querySelector('#subt');
const form = document.querySelector('.form');
let userInput = document.querySelector('#guessField');
let guessSlot = document.querySelector('.guesses');
let remainig = document.querySelector('.lastResult');
let lowOrHi = document.querySelector('.lowOrHi');
let startOver = document.querySelector('.resultParas');

const MAX_GUESSES = 10;
const p = document.createElement('p');

// Theme (light / dark) handling — keeps UI centered and in liquid-glass style
const themeToggle = document.querySelector('#themeToggle');
const rootEl = document.documentElement;
let activeTheme = 'light';

const updateToggleVisual = (theme) => {
  if (!themeToggle) return;
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
  themeToggle.setAttribute('title', `Switch to ${nextTheme} theme`);
};

const setTheme = (theme) => {
  const normalized = theme === 'dark' ? 'dark' : 'light';
  rootEl.setAttribute('data-theme', normalized);
  activeTheme = normalized;
  updateToggleVisual(normalized);
  try { localStorage.setItem('theme', normalized); } catch (e) {}
  return normalized;
};

// initialize theme from saved pref or system
(function initTheme() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved) { setTheme(saved); return; }
  } catch (e) {}
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  } else {
    setTheme('light');
  }
})();

if (themeToggle) {
  themeToggle.addEventListener('click', (e) => {
    e.preventDefault();
    setTheme(activeTheme === 'dark' ? 'light' : 'dark');
  });
  themeToggle.addEventListener('touchstart', (e) => {
    e.preventDefault();
    setTheme(activeTheme === 'dark' ? 'light' : 'dark');
  }, {passive:false});
}

let prevGuess = [];
let numGuess = 0;

let playGame = true;

if (playGame) {
  // handle form submit (keyboard Enter or submit button)
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const guess = parseInt(userInput.value, 10);
    validateGuess(guess);
  });

  // support touch devices where a touchstart may be preferred
  submit.addEventListener('touchstart', (event) => {
    event.preventDefault();
    const guess = parseInt(userInput.value, 10);
    validateGuess(guess);
  }, {passive: false});
}

const validateGuess = (guess) => {
  if (isNaN(guess)) {
    alert('Please enter a valid number.');
  } else if (guess < 1) {
    alert('Please enter a  number more than 1.');
  } else if (guess > 100) {
    alert('Please enter a  number less than 100.');
  } else {
    prevGuess.push(guess);
    displayGuess();

    if (guess === randomNumber) {
      displayMessege('You guessed it right');
      endGame();
      return;
    }

    if (prevGuess.length >= MAX_GUESSES) {
      displayMessege(`Game Over. Random number was ${randomNumber}`);
      endGame();
      return;
    }

    checkGuess(guess);
  }
};

const checkGuess = (guess) => {
  if (guess < randomNumber) {
    displayMessege(`Number is tooo low!!!`);
  } else if (guess > randomNumber) {
    displayMessege(`Number is tooo high!!!`);
  }
};

displayGuess = () => {
  userInput.value = '';
  guessSlot.textContent = prevGuess.join(', ');
  numGuess = prevGuess.length;
  const guessesLeft = Math.max(0, MAX_GUESSES - numGuess);
  remainig.textContent = `${guessesLeft}`;
};

const displayMessege = (messege) => {
  lowOrHi.innerHTML = `<h2>${messege}</h2>`;
};

const endGame = () => {
  userInput.value = '';
  userInput.setAttribute('disabled', '');
  p.classList.add('button');
  p.innerHTML = `<h2 id = "newGame">Start New Game</h2>`;
  startOver.appendChild(p);
  playGame = false;
  newGame();
};
const newGame = () => {
  const newGameButton = document.querySelector('#newGame');
  if (!newGameButton) return;

  const startHandler = (event) => {
    randomNumber = parseInt(Math.random() * 100 + 1, 10);
    prevGuess = [];
    numGuess = 0;
    guessSlot.textContent = '';
    remainig = document.querySelector('.lastResult');
    remainig.textContent = `${MAX_GUESSES}`;
    lowOrHi.textContent = '';
    userInput.removeAttribute('disabled');
    startOver.removeChild(p);
    playGame = true;
  };

  newGameButton.addEventListener('click', startHandler);
  newGameButton.addEventListener('touchstart', (e) => { e.preventDefault(); startHandler(e); }, {passive: false});
};