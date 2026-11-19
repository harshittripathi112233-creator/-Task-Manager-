# Task Manager

A Kanban-style task manager built with plain HTML, CSS and JavaScript. No frameworks, no build step. Tasks are saved in your browser with `localStorage`.

**Live demo:** https://harshittripathi112233-creator.github.io/Task Manager/

## Features

- Three columns: To Do, In Progress and Done, each with a live task count
- Drag and drop tasks between columns
- Add, edit, delete and mark tasks as done
- Task details: category, priority (Low, Normal, High), due date, attachment count and assignees
- Favorite and archive tasks from the `···` menu
- Search tasks as you type (press `Ctrl + K` or `⌘ + K` to jump to the search box)
- Filter by category, priority, favorites and archived tasks
- Light and dark mode
- Responsive layout for desktop and mobile
- Data saved automatically in `localStorage`

## Tech stack

- HTML5
- CSS3 (custom properties, grid, flexbox)
- Vanilla JavaScript (ES6+)

## Project structure

```
task-manager/
├── index2.html    # page structure
├── style.css     # styles and dark theme
├── script2.js     # app logic and localStorage
└── README.md
```

## Getting started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   ```
2. Open the folder:
   ```bash
   cd your-repo-name
   ```
3. Open `index2.html` in your browser. Keep `style.css` and `script.js` in the same folder.

## How to use

| Action | How |
| --- | --- |
| Add a task | Click **Add New**, or **Add a task** at the bottom of a column |
| Edit, favorite, archive, delete | Click `···` on a task card |
| Move a task | Drag the card to another column |
| Mark as done | `···` menu, then **Mark as Done** |
| Search | Type in the search box, or press `Ctrl/⌘ + K` |
| Filter | Click **Filter** and choose category, priority, favorites or archived |
| Switch theme | Click the moon or sun icon in the header |

## Data storage

Tasks and theme choice are stored in your browser's `localStorage` under the keys `taskmanager.v1` and `taskmanager.theme`. Data stays on your device and is not shared between browsers or devices. Clearing your browser data removes your tasks.

## Deploy with GitHub Pages

1. Push the project to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Source**, choose the `main` branch and the `/ (root)` folder, then save.
4. Your site will be live at `https:///harshittripathi112233-creator.github.io/Task Manager/` after a minute or two.

## Roadmap

- [ ] Real assignee names and avatars
- [ ] File attachments
- [ ] Reorder tasks within a column and keep the order after filters
- [ ] Export and import tasks as JSON

## Contributing

Pull requests are welcome. For larger changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the [MIT License](LICENSE).

## Author

Harshit Tripathi – /harshittripathi112233-creator(https://github.com//harshittripathi112233-creator)
