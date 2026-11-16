const runButton = document.getElementById("run-button");
const codeInput = document.getElementById("code-input");
const outputBox = document.getElementById("output-box");
const feedback = document.getElementById("feedback");
const lessonTitle = document.getElementById("lesson-title");
const lessonText = document.getElementById("lesson-text");
const lessonTask = document.getElementById("lesson-task");
const lessonCounter = document.getElementById("lesson-counter");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const resetButton = document.getElementById("reset-button");

const lessons = [
  {
    title: "Lesson 1: Your first Python program",
    text: `The <code>print()</code> function shows text on the screen. Put the text inside quotes.`,
    task: "Change the message so Python prints exactly: I love Python",
    starter: `print("Hello, world!")`,
    expected: "I love Python",
    hint: "Only change the words inside the quotes. Capital letters matter.",
  },
  {
    title: "Lesson 2: Variables",
    text: `A variable stores a value under a name, like <code>age = 20</code>. You can use the name later.`,
    task: 'Create a variable called city that holds "Paris", then print it.',
    starter: `name = "Sam"\nprint("Hello, " + name)`,
    expected: "Paris",
    hint: "Write city = ... on one line, then print(city) on the next. Don't put quotes around city inside print().",
  },
  {
    title: "Lesson 3: Doing math",
    text: `Python can calculate with <code>+</code>, <code>-</code>, <code>*</code> and <code>/</code>.`,
    task: "Print the number of minutes in a week.",
    starter: `print(2 + 3 * 4)\nprint(10 / 4)`,
    expected: "10080",
    hint: "Multiply 7 days by 24 hours by 60 minutes. Python uses * for multiplication.",
  },
];

const STORAGE_KEY = "pythonSiteProgress";

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  } catch (error) {
    console.log("Could not save progress:", error);
  }
}

let completed = loadProgress();
let currentLesson = 0;
let pyodide = null;
let printed = "";

function updateProgress() {
  const percent = (completed.length / lessons.length) * 100;
  progressBar.style.width = percent + "%";
  progressText.textContent =
    "Completed " + completed.length + " of " + lessons.length + " lessons";
}

function updateCounter() {
  let text = "Lesson " + (currentLesson + 1) + " of " + lessons.length;
  if (completed.includes(currentLesson)) {
    text += " ✅";
  }
  lessonCounter.textContent = text;
}

function showFeedback(message, isCorrect) {
  feedback.textContent = message;
  feedback.className = isCorrect ? "correct" : "incorrect";
}

function showLesson(index) {
  currentLesson = index;
  const lesson = lessons[index];

  lessonTitle.textContent = lesson.title;
  lessonText.innerHTML = lesson.text;
  lessonTask.textContent = lesson.task;
  codeInput.value = lesson.starter;
  outputBox.textContent = "Click Run to see the result.";
  feedback.textContent = "";
  feedback.className = "";

  updateCounter();
  updateProgress();

  prevButton.disabled = index === 0;
  nextButton.disabled = index === lessons.length - 1;
}

function checkAnswer() {
  const lesson = lessons[currentLesson];

  if (printed.trim() === lesson.expected) {
    if (!completed.includes(currentLesson)) {
      completed.push(currentLesson);
      saveProgress();
    }
    updateCounter();
    updateProgress();
    showFeedback(" Correct! Well done. Click Next to continue.", true);
  } else {
    showFeedback("Not quite yet. Hint: " + lesson.hint, false);
  }
}

prevButton.addEventListener("click", function () {
  showLesson(currentLesson - 1);
});

nextButton.addEventListener("click", function () {
  showLesson(currentLesson + 1);
});

resetButton.addEventListener("click", function () {
  if (confirm("Reset all your progress?")) {
    completed = [];
    saveProgress();
    updateCounter();
    updateProgress();
  }
});

async function setupPython() {
  runButton.disabled = true;
  outputBox.textContent = "Loading Python... please wait.";

  pyodide = await loadPyodide();
  pyodide.setStdout({
    batched: function (text) {
      printed += text + "\n";
    },
  });

  outputBox.textContent = "Python is ready! Click Run.";
  runButton.disabled = false;
}

runButton.addEventListener("click", async function () {
  if (pyodide === null) {
    outputBox.textContent = "Python is still loading. Please wait a moment.";
    return;
  }

  printed = "";
  feedback.textContent = "";
  feedback.className = "";

  try {
    await pyodide.runPythonAsync(codeInput.value);
    outputBox.textContent = printed || "(Your code ran, but printed nothing.)";
    checkAnswer();
  } catch (error) {
    outputBox.textContent = error.message;
    showFeedback("There's an error in your code. Read the message above for clues.", false);
  }
});

showLesson(0);
setupPython();