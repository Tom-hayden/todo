const todoList = document.getElementById("todo-list");
const todoListLoading = document.getElementById("todo-list-Loading");
const form = document.getElementById("todo-form");
const todoTitle = document.getElementById("new-todo");
const error = document.getElementById("error");
const todoUncompleteCount = document.getElementById("count-label");
var todosLocal;
var todoFilter = "all";

document.addEventListener("DOMContentLoaded",function() {
    document.querySelector("select[name='filter']").onchange = filterChangeHandler;
},false);

function filterChangeHandler(event) {
    todoFilter = event.target.value.toLowerCase();
    const withGet = false
    reloadTodoList(withGet);
}

form.onsubmit = function(event) {
    const title = todoTitle.value;
    createTodo(title, function() {
        reloadTodoList();
    });
    todoTitle.value = "";
    event.preventDefault();
};

function createTodo(title, callback) {
    fetch("/api/todo", {
        method: "post",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            title: title
        })
    }).then(function(res) {
        if (res.ok) {
            callback();
        } else {
            error.textContent = "Failed to create item. Server returned " + res.status + " - " + res.statusText;
        }
    });
}

function getTodoList(callback) {
    fetch("/api/todo").then(function(res) {
        if (res.ok) {
            res.json().then(function (res) {
                callback(res);
            });
        } else {
            error.textContent = "Failed to get list. Server returned " + res.status + " - " + res.statusText;
        }
    });
}

function completeItem(todo, callback) {
    fetch("/api/todo/" + todo.id, {
        method: "put",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            title: todo.title,
            isComplete: true
        })
    }).then(function(res) {
        if (res.ok) {
            callback();
        } else {
            error.textContent = "Failed to update item. Server returned " + res.status + " - " + res.statusText;
        }
    });
}

function deleteItem(todo, callback) {
    fetch("/api/todo/" + todo.id, {
        method: "delete"
    }).then(function(res) {
        if (res.ok) {
            callback();
        } else {
            error.textContent = "Failed to delete item. Server returned " + res.status + " - " + res.statusText;
        }
    });
}

function reloadTodoList(withGet = true) {
    clearPage();
    displayLoadingScreen();
    if (withGet) {
        getTodoList(function(res) {
            todosLocal = res;
            populatePage(todosLocal);
        });
    } else {
        populatePage(todosLocal);
    }
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
        deleteItem(todo, reloadTodoList);
    }
    return btn;
}

function createCompleteButton(todo) {
    let btn = createButtonElement("buttonComplete");
    const t = document.createTextNode("Complete");
    btn.appendChild(t);
    btn.id = "complete_" + todo.id;
    btn.onclick = function() {
        completeItem(todo, reloadTodoList);
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
            deleteItem(todo, function() {});
        }
    });
    reloadTodoList();
}

function createButtonElement(buttonType) {
    let btn = document.createElement("BUTTON");
    btn.classList.add("button");
    btn.classList.add(buttonType);
    return btn;
}

reloadTodoList();
