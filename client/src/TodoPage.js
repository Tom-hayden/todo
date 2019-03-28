import React, { Component } from "react";
import "./TodoPage.css";
import socketIOClient from "socket.io-client";
import TodoHeader from "./TodoHeader";
import DeleteAllCompletedButton from "./DeleteAllCompletedButton";
import TodoList from "./TodoList";
import TodoSubmit from "./TodoSubmit";
import LoadingPage from "./LoadingPage";
import todoFilters from "./todoListFilters";


class TodoPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: todoFilters.all,
            todos: [],
            recievedData: false
        }
    }

    componentDidMount() {
        this.socket = socketIOClient();

        this.socket.on("todos", (todos) => {
            this.setState({
                todos: todos,
                hasRecievedData: true
            })
        })
    }

    componentWillUnmount() {
        this.socket.disconnect(true);
    }

    onFilterChange(filter) {
        this.setState({
            filter: todoFilters[filter]
        })
    }

    render() {

        let todoList;
        if (this.state.hasRecievedData) {
            todoList = (
                <div id="todo-list-container">
                    <TodoList todos={this.state.todos} socket={this.socket} filter={this.state.filter}/>
                    <DeleteAllCompletedButton todos={this.state.todos} socket={this.socket} />
                </div>
            );
        } else {
            todoList = (
                <div>
                    <LoadingPage />
                </div>
            )
        }

        return (
            <div className="TodoPage">
                <TodoHeader todos={this.state.todos} onFilterChange={this.onFilterChange}/>
                <TodoSubmit socket={this.socket}/>
                {todoList}
            </div>
        )
    }
}

export default TodoPage;
