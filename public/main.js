const todoList = document.getElementById("todo-list");
const todoListLoading = document.getElementById("todo-list-Loading");
const form = document.getElementById("todo-form");
const todoTitle = document.getElementById("new-todo");
const error = document.getElementById("error");
const todoUncompleteCount = document.getElementById("count-label");
var todosLocal;
var todoFilter = "all";

document.addEventListener("DOMContentLoaded", async function() {
    document.querySelector("select[name='filter']").onchange = await filterChangeHandler;
}, false);

async function filterChangeHandler(event) {
    todoFilter = event.target.value.toLowerCase();
    const withGet = false
    await reloadTodoList(withGet);
}

form.onsubmit = async function(event) {
    const title = todoTitle.value;
    if (await createTodo(title)) {
        await reloadTodoList();
    }
    todoTitle.value = "";
    event.preventDefault();
};

async function createTodo(title) {
    const response = await fetch("/api/todo", {
        method: "post",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            title: title
        })
    });
    if (response.ok) {
        return true;
    } else {
        error.textContent = "Failed to create item. Server returned " + response.status +
            " - " + response.statusText;
        return false;
    }
}

async function getTodoList() {
    const response = await fetch("/api/todo");
    if (response.ok) {
        const responseBody = await response.json();
        return responseBody;
    } else {
        error.textContent = "Failed to get list. Server returned " +
            response.status + " - " + response.statusText;
    }
}

async function completeItem(todo) {
    const response = await fetch("/api/todo/" + todo.id, {
        method: "put",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            title: todo.title,
            isComplete: true
        })
    });
    if (response.ok) {
        return true;
    } else {
        error.textContent = "Failed to update item. Server returned " +
            response.status + " - " + response.statusText;
        return false;
    }
}

async function deleteItem(todo) {
    const response = await fetch("/api/todo/" + todo.id, {
        method: "delete"
    });
    if (response.ok) {
        return true;
    } else {
        error.textContent = "Failed to delete item. Server returned " +
            response.status + " - " + response.statusText;
        return false;
    }
}

async function reloadTodoList(withGet = true) {
    clearPage();
    displayLoadingScreen();
    if (withGet) {
        const newTodos = await getTodoList()
        if (newTodos) {
            todosLocal = newTodos;
            populatePage(todosLocal);
        }
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
    btn.onclick = async function() {
        if (await deleteItem(todo)) {
            await reloadTodoList();
        }
    }
    return btn;
}

function createCompleteButton(todo) {
    let btn = createButtonElement("buttonComplete");
    const t = document.createTextNode("Complete");
    btn.appendChild(t);
    btn.id = "complete_" + todo.id;
    btn.onclick = async function() {
        if (await completeItem(todo)) {
            await reloadTodoList();
        }
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
    btn.onclick = async function() {
        await deleteAllCompleted(todos);
    }
    return btn;
}

async function deleteAllCompleted(todos) {
    todos.forEach(function(todo) {
        if (todo.isComplete === true) {
            await deleteItem(todo)
        }
    });
    await reloadTodoList();
}

function createButtonElement(buttonType) {
    let btn = document.createElement("BUTTON");
    btn.classList.add("button");
    btn.classList.add(buttonType);
    return btn;
}

async function poll() {
    const newTodos = await getTodoList()
    if (newTodos !== todosLocal) {
        todosLocal = newTodos;
        var withGet = false;
        await reloadTodoList(withGet);
    }
    window.setTimeout(poll,5000);

}

poll();
