var todoList = document.getElementById("todo-list");
var todoListLoading = document.getElementById("todo-list-Loading");
var form = document.getElementById("todo-form");
var todoTitle = document.getElementById("new-todo");
var error = document.getElementById("error");
var todoUncompleteCount = document.getElementById("count-label");

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
    clearPage();
    displayLoadingScreen();
    populatePage();
}

function clearPage() {
    clearTodo();
    clearUncompleteCounter();
}

function clearUncompleteCounter() {
    while (todoUncompleteCount.firstChild) {
        todoUncompleteCount.removeChild(todoUncompleteCount.firstChild);
    }
}

function clearTodo() {
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

function populatePage() {
    getTodoList(function(todos) {
        populateTodoList(todos);
        updateTodoCounter(todos);
        if (containsCompleted(todos)) {
            todoList.appendChild(createDeleteAllButton(todos));
        }
    });
}

function containsCompleted(todos) {
    var numberCompleted = todos.filter(function(todo) {
        return todo.isComplete;
    });
    return numberCompleted.length > 0;
}

function populateTodoList(todos) {
    hideLoadingScreen();
    todos.forEach(function(todo) {
        todoList.appendChild(createListItem(todo));
    });
}

function updateTodoCounter(todos) {
    var uncompleteTodos = todos.filter(function(todo) {
        return todo.isComplete === false;
    }).length;
    var text = document.createTextNode(uncompleteTodos);
    todoUncompleteCount.appendChild(text);
}

function createListItem(todo) {
    var listItem = document.createElement("li");
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
    var btn = createButtonElement("buttonDelete");
    var t = document.createTextNode("Delete");
    btn.appendChild(t);
    btn.id = "del_" + todo.id;
    btn.onclick = function() {
        deleteItem(todo, reloadTodoList);
    }
    return btn;
}

function createDeleteAllButton(todos) {
    var btn = createButtonElement("buttonDelete");
    var t = document.createTextNode("Deleted Completed");
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
            deleteItem(todo, function() {});
        }
    });
    reloadTodoList();
}

function createButtonElement(buttonType) {
    var btn = document.createElement("BUTTON");
    btn.classList.add("button");
    btn.classList.add(buttonType);
    return btn;
}

function createCompleteButton(todo) {
    var btn = createButtonElement("buttonComplete");
    var t = document.createTextNode("Complete");
    btn.appendChild(t);
    btn.id = "complete_" + todo.id;
    btn.onclick = function() {
        completeItem(todo, reloadTodoList);
    }
    return btn;
}

function completeItem(todo, callback) {
    var createRequest = new XMLHttpRequest();
    createRequest.open("PUT", "/api/todo/" + todo.id);
    createRequest.setRequestHeader("Content-type", "application/json");
    createRequest.send(JSON.stringify({
        isComplete: true,
        title: todo.title
    }));
    createRequest.onload = function() {
        if (this.status === 200) {
            callback();
        } else {
            error.textContent = "Failed to update item. Server returned " + this.status + " - " + this.responseText;
        }
    };
}

function deleteItem(todo, callback) {
    var createRequest = new XMLHttpRequest();
    createRequest.open("DELETE", "/api/todo/" + todo.id);
    createRequest.setRequestHeader("Content-type", "application/json");
    createRequest.send();
    createRequest.onload = function() {
        if (this.status === 200) {
            callback();
        } else {
            error.textContent = "Failed to delete item. Server returned " + this.status + " - " + this.responseText;
        }
    };
}

reloadTodoList();
