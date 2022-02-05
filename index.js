const RANDOM_QUOTE_API_URL = 'https://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const timerElement = document.getElementById('timer');
const container = document.getElementById('container');
const wpmElement = document.getElementById('wpm');
let quote;
let isTimerStated = false;
let timerID;
let currentIndex;
let strokes;
let count = 0;

window.addEventListener('click', (e) => {
  if (document.getElementById('container').contains(e.target)) {
    if (!isTimerStated) {
      container.classList.add('container-focus');
      startTimer();
    }
  } else {
    container.classList.remove('container-focus');
    stopTimer();
    timerElement.innerText = 0;
    currentIndex = 0;
    count = 0;
    resetStrokes();
    quoteDisplayElement.childNodes.forEach((node) => {
      node.classList.remove('correct');
      node.classList.remove('incorrect');
    });
  }
});

window.addEventListener('keydown', (e) => {
  if (isTimerStated) {
    var charCode = parseInt(e.keyCode);
    if (
      (charCode > 64 && charCode < 91) ||
      (charCode > 96 && charCode < 123) ||
      charCode === 32 ||
      charCode === 188 ||
      charCode === 186 ||
      charCode === 222 ||
      charCode === 190 ||
      charCode === 191 ||
      charCode === 49 ||
      charCode === 189
    ) {
      if (quote[currentIndex] == e.key) {
        quoteDisplayElement.childNodes[currentIndex].classList.add('correct');
        strokes[currentIndex] = 1;
        count++;
      } else {
        quoteDisplayElement.childNodes[currentIndex].classList.add('incorrect');
        strokes[currentIndex] = 0;
      }
      currentIndex++;
      if (currentIndex === quote.length) {
        currentIndex = 0;
        renderNewQuote();
      }
    } else if (charCode === 8) {
      if (strokes[currentIndex] == 1) count--;
      if (currentIndex === 0) return;
      currentIndex--;
      quoteDisplayElement.childNodes[currentIndex].classList.remove('correct');
      quoteDisplayElement.childNodes[currentIndex].classList.remove(
        'incorrect'
      );
    }
    calcualtewpm();
  }
});

function resetStrokes() {
  for (let i = 0; i < strokes.length; i++) {
    strokes[i] = 0;
  }
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

function calcualtewpm() {
  console.log(correctStrokes());
  if (getTimerTime() > 0) {
    wpmElement.innerText = Math.round(
      parseFloat(correctStrokes()) / 5.0 / (parseFloat(getTimerTime()) / 60.0)
    );
  }
  // console.log("wpm", correctStrokes(), getTimerTime());
}

function correctStrokes() {
  return count;
}

let startTime;
function startTimer() {
  isTimerStated = true;
  timerElement.innerText = 0;
  startTime = new Date();
  timerID = setInterval(() => {
    timerElement.innerText = getTimerTime();
  }, 1000);
}

const getRandomQuote = () => {
  return fetch(RANDOM_QUOTE_API_URL)
    .then((response) => response.json())
    .then((data) => data.content);
};

function stopTimer() {
  isTimerStated = false;
  clearInterval(timerID);
}

const renderNewQuote = async () => {
  quote = await getRandomQuote();
  if (isTimerStated) {
    stopTimer();
    startTimer();
  }
  strokes = new Array(quote.length);
  strokes.fill(0);
  count = 0;
  quoteDisplayElement.innerHTML = '';
  quote.split('').forEach((char) => {
    const charSpan = document.createElement('span');
    // <span>H</span>
    charSpan.innerText = char;
    quoteDisplayElement.appendChild(charSpan);
  });
  currentIndex = 0;
};

renderNewQuote();
