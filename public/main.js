const todoList = document.getElementById("todo-list");
const todoListLoading = document.getElementById("todo-list-Loading");
const form = document.getElementById("todo-form");
const todoTitle = document.getElementById("new-todo");
const error = document.getElementById("error");
const todoUncompleteCount = document.getElementById("count-label");
var todosLocal = [];
var todoFilter = "all";

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("select[name='filter']").onchange = filterChangeHandler;
}, false);

function filterChangeHandler(event) {
    todoFilter = event.target.value.toLowerCase();
    reloadTodoList();
}

form.onsubmit = function(event) {
    const title = todoTitle.value;
    createTodo(title);
    todoTitle.value = "";
    event.preventDefault();
};

function createTodo(todo) {
    socket.emit("create", {title: todo});
}

function completeItem(todo) {
    socket.emit("completeTodo", todo.id);
}

function deleteItem(todo) {
    socket.emit("deleteTodo", todo.id);
}

function reloadTodoList() {
    clearPage();
    displayLoadingScreen();
    populatePage(todosLocal);
}

function filterTodoList(todos) {
    if (todoFilter === "all") {
        return todos;
    } else if (todoFilter === "complete") {
        return todos.filter(function(todo) {
            return todo.isComplete;
        });
    } else if (todoFilter === "active") {
        return todos.filter(function(todo) {
            return !todo.isComplete;
        });
    }
}

function clearPage() {
    clearTodo();
    clearUncompleteCounter();
}

function clearTodo() {
    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }
}

function clearUncompleteCounter() {
    while (todoUncompleteCount.firstChild) {
        todoUncompleteCount.removeChild(todoUncompleteCount.firstChild);
    }
}

function displayLoadingScreen() {
    todoListLoading.style.display = "block";
}

function populatePage(todos) {
    todos = filterTodoList(todos)
    populateTodoList(todos);
    updateTodoCounter();
    if (containsCompleted(todos)) {
        todoList.appendChild(createDeleteAllButton(todos));
    }
}

function populateTodoList(todos) {
    hideLoadingScreen();
    todos.forEach(function(todo) {
        todoList.appendChild(createListItem(todo));
    });
}

function hideLoadingScreen() {
    todoListLoading.style.display = "none";
}

function containsCompleted(todos) {
    return todos.some(function(todo) {
        return todo.isComplete;
    })
}

function createListItem(todo) {
    let listItem = document.createElement("li");
    listItem.textContent = todo.title;
    listItem.id = "todo_text_" + todo.id;
    listItem.appendChild(createDeleteButton(todo));
    if (!todo.isComplete) {
        listItem.appendChild(createCompleteButton(todo));
    } else {
        listItem.classList.add("completed");
    }
    return listItem;
}

function createDeleteButton(todo) {
    let btn = createButtonElement("buttonDelete");
    const t = document.createTextNode("Delete");
    btn.appendChild(t);
    btn.id = "del_" + todo.id;
    btn.onclick = function() {
        deleteItem(todo)
    }
    return btn;
}

function createCompleteButton(todo) {
    let btn = createButtonElement("buttonComplete");
    const t = document.createTextNode("Complete");
    btn.appendChild(t);
    btn.id = "complete_" + todo.id;
    btn.onclick = function() {
        completeItem(todo);
    }
    return btn;
}

function updateTodoCounter() {
    const uncompleteTodos = todosLocal.filter(function(todo) {
        return todo.isComplete === false;
    }).length;
    const text = document.createTextNode(uncompleteTodos);
    todoUncompleteCount.appendChild(text);
}

function createDeleteAllButton(todos) {
    let btn = createButtonElement("buttonDelete");
    const t = document.createTextNode("Deleted Completed");
    btn.appendChild(t);
    btn.id = "del_completed";
    btn.onclick = function() {
        deleteAllCompleted(todos);
    }
    return btn;
}

function deleteAllCompleted(todos) {
    todos.forEach(function(todo) {
        if (todo.isComplete === true) {
            deleteItem(todo);
        }
    });
}

function createButtonElement(buttonType) {
    let btn = document.createElement("BUTTON");
    btn.classList.add("button");
    btn.classList.add(buttonType);
    return btn;
}

var socket = io();

socket.on("todos", function(serverTodos) {
    todosLocal = serverTodos;
    reloadTodoList();
})

socket.on("serverError", function(errorMessage) {
    error.textContent = "Server Error: " + errorMessage;
})
