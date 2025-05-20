// Selectors
const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');

// Event Listeners
toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deletecheck);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ?
    changeTheme('standard')
    : changeTheme(localStorage.getItem('savedTheme'));

// Functions;
function addToDo(event) {
    // Prevents form from submitting / Prevents form from reloading;
    event.preventDefault();

    // toDo DIV;
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);

    // Create LI
    const newToDo = document.createElement('li');
    if (toDoInput.value === '') {
        alert("You must write something!");
    }
    else {
        newToDo.innerText = toDoInput.value;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);

        // Adding to local storage;
        savelocal(toDoInput.value);

        // check btn;
        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add('check-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(checked);

        // delete btn;
        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add('delete-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);

        // edit btn;
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.classList.add('edit-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(editBtn);

        // Append to list;
        toDoList.appendChild(toDoDiv);

        // Clearing the input;
        toDoInput.value = '';
    }
}

function deletecheck(event) {
    const item = event.target;

    // delete
    if (item.classList[0] === 'delete-btn') {
        item.parentElement.classList.add("fall");

        //removing local todos;
        removeLocalTodos(item.parentElement);

        item.parentElement.addEventListener('transitionend', function () {
            item.parentElement.remove();
        });
    }

    // check
    if (item.classList[0] === 'check-btn') {
        item.parentElement.classList.toggle("completed");
    }

    // edit
    if (item.classList[0] === 'edit-btn') {
        const todoItem = item.parentElement.querySelector('.todo-item');
        const oldValue = todoItem.innerText;
        const newValue = prompt("Edit your task:", oldValue);

        if (newValue !== null && newValue.trim() !== "") {
            // Update UI
            todoItem.innerText = newValue;

            // Update Local Storage
            let todos = JSON.parse(localStorage.getItem('todos'));
            const index = todos.indexOf(oldValue);
            if (index !== -1) {
                todos[index] = newValue;
            } else {
                // fallback: search by element in DOM
                const currentItems = document.querySelectorAll('.todo-item');
                currentItems.forEach((el, i) => {
                    if (el === todoItem) {
                        todos[i] = newValue;
                    }
                });
            }
            localStorage.setItem('todos', JSON.stringify(todos));
        }
    }
}

// Saving to local storage:
function savelocal(todo) {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.forEach(function (todo) {
        // toDo DIV;
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add("todo", `${savedTheme}-todo`);

        // Create LI
        const newToDo = document.createElement('li');
        newToDo.innerText = todo;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);

        // check btn;
        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add("check-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(checked);

        // delete btn;
        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add("delete-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);

        // edit btn;
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.classList.add('edit-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(editBtn);

        // Append to list;
        toDoList.appendChild(toDoDiv);
    });
}

function removeLocalTodos(todo) {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    const todoIndex = todos.indexOf(todo.children[0].innerText);
    todos.splice(todoIndex, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Change theme function:
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');

    document.body.className = color;

    // Change blinking cursor for darker theme:
    color === 'darker' ?
        document.getElementById('title').classList.add('darker-title')
        : document.getElementById('title').classList.remove('darker-title');

    document.querySelector('input').className = `${color}-input`;

    document.querySelectorAll('.todo').forEach(todo => {
        Array.from(todo.classList).some(item => item === 'completed') ?
            todo.className = `todo ${color}-todo completed`
            : todo.className = `todo ${color}-todo`;
    });

    document.querySelectorAll('button').forEach(button => {
        Array.from(button.classList).some(item => {
            if (item === 'check-btn') {
                button.className = `check-btn ${color}-button`;
            } else if (item === 'delete-btn') {
                button.className = `delete-btn ${color}-button`;
            } else if (item === 'todo-btn') {
                button.className = `todo-btn ${color}-button`;
            } else if (item === 'edit-btn') {
                button.className = `edit-btn ${color}-button`;
            }
        });
    });
}
