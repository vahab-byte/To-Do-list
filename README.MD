# 📝 Simple To-Do List App

A minimal and interactive to-do list web application built using **HTML**, **CSS**, and **JavaScript**. This app allows users to quickly manage their daily tasks with confirmation dialogs, real-time toast notifications, and persistent local storage.

---

## 📌 Features

- ✅ Add tasks by pressing the `Enter` key or clicking `ADD` button
- 🗑️ Confirm before deleting a task (`"Are you sure you want to delete this todo?"`)
- 🔔 Toast notifications for actions:
  - `"Your data saved successfully"` – after adding a task
  - `"Task deleted successfully"` – after confirmed deletion
  - `"Marked as complete"` – after checking a task
- 💾 Persistent tasks using **localStorage**
- 📦 Clean and responsive UI (easy to customize)

---

## 💾 localStorage Support

- Tasks are saved automatically in the browser’s local storage
- Refreshing or reopening the page keeps all previously added tasks
- Supports saving:
  - Task text
  - Completion status (checked/unchecked)

---

## 🚀 How to Use

1. Clone or download the project folder
2. Open `index.html` in your browser
3. Start adding, completing, and deleting tasks!
4. All changes are saved automatically using `localStorage`

---

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)

## 📂 Project Structure

 README.md # Project documentation
 index.html # Main HTML file
 script.js # All core JavaScript logic
 style.css # Basic styles for layout and toasts
