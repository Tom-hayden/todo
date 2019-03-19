import React, { Component } from 'react';
import "./TodoPage.css";

class TodoPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: "all",
            todos: [].concat(props.todos)
        }
    }

    todoHeader() {
        return (
            <div>
                <h1>
                    Todo List
                </h1>
                {this.filterSelector()}
                {this.todoCounter()}
            </div>
        )
    }

    todoCounter() {
        return (
            <div>
                Number of Todos: {this.state.todos.length}
            </div>
        )
    }

    todoList() {
        const listItems = this.state.todos.map((todo) => {
            if (this.state.filter === "all") {
                return this.getTodoListItem(todo)
            } else if (this.state.filter === "completed") {
                if (!todo.isComplete) {
                    return this.getTodoListItem(todo)
                } else {
                    return null;
                }
            } else if (this.state.filter === "active") {
                if (todo.isComplete) {
                    return this.getTodoListItem(todo)
                } else {
                    return null;
                }
            } else {
                console.log("This is an error");
                return null;
            }
        })
        return listItems;
    }



    getTodoListItem(todo) {
        return (
            <li key={todo.id}>
                <div>
                    {todo.title}
                </div>
                <div>
                    {this.createDeleteButton(todo)}
                </div>
                {!todo.isComplete &&
                    <div>
                        {this.createCompleteButton(todo)}
                    </div>
                }
            </li>
        );
    }

    createDeleteButton(todo) {
        return (
            <button>
                Delete
            </button>
        )
    }

    createCompleteButton(todo) {
        return (
            <button>
                Complete
            </button>
        )
    }

    DeleteCompleted(todo) {
        const containsCompleted = (todos) => {
            return todos.some((todo) => {
                return todo.isComplete;
            });
        }

        if (containsCompleted(this.state.todos)) {
            return (
                <button>
                    Delete complete
                </button>
            );
        } else {
            return;
        }

    }

    filterSelector() {
        return (
            <select id="filter-dropdown" name="filter">
                <option value="all" id="dropdown-all">All</option>
                <option value="active" id="dropdown-active">Active</option>
                <option value="complete" id="dropdown-complete">Complete</option>
            </select>
        )
    }

    render() {
        return (
            <div className="TodoPage">
                {this.todoHeader()}
                {this.todoList()}
                {this.DeleteCompleted()}
            </div>
        )
    }
}

export default TodoPage;
