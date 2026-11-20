# Learn Python: Interactive Learning Site

An interactive website where beginners learn Python in the browser. Read a short lesson, write code, click Run, and get instant feedback. The course runs from `print()` to building a number-guessing game.

**Home page:** https://python-pathway-pixel.lovable.app
**Lessons:** https://ochiengemmanuel5562-create.github.io/python-learning-site/learn.html
<!-- Landing page: add your Lovable link here if you want to show it -->

## The course

29 lessons in 6 modules:

| Module | Topic | Lessons |
|---|---|---|
| 1 | Hello, Python: print, variables, maths | 3 |
| 2 | Making decisions: if, elif, else, comparisons | 3 |
| 3 | Loops: for, while, range() | 4 |
| 4 | Functions: parameters, return values, defaults | 6 |
| 5 | Lists and dictionaries | 7 |
| 6 | Project: build a guessing game | 6 steps |

## Features

- Runs real Python in the browser using Pyodide, so no server is needed
- Three ways of checking answers: exact output, test cases that call the learner's functions with several inputs, and output that must contain certain text
- Hints, and a "Show solution" button
- Lessons grouped by module in a dropdown, with a tick next to completed ones
- Progress saved in the browser with localStorage, stored by lesson id so lessons can be added or reordered without breaking saved progress
- Light and dark mode that remembers your choice
- Duolingo-inspired design with chunky buttons and rounded cards
- Responsive layout for phones and desktops

## Built with

- HTML, CSS (custom properties for theming) and JavaScript (ES modules)
- [Pyodide](https://pyodide.org) to run Python in the browser
- Git and GitHub Pages for version control and hosting

## Project structure

```
index.html   page structure
style.css    styles and light/dark themes (CSS variables)
script.js    lessons, modules, answer checking and the interface
storage.js   saving progress and theme in localStorage
```

## Run it locally

1. Clone the repository:
   ```
   git clone https://github.com/ochiengemmanuel5562-create/python-learning-site.git
   ```
2. Open the folder in VS Code.
3. Install the **Live Server** extension, then right-click `index.html` and choose **Open with Live Server**.

Opening `index.html` by double-clicking will not work, because browsers block JavaScript modules on `file://` addresses.

## How to add a lesson

Lessons live in the `lessons` array in `script.js`. Each one is an object:

```javascript
{
  id: "my-lesson",        // unique and lowercase. Never change it once published
  module: 2,              // must match an id in the modules list
  title: "Lesson name",
  text: `Explanation (can include HTML such as <code>)`,
  task: "What the learner has to do",
  starter: `Code shown in the editor`,
  expected: "Exact text the program must print",
  hint: "Shown when the answer is wrong",
  solution: `Code loaded by Show solution`,
},
```

Keep lessons grouped by module in the list, because the order of the list decides what Next and Previous do. The dropdown, counters and progress bar update automatically.

### Choosing how a lesson is checked

| Field | How the answer is judged |
|---|---|
| `expected` | The printed output must match exactly |
| `tests` | Each test runs the learner's code, such as `{ call: "add(2, 3)", expect: "5" }`, and the results must be equal |
| `completeWhenOutputIncludes` | The output must contain the given text. Used for the game, where the output is random |

## Known limitations

- `input()` opens a browser pop-up. A text box inside the page would need Python to run in a Web Worker.
- Python runs on the page's main thread, so an endless loop can freeze the tab. A Web Worker would fix this too.
- Lessons checked by exact output can be passed by printing the answer directly. The function lessons use test cases to avoid this, but the tests are visible to the learner.
- Progress is stored in one browser, so it does not follow a learner to another device.

## What I learned

Building an interface from data, saving state with JSON and localStorage, migrating saved data when its format changed, theming with CSS variables, splitting code into ES modules, designing automated checks for code, and using Git and GitHub Pages to publish updates.

## Ideas for later

- XP points and a daily streak counter
- Run Python in a Web Worker, with an input box inside the page
- Hidden test cases for stronger answer checking
- Accounts, so progress follows the learner across devices