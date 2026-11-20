'use strict';

const uploadDiv = document.getElementById('upload');
const quizDiv = document.getElementById('quiz');
const resultDiv = document.getElementById('result');
const input = document.getElementById('quiz-csv-input');
const retryBut = document.getElementById('retry-button');

const quizTitle = document.getElementById('quiz-title');
const quizText = document.getElementById('quiz-text');
const quizBut1 = document.getElementById('a-1');
const quizBut2 = document.getElementById('a-2');
const quizBut3 = document.getElementById('a-3');
const quizBut4 = document.getElementById('a-4');
const quizBtnList = [quizBut1, quizBut2, quizBut3, quizBut4];

const scoreText = document.getElementById('score');
let correct = 0;

let quizData = [];
let n = 0;

for (let j = 0; j < quizBtnList.length; j++) {
  quizBtnList[j].addEventListener('click', () => {
    checkAnswer(j);

    n++;
    if (n < quizData.length) {
      next();
    } else {
      quizDiv.hidden = true;
      resultDiv.hidden = false;
      scoreText.textContent = Math.round(correct / quizData.length * 100) + '点';
    }
  });
}

input.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  readCsvWithFallback(file, 'UTF-8', (csvText) => {
    quizData = convertCSVtoArray(csvText);

    n = 0;
    uploadDiv.hidden = true;
    quizDiv.hidden = false;
    resultDiv.hidden = true;
    next();
  });
});

function readCsvWithFallback(file, encoding, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    if (encoding === 'UTF-8' && text.includes('\uFFFD')) {
      readCsvWithFallback(file, 'Shift-JIS', callback);
      return;
    }
    callback(text);
  };
  reader.readAsText(file, encoding);
}

function next() {
  const row = quizData[n];
  if (!row) return;

  quizTitle.innerText = row[0];
  for (let j = 0; j < 4; j++) {
    quizBtnList[j].textContent = row[j + 1];
  }
}

function convertCSVtoArray(str) {
  const rows = str.replace(/\r/g, '').split('\n');
  const parsed = [];

  for (const row of rows) {
    if (row.trim() === '') continue;
    parsed.push(row.split(','));
  }

  return parsed;
}

function checkAnswer(selectIndex) {
  const row = quizData[n];
  if (!row) return;

  const answerIndex = Number(String(row[5]).trim()) - 1;

  if (answerIndex !== selectIndex) {
    const correctText = row[answerIndex + 1] ?? '';
    alert('不正解！正解は「' + correctText + '」です');
  } else {
    correct++;
  }
}

retryBut.addEventListener('click',() => {
  uploadDiv.hidden = false;
    quizDiv.hidden = true;
    resultDiv.hidden = true;
})