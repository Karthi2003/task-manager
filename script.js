// script.js
// Task Class
class Task {
    constructor(name, description, completed = false) {
        this.name = name;
        this.description = description;
        this.completed = completed;
    }
}

// Variables
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const taskNameInput = document.getElementById('taskName');
const taskDescriptionInput = document.getElementById('taskDescription');
const addTaskButton = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const filterSelect = document.getElementById('filter');
const modal = document.getElementById('editModal');
const modalNameInput = document.getElementById('editTaskName');
const modalDescriptionInput = document.getElementById('editTaskDescription');
const saveEditButton = document.getElementById('saveEdit');
const deleteModalButton = document.getElementById('deleteTaskModal');
const closeButton = document.querySelector('.close');
const emptyTaskWarning = document.getElementById('emptyTaskWarning');

let editingIndex = -1;

// Functions
function renderTasks(filter = 'all') {
    taskList.innerHTML = '';
    let filteredTasks = tasks;

    if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        taskItem.innerHTML = ` 
            <div>
                <strong>${task.name}</strong>: ${task.description}
            </div>
            <div class="task-actions">
                <button onclick="toggleComplete(${index})">${task.completed ? 'Pending' : 'Completed'}</button>
                <button onclick="openEditModal(${index})">Edit</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
}

function addTask() {
    const name = taskNameInput.value.trim();
    const description = taskDescriptionInput.value.trim();

    if (!name) {
        emptyTaskWarning.style.display = 'block';
        return;
    }
    emptyTaskWarning.style.display = 'none';

    const task = new Task(name, description);
    tasks.push(task);
    updateLocalStorage();
    taskNameInput.value = '';
    taskDescriptionInput.value = '';
    renderTasks(filterSelect.value);
}

function openEditModal(index) {
    editingIndex = index;
    modalNameInput.value = tasks[index].name;
    modalDescriptionInput.value = tasks[index].description;
    modal.style.display = 'block';
}

function saveEditedTask() {
    tasks[editingIndex].name = modalNameInput.value.trim();
    tasks[editingIndex].description = modalDescriptionInput.value.trim();
    updateLocalStorage();
    renderTasks(filterSelect.value);
    modal.style.display = 'none';
}

function deleteTask() {
    tasks.splice(editingIndex, 1);
    updateLocalStorage();
    renderTasks(filterSelect.value);
    modal.style.display = 'none';
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    updateLocalStorage();
    renderTasks(filterSelect.value);
}

function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Event Listeners
addTaskButton.addEventListener('click', addTask);
filterSelect.addEventListener('change', () => renderTasks(filterSelect.value));
saveEditButton.addEventListener('click', saveEditedTask);
deleteModalButton.addEventListener('click', deleteTask);
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Initial Render
renderTasks();