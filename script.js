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
    id: "print",
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
    id: "variables",
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
    id: "math",
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
    id: "if-else",
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
    id: "elif",
    module: 2,
    title: "Choosing between many options with elif",
    text: `Use <code>elif</code> (short for "else if") to check more than two possibilities. Python checks each condition from the top and runs the first one that is true.`,
    task: 'The score is 72. Print "A" if it is 90 or more, "B" if it is 70 or more, otherwise print "C".',
    starter: `score = 72\n# Write your if / elif / else below this line\n`,
    expected: "B",
    hint: "Check the highest grade first: if score >= 90, then elif score >= 70, then else. Every one of those lines needs a colon at the end.",
    solution: `score = 72\nif score >= 90:\n    print("A")\nelif score >= 70:\n    print("B")\nelse:\n    print("C")`,
  },
  {
    id: "comparisons",
    module: 2,
    title: "Comparisons: True or False",
    text: `A comparison asks a yes/no question and gives back <code>True</code> or <code>False</code>. The comparison signs are <code>==</code> (equal), <code>!=</code> (not equal), <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code> and <code>&gt;=</code>. Join two comparisons with <code>and</code> (both must be true) or <code>or</code> (at least one must be true). You can print a comparison directly, like <code>print(5 &gt; 3)</code>.`,
    task: "age is 16. Print the result of one comparison that checks whether age is between 13 and 19, including both 13 and 19.",
    starter: `age = 16\n# Print the result of your comparison below\n`,
    expected: "True",
    hint: "Join two comparisons with and: one checks age >= 13, the other checks age <= 19. Put the whole thing inside print().",
    solution: `age = 16\nprint(age >= 13 and age <= 19)`,
  },
  {
    id: "for-loops",
    module: 3,
    title: "Repeating with loops",
    text: `A <code>for</code> loop repeats code. <code>range(3)</code> gives the numbers 0, 1, 2. <code>range(1, 6)</code> starts at 1 and stops <em>before</em> 6.`,
    task: "Change the loop so it prints the numbers 1 to 5, each on its own line.",
    starter: `for i in range(3):\n    print(i)`,
    expected: "1\n2\n3\n4\n5",
    hint: "range(1, 6) starts at 1 and stops just before 6.",
    solution: `for i in range(1, 6):\n    print(i)`,
  },
  {
    id: "while-loops",
    module: 3,
    title: "While loops",
    text: `A <code>while</code> loop keeps repeating <em>as long as</em> its condition is true. Something inside the loop must change the condition, or the loop never stops. Here <code>count = count - 1</code> makes the number smaller each time, so <code>count &gt; 0</code> eventually becomes false.`,
    task: "Change the starting number so the program counts down from 5 to 1.",
    starter: `count = 3\nwhile count > 0:\n    print(count)\n    count = count - 1`,
    expected: "5\n4\n3\n2\n1",
    hint: "You only need to change the starting value of count. Leave the rest of the loop alone.",
    solution: `count = 5\nwhile count > 0:\n    print(count)\n    count = count - 1`,
  },
  {
    id: "loop-sum",
    module: 3,
    title: "Adding up with a loop",
    text: `Loops are often used to build up a result. Start a variable at 0 (a "running total"), then add to it on every pass. The line <code>total = total + i</code> means "take the current total, add i, and store the answer back in total".`,
    task: "Change the program so it adds up the numbers from 1 to 10 and prints the total.",
    starter: `total = 0\nfor i in range(1, 6):\n    total = total + i\nprint(total)`,
    expected: "55",
    hint: "range(1, 6) stops before 6. Which number should it stop before to include 10?",
    solution: `total = 0\nfor i in range(1, 11):\n    total = total + i\nprint(total)`,
  },
  {
    id: "range-step",
    module: 3,
    title: "Counting in steps",
    text: `<code>range()</code> can take three numbers: <code>range(start, stop, step)</code>. The third number is how much to jump each time. For example, <code>range(0, 10, 3)</code> gives 0, 3, 6, 9. The stop number is still never included.`,
    task: "Change the loop so it prints the even numbers from 2 to 10, one per line.",
    starter: `for i in range(1, 6):\n    print(i)`,
    expected: "2\n4\n6\n8\n10",
    hint: "Start at 2, stop before 11, and jump by 2: range(2, 11, 2).",
    solution: `for i in range(2, 11, 2):\n    print(i)`,
  },
    {
    id: "functions-intro",
    module: 4,
    title: "Your first function",
    text: `A function is a named block of code that you can run whenever you like. You create one with <code>def</code>, a name, brackets and a colon. The indented lines below it are the function's body. <strong>Defining</strong> a function does not run it. To run it, <strong>call</strong> it by writing its name with brackets, like <code>greet()</code>.`,
    task: "The function is defined, but only called once. Call it so the program prints the greeting three times.",
    starter: `def greet():\n    print("Hello from a function!")\n\ngreet()`,
    expected: "Hello from a function!\nHello from a function!\nHello from a function!",
    hint: "Write greet() on three separate lines, with no spaces at the start of the lines.",
    solution: `def greet():\n    print("Hello from a function!")\n\ngreet()\ngreet()\ngreet()`,
  },
  {
    id: "parameters",
    module: 4,
    title: "Parameters: giving a function input",
    text: `A parameter is a variable that goes in the brackets of a function. It lets you pass different values into the same function. Use a comma to have more than one, like <code>def add(a, b):</code>. When you call it, you provide values in the same order: <code>add(3, 4)</code> makes <code>a</code> equal 3 and <code>b</code> equal 4.`,
    task: "This function should print the sum of a and b, so the program should print 7. Fix the function body.",
    starter: `def add(a, b):\n    print(a)\n\nadd(3, 4)`,
    expected: "7",
    hint: "The function only prints a. Inside print(), add the two parameters together.",
    solution: `def add(a, b):\n    print(a + b)\n\nadd(3, 4)`,
  },
  {
    id: "return-values",
    module: 4,
    title: "Return values",
    text: `<code>print()</code> shows a value on the screen, but the program cannot use it afterwards. <code>return</code> hands a value back to the code that called the function, so you can store it or calculate with it, like <code>result = square(5)</code>. A function with no <code>return</code> gives back <code>None</code>, which means "nothing". As soon as Python reaches <code>return</code>, the function stops.`,
    task: "triple() should return its number multiplied by 3. Fix it so the program prints 24.",
    starter: `def triple(n):\n    return n\n\nprint(triple(7) + triple(1))`,
    expected: "24",
    hint: "Right now the function returns n unchanged. Return n multiplied by 3 instead.",
    solution: `def triple(n):\n    return n * 3\n\nprint(triple(7) + triple(1))`,
  },
  {
    id: "default-parameters",
    module: 4,
    title: "Default values",
    text: `A parameter can have a default value, written with an equals sign: <code>def greet(name, greeting="Hello"):</code>. If you leave that value out when calling, Python uses the default. If you provide it, yours replaces the default. Parameters with defaults go <em>after</em> the ones without.`,
    task: `Call greet() two more times so the program prints three lines: "Hello, Sam!", then "Hi, Priya!", then "Good morning, Amina!".`,
    starter: `def greet(name, greeting="Hello"):\n    print(greeting + ", " + name + "!")\n\ngreet("Sam")`,
    expected: "Hello, Sam!\nHi, Priya!\nGood morning, Amina!",
    hint: `The second value you pass replaces the default, for example greet("Priya", "Hi").`,
    solution: `def greet(name, greeting="Hello"):\n    print(greeting + ", " + name + "!")\n\ngreet("Sam")\ngreet("Priya", "Hi")\ngreet("Amina", "Good morning")`,
  },
  {
    id: "functions-calling-functions",
    module: 4,
    title: "Functions calling functions",
    text: `Functions can call other functions. This lets you build big tasks from small, simple ones, and it is how real programs are organised. Here <code>sum_of_squares</code> uses <code>square</code> inside it.`,
    task: "sum_of_squares should add the square of a and the square of b, so the program should print 25. Fix it.",
    starter: `def square(n):\n    return n * n\n\ndef sum_of_squares(a, b):\n    return square(a) + b\n\nprint(sum_of_squares(3, 4))`,
    expected: "25",
    hint: "The function squares a but not b. Call square() on b as well.",
    solution: `def square(n):\n    return n * n\n\ndef sum_of_squares(a, b):\n    return square(a) + square(b)\n\nprint(sum_of_squares(3, 4))`,
  },
  {
    id: "functions-practice",
    module: 4,
    title: "Practice: write your own function",
    text: `Time to write a whole function yourself. To convert Celsius to Fahrenheit, multiply by 9, divide by 5, then add 32. Remember that Python's <code>/</code> always gives a decimal number, so answers like 32 appear as <code>32.0</code>.`,
    task: "Write a function called celsius_to_fahrenheit that takes one number and returns the Fahrenheit value. The program should print 32.0 and then 212.0.",
    starter: `# Write your function below this line\n\n\nprint(celsius_to_fahrenheit(0))\nprint(celsius_to_fahrenheit(100))`,
    expected: "32.0\n212.0",
    hint: "Start with def celsius_to_fahrenheit(c): then, on an indented line, use return with the formula c * 9 / 5 + 32.",
    solution: `def celsius_to_fahrenheit(c):\n    return c * 9 / 5 + 32\n\nprint(celsius_to_fahrenheit(0))\nprint(celsius_to_fahrenheit(100))`,
  },
    {
    id: "lists-intro",
    module: 5,
    title: "Lists",
    text: `A list stores several values in order. Write it with square brackets and commas: <code>fruits = ["apple", "banana", "cherry"]</code>. Each item has a position number called an <strong>index</strong>, and counting starts at <strong>0</strong>. So <code>fruits[0]</code> is "apple" and <code>fruits[1]</code> is "banana". A negative index counts from the end: <code>fruits[-1]</code> is the last item.`,
    task: "Change the program so it prints the last item in the list, which is cherry.",
    starter: `fruits = ["apple", "banana", "cherry"]\nprint(fruits[0])`,
    expected: "cherry",
    hint: "The list has three items, so the last one is at index 2. You can also use -1.",
    solution: `fruits = ["apple", "banana", "cherry"]\nprint(fruits[2])`,
  },
  {
    id: "list-changes",
    module: 5,
    title: "Changing a list",
    text: `Lists can change after you create them. <code>fruits.append("mango")</code> adds an item to the end. <code>fruits.remove("banana")</code> deletes the first item with that value. <code>fruits[0] = "pear"</code> replaces the item at index 0. When you print a whole list, Python shows it exactly as written in code, with square brackets and single quotes.`,
    task: `Remove "banana" from the list and add "mango" to the end. The program should print ['apple', 'cherry', 'mango'].`,
    starter: `fruits = ["apple", "banana", "cherry"]\n# Change the list below this line\n\nprint(fruits)`,
    expected: "['apple', 'cherry', 'mango']",
    hint: `Use fruits.remove("banana") and fruits.append("mango") on two separate lines, before the print.`,
    solution: `fruits = ["apple", "banana", "cherry"]\nfruits.remove("banana")\nfruits.append("mango")\nprint(fruits)`,
  },
  {
    id: "looping-lists",
    module: 5,
    title: "Looping over a list",
    text: `A <code>for</code> loop can walk through a list one item at a time. In <code>for name in names:</code>, the variable <code>name</code> holds the first item on the first pass, the second item on the next pass, and so on until the list runs out. You don't need index numbers at all.`,
    task: `Change the loop so each name is printed with an exclamation mark after it, like Sam!`,
    starter: `names = ["Sam", "Priya", "Amina"]\nfor name in names:\n    print(name)`,
    expected: "Sam!\nPriya!\nAmina!",
    hint: `Inside print(), join the name and "!" together with +.`,
    solution: `names = ["Sam", "Priya", "Amina"]\nfor name in names:\n    print(name + "!")`,
  },
  {
    id: "list-tools",
    module: 5,
    title: "Handy list tools",
    text: `Python has built-in tools for lists. <code>len(scores)</code> counts the items. <code>sum(scores)</code> adds up the numbers. <code>max(scores)</code> and <code>min(scores)</code> find the biggest and smallest. <code>sorted(scores)</code> gives a new list in order and leaves the original alone.`,
    task: "Print three lines: how many scores there are, then the highest score, then the total of all the scores.",
    starter: `scores = [72, 95, 58, 81]\nprint(len(scores))`,
    expected: "4\n95\n306",
    hint: "Add two more print lines, one using max(scores) and one using sum(scores).",
    solution: `scores = [72, 95, 58, 81]\nprint(len(scores))\nprint(max(scores))\nprint(sum(scores))`,
  },
  {
    id: "dictionaries-intro",
    module: 5,
    title: "Dictionaries",
    text: `A dictionary stores <strong>pairs</strong>: a key and its value. Write it with curly brackets: <code>person = {"name": "Sam", "age": 25}</code>. You look up a value by its key, not by a position number: <code>person["name"]</code> gives "Sam". Use a dictionary when each piece of data has a label.`,
    task: "Change the program so it prints Sam's city and then Sam's age, on two lines.",
    starter: `person = {"name": "Sam", "city": "Paris", "age": 25}\nprint(person["name"])`,
    expected: "Paris\n25",
    hint: `Look values up with the key in square brackets and in quotes, like person["city"].`,
    solution: `person = {"name": "Sam", "city": "Paris", "age": 25}\nprint(person["city"])\nprint(person["age"])`,
  },
  {
    id: "dictionary-changes",
    module: 5,
    title: "Changing and looping over dictionaries",
    text: `Set a value with <code>prices["banana"] = 3</code>. If the key exists, its value is replaced. If it doesn't, a new pair is added. To loop over both keys and values use <code>for item, price in prices.items():</code>. To join a number to text, first turn it into text with <code>str(price)</code>.`,
    task: "Change banana's price to 3, then add a new item, cherry, with a price of 5. The program should print three lines.",
    starter: `prices = {"apple": 2, "banana": 1}\n# Change the dictionary below this line\n\nfor item, price in prices.items():\n    print(item + ": " + str(price))`,
    expected: "apple: 2\nbanana: 3\ncherry: 5",
    hint: `Write two lines before the loop: prices["banana"] = 3 and prices["cherry"] = 5.`,
    solution: `prices = {"apple": 2, "banana": 1}\nprices["banana"] = 3\nprices["cherry"] = 5\n\nfor item, price in prices.items():\n    print(item + ": " + str(price))`,
  },
  {
    id: "collections-practice",
    module: 5,
    title: "Practice: count the votes",
    text: `Let's combine a list, a loop, a dictionary and an if statement. The word <code>in</code> checks whether a key is already in a dictionary: <code>"red" in counts</code> is <code>True</code> or <code>False</code>. To count things, go through the list. If you've seen the item before, add 1 to its count. Otherwise, start its count at 1.`,
    task: `Finish the loop so counts records how many times each colour appears. The program should print {'red': 3, 'blue': 2, 'green': 1}.`,
    starter: `votes = ["red", "blue", "red", "green", "blue", "red"]\ncounts = {}\n\nfor vote in votes:\n    # Write your if / else here, then delete the pass line\n    pass\n\nprint(counts)`,
    expected: "{'red': 3, 'blue': 2, 'green': 1}",
    hint: "Inside the loop: if vote is already in counts, set counts[vote] to counts[vote] + 1. Else set counts[vote] to 1. Delete the pass line.",
    solution: `votes = ["red", "blue", "red", "green", "blue", "red"]\ncounts = {}\n\nfor vote in votes:\n    if vote in counts:\n        counts[vote] = counts[vote] + 1\n    else:\n        counts[vote] = 1\n\nprint(counts)`,
  },
];

const modules = [
  { id: 1, name: "Hello, Python" },
  { id: 2, name: "Making decisions" },
  { id: 3, name: "Loops" },
  { id: 4, name: "Functions" },
  { id: 5, name: "Lists & Dictionaries" },
  { id: 6, name: "Project: Build a guessing game" },
];

// Old saved progress used positions in the ORIGINAL five-lesson order.
// This list never changes, so old ticks always land on the right lessons.
const LEGACY_ORDER = ["print", "variables", "math", "if-else", "for-loops"];

function migrateProgress(savedList) {
  if (!Array.isArray(savedList)) {
    return [];
  }

  const ids = savedList.map(function (item) {
    if (typeof item === "number") {
      return LEGACY_ORDER[item];
    }
    return item;
  });

  return ids.filter(function (id) {
    return lessons.some(function (lesson) {
      return lesson.id === id;
    });
  });
}

let completed = migrateProgress(loadProgress());
saveProgress(completed);
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
  const lesson = lessons[currentLesson];
  const moduleLessons = lessons.filter(function (item) {
    return item.module === lesson.module;
  });
  const position = moduleLessons.indexOf(lesson) + 1;

  let text =
    "Module " + lesson.module + " · Lesson " + position + " of " + moduleLessons.length;
  if (completed.includes(lesson.id)) {
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
      const mark = completed.includes(lesson.id) ? "✅ " : "";

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
    if (!completed.includes(lesson.id)) {
      completed.push(lesson.id);
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