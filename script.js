let todos = JSON.parse(localStorage.getItem('todos')) || [];
let isLatestFirst = JSON.parse(localStorage.getItem('isLatestFirst')) || true;

document.getElementById('todoInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

function toggleSection(section) {
    const content = document.getElementById(`${section}-section`);
    const header = content.previousElementSibling;
    content.classList.toggle('expanded');
    header.classList.toggle('active');
}

function addTodo() {
    const input = document.getElementById('todoInput');
    const dueInput = document.getElementById('dueDateInput');
    const text = input.value.trim();
    const dueDate = dueInput.value;

    if (text) {
        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            dueDate: dueDate,
            timestamp: new Date()
        };

        todos.push(todo);
        saveTodos();
        input.value = '';
        dueInput.value = '';
        renderTodos();
    }
}


function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos(); // Save to local storage
    renderTodos();
}

function toggleComplete(id) {
    todos = todos.map(todo => 
        todo.id === id ? {...todo, completed: !todo.completed} : todo
    );
    saveTodos(); // Save to local storage
    renderTodos();
}

function toggleSort() {
    isLatestFirst = !isLatestFirst;
    localStorage.setItem('isLatestFirst', JSON.stringify(isLatestFirst)); // Save sort preference
    const button = document.querySelector('.sort-button');
    button.innerHTML = isLatestFirst ? "Sort by Oldest <i class='bx bx-sort' ></i>" : "Sort by Latest <i class='bx bx-sort' ></i>";
    renderTodos();
}

function editTodo(id) {
    document.getElementById(`text-${id}`).style.display = "none";
    document.getElementById(`edit-${id}`).style.display = "inline-block";
    document.querySelector(`#edit-${id}`).focus();
    document.querySelector(`.save-btn[onclick="saveEdit(${id})"]`).style.display = "inline-block";
    document.querySelector(`.edit-btn[onclick="editTodo(${id})"]`).style.display = "none";
}

function saveEdit(id) {
    const newText = document.getElementById(`edit-${id}`).value.trim();
    if (newText) {
        todos = todos.map(todo =>
            todo.id === id ? { ...todo, text: newText } : todo
        );
        saveTodos();
        renderTodos();
    }
}

function isOverdue(dueDateStr, completed) {
    if (!dueDateStr || completed) return false;
    const today = new Date().setHours(0, 0, 0, 0);
    const due = new Date(dueDateStr).setHours(0, 0, 0, 0);
    return due < today;
}


function renderTodos() {
    const uncompletedList = document.getElementById('uncompletedList');
    const completedList = document.getElementById('completedList');
    uncompletedList.innerHTML = '';
    completedList.innerHTML = '';
    
    const sortedTodos = [...todos].sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);

        return isLatestFirst ? 
            dateB - dateA : 
            dateA - dateB;
    });

    let completedCount = 0;
    let uncompletedCount = 0;

    sortedTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
    <input type="checkbox" 
           class="checkbox" 
           ${todo.completed ? 'checked' : ''} 
           onclick="toggleComplete(${todo.id})">
    <span class="todo-text" id="text-${todo.id}">${todo.text}</span>
    ${todo.dueDate ? `<span class="due-date ${isOverdue(todo.dueDate, todo.completed) ? 'overdue' : ''}">Due: ${todo.dueDate}</span>` : ''}
    <input type="text" class="edit-input" id="edit-${todo.id}" value="${todo.text}" style="display:none;">
    <button class="edit-btn" onclick="editTodo(${todo.id})"><i class='bx bx-pencil' ></i></button>
    <button class="save-btn" onclick="saveEdit(${todo.id})" style="display:none;"><i class='bx bx-check' ></i></button>
    <button class="delete-btn" onclick="deleteTodo(${todo.id})"><i class='bx bx-trash' ></i></button>
`;

        
        if (todo.completed) {
            completedList.appendChild(li);
            completedCount++;
        } else {
            uncompletedList.appendChild(li);
            uncompletedCount++;
        }
    });

    // Update counters
    document.getElementById('completed-count').textContent = completedCount;
    document.getElementById('uncompleted-count').textContent = uncompletedCount;

    // Update the sort button label on render
    const button = document.querySelector('.sort-button');
    button.innerHTML = isLatestFirst ? "Sort by Oldest <i class='bx bx-sort' ></i>" : "Sort by Latest <i class='bx bx-sort' ></i>";
}

// Save todos to local storage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('isLatestFirst', JSON.stringify(isLatestFirst));
}

// Initial load from local storage and render
// renderTodos();
window.onload = function() {
    renderTodos();
    // restoreSectionStates();
};

// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const themeLabel = document.getElementById('theme-label');

// Load saved theme on page load
window.onload = function () {
    renderTodos();
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
        themeLabel.textContent = "Light Mode";
    }
};

// Toggle theme and save to localStorage
themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
        themeLabel.textContent = "Light Mode";
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
        themeLabel.textContent = "Dark Mode";
    }
});
