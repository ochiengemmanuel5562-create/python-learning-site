# Learn Python: Interactive Learning Site

An interactive website where beginners learn Python in the browser. Read a short lesson, write code, click Run, and get instant feedback.

**Live demo:** https://ochiengemmanuel5562-create.github.io/python-learning-site/

## Features

- Runs real Python in the browser using Pyodide, so no server is needed
- Five lessons: print, variables, maths, if/else and loops
- Automatic answer checking with hints and a "Show solution" button
- A dropdown to jump to any lesson, with a tick next to completed ones
- Progress saved in the browser with localStorage
- Light and dark mode that remembers your choice
- Duolingo-inspired design with chunky buttons and rounded cards
- Responsive layout for phones and desktops

## Built with

- HTML, CSS (custom properties for theming) and JavaScript (ES modules)
- [Pyodide](https://pyodide.org) to run Python in the browser
- Git and GitHub Pages for version control and hosting

## Run it locally

1. Clone the repository:
   ```
   git clone https://github.com/ochiengemmanuel5562-create/python-learning-site.git
   ```
2. Open the folder in VS Code.
3. Install the **Live Server** extension, then right-click `index.html` and choose **Open with Live Server**.

Opening `index.html` by double-clicking will not work, because browsers block JavaScript modules on `file://` addresses.

## How to add a lesson

Each lesson is an object with these fields:

| Field | Purpose |
|---|---|
| `title` | Lesson name shown at the top |
| `text` | Explanation (can include HTML such as `<code>`) |
| `task` | What the learner has to do |
| `starter` | Code that appears in the editor |
| `expected` | The exact output the answer must print |
| `hint` | Shown when the answer is wrong |
| `solution` | Code loaded by "Show solution" |

Add a new object to the lessons list, and the dropdown, counter and progress bar update automatically.

## What I learned

Building an interface from data, handling async code loading, saving state with JSON and localStorage, theming with CSS variables, splitting code into modules, and using Git and GitHub Pages to publish updates.

## Ideas for later

- XP points and a daily streak counter
- More lessons on lists, functions and dictionaries