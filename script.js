import { loadProgress, saveProgress, loadTheme, saveTheme } from "./storage.js";

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
const solutionButton = document.getElementById("solution-button");
const lessonSelect = document.getElementById("lesson-select");
const themeButton = document.getElementById("theme-button");

const lessons = [
  {
    module: 1,
    title: "Your first Python program",
    text: `The <code>print()</code> function shows text on the screen. Put the text inside quotes.`,
    task: "Change the message so Python prints exactly: I love Python",
    starter: `print("Hello, world!")`,
    expected: "I love Python",
    hint: "Only change the words inside the quotes. Capital letters matter.",
    solution: `print("I love Python")`,
  },
  {
    module: 1,
    title: "Variables",
    text: `A variable stores a value under a name, like <code>age = 20</code>. You can use the name later.`,
    task: 'Create a variable called city that holds "Paris", then print it.',
    starter: `name = "Sam"\nprint("Hello, " + name)`,
    expected: "Paris",
    hint: "Write city = ... on one line, then print(city) on the next. Don't put quotes around city inside print().",
    solution: `city = "Paris"\nprint(city)`,
  },
  {
    module: 1,
    title: "Doing math",
    text: `Python can calculate with <code>+</code>, <code>-</code>, <code>*</code> and <code>/</code>.`,
    task: "Print the number of minutes in a week.",
    starter: `print(2 + 3 * 4)\nprint(10 / 4)`,
    expected: "10080",
    hint: "Multiply 7 days by 24 hours by 60 minutes. Python uses * for multiplication.",
    solution: `print(7 * 24 * 60)`,
  },
  {
    module: 2,
    title: "Making decisions with if",
    text: `An <code>if</code> statement runs code only when something is true. <code>else</code> runs when it isn't. The indented lines (4 spaces) belong to the line above them. Use <code>&gt;</code> for "greater than" and <code>==</code> (two equals signs) to check if two things are equal.`,
    task: 'The temperature is 35. Write an if/else that prints "Hot" if it is above 30, otherwise prints "Cool".',
    starter: `temperature = 35\n# Write your if/else below this line\n`,
    expected: "Hot",
    hint: "Start with: if temperature > 30:  then press Enter, press Tab, and write your print. Don't forget the colon at the end of the if line.",
    solution: `temperature = 35\nif temperature > 30:\n    print("Hot")\nelse:\n    print("Cool")`,
  },
  {
    module: 3,
    title: "Repeating with loops",
    text: `A <code>for</code> loop repeats code. <code>range(3)</code> gives the numbers 0, 1, 2. <code>range(1, 6)</code> starts at 1 and stops <em>before</em> 6.`,
    task: "Change the loop so it prints the numbers 1 to 5, each on its own line.",
    starter: `for i in range(3):\n    print(i)`,
    expected: "1\n2\n3\n4\n5",
    hint: "range(1, 6) starts at 1 and stops just before 6.",
    solution: `for i in range(1, 6):\n    print(i)`,
  },
];

const modules = [
  { id: 1, name: "Hello, Python" },
  { id: 2, name: "Making decisions" },
  { id: 3, name: "Repeating with loops" },
  { id: 4, name: "Functions" },
  { id: 5, name: "Lists & Dictionaries" },
  { id: 6, name: "Project: Build a guessing game" },
]

const saved = loadProgress();
let completed = Array.isArray(saved) ? saved : [];
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

function renderMenu() {
  lessonSelect.innerHTML = "";

  modules.forEach(function (module) {
    const group = document.createElement("optgroup");
    group.label = "Module " + module.id + ": " + module.name;

    lessons.forEach(function (lesson, index) {
      if (lesson.module !== module.id) {
        return;
      }

      const option = document.createElement("option");
      const mark = completed.includes(index) ? "✅ " : "";

      option.value = index;
      option.textContent = mark + lesson.title;
      group.appendChild(option);
    });

    if (group.children.length === 0) {
      const soon = document.createElement("option");
      soon.textContent = "Coming soon";
      soon.disabled = true;
      group.appendChild(soon);
    }

    lessonSelect.appendChild(group);
  });

  lessonSelect.value = currentLesson;
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
  outputBox.textContent =
    pyodide === null
      ? "Loading Python... please wait."
      : "Click Run to see the result.";
  feedback.textContent = "";
  feedback.className = "";

  prevButton.disabled = currentLesson === 0;
  nextButton.disabled = currentLesson === lessons.length - 1;

  updateCounter();
  updateProgress();
  renderMenu();
}

function checkAnswer() {
  const lesson = lessons[currentLesson];

  if (printed.trim() === lesson.expected) {
    if (!completed.includes(currentLesson)) {
      completed.push(currentLesson);
      saveProgress(completed);
    }
    updateCounter();
    updateProgress();
    renderMenu();
    showFeedback("Correct! Well done. Click Next to continue.", true);
  } else {
    showFeedback("Not quite yet. Hint: " + lesson.hint, false);
  }
}

prevButton.addEventListener("click", function () {
  if (currentLesson > 0) {
    showLesson(currentLesson - 1);
  }
});

nextButton.addEventListener("click", function () {
  if (currentLesson < lessons.length - 1) {
    showLesson(currentLesson + 1);
  }
});

resetButton.addEventListener("click", function () {
  if (confirm("Reset all your progress?")) {
    completed = [];
    saveProgress(completed);
    updateCounter();
    updateProgress();
    renderMenu();
    showLesson(0);
  }
});

async function setupPython() {
  runButton.disabled = true;
  outputBox.textContent = "Loading Python... please wait.";

  try {
    pyodide = await loadPyodide();
    pyodide.setStdout({
      batched: function (text) {
        printed += text + "\n";
      },
    });

    outputBox.textContent = "Python is ready! Click Run.";
    runButton.disabled = false;
  } catch (error) {
    outputBox.textContent = "Failed to load Python: " + error.message;
  }
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

solutionButton.addEventListener("click", function () {
  if (confirm("Have you tried the hint first? Click OK to see the solution.")) {
    codeInput.value = lessons[currentLesson].solution;
    outputBox.textContent = "Solution loaded. Click Run to see the result.";
    feedback.textContent = "";
    feedback.className = "";
  }
});

codeInput.addEventListener("keydown", function (event) {
  if (event.key === "Tab") {
    event.preventDefault();
    codeInput.setRangeText("    ", codeInput.selectionStart, codeInput.selectionEnd, "end");
  }
});

lessonSelect.addEventListener("change", function () {
  showLesson(Number(lessonSelect.value));
});

function applyTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  themeButton.textContent = isDark ? "Light mode" : "Dark mode";
}

let darkMode = Boolean(loadTheme());
applyTheme(darkMode);

themeButton.addEventListener("click", function () {
  darkMode = !darkMode;
  applyTheme(darkMode);
  saveTheme(darkMode);
});

showLesson(0);
setupPython();