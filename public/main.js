var todoList = document.getElementById("todo-list");
var todoListLoading = document.getElementById("todo-list-Loading");
var form = document.getElementById("todo-form");
var todoTitle = document.getElementById("new-todo");
var error = document.getElementById("error");

form.onsubmit = function(event) {
    var title = todoTitle.value;
    createTodo(title, function() {
        reloadTodoList();
    });
    todoTitle.value = "";
    event.preventDefault();
};

function createTodo(title, callback) {
    var createRequest = new XMLHttpRequest();
    createRequest.open("POST", "/api/todo");
    createRequest.setRequestHeader("Content-type", "application/json");
    createRequest.send(JSON.stringify({
        title: title
    }));
    createRequest.onload = function() {
        if (this.status === 201) {
            callback();
        } else {
            error.textContent = "Failed to create item. Server returned " + this.status + " - " + this.responseText;
        }
    };
}

function getTodoList(callback) {
    var createRequest = new XMLHttpRequest();
    createRequest.open("GET", "/api/todo");
    createRequest.onload = function() {
        if (this.status === 200) {
            callback(JSON.parse(this.responseText));
        } else {
            error.textContent = "Failed to get list. Server returned " + this.status + " - " + this.responseText;
        }
    };
    createRequest.send();
}

function reloadTodoList() {
    clearToDoList();
    displayLoadingScreen();
    populateTodoList();
}

function clearToDoList() {
    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }
}

function displayLoadingScreen() {
    todoListLoading.style.display = "block";
}

function hideLoadingScreen() {
    todoListLoading.style.display = "none";
}

function populateTodoList() {
    getTodoList(function(todos) {
        hideLoadingScreen();
        todos.forEach(function(todo) {
            todoList.appendChild(createListItem(todo));
        });
    });
}

function createListItem(todo) {
    var listItem = document.createElement("li");
    listItem.textContent = todo.title;
    listItem.appendChild(createDeleteButton(todo.id));
    return listItem;
}

function createDeleteButton(id) {
    var btn = document.createElement("BUTTON");
    var t = document.createTextNode("Delete");
    btn.appendChild(t);
    btn.id = "del_" + id;
    btn.onclick = deleteItem;
    return btn;
}

function deleteItem() {
    var createRequest = new XMLHttpRequest();
    createRequest.open("DELETE", "/api/todo/" + getButtonId(this.id));
    createRequest.setRequestHeader("Content-type", "application/json");
    createRequest.send();
    createRequest.onload = function() {
        if (this.status === 200) {
            reloadTodoList();
        } else {
            error.textContent = "Failed to delete item. Server returned " + this.status + " - " + this.responseText;
        }
    };
}

function getButtonId(id) {
    return id.substring(4);  // removing 'del_' prefix from id
}
reloadTodoList();
