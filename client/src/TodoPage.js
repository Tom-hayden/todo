import React, { Component } from 'react';
import "./TodoPage.css";
import socketIOClient from "socket.io-client";
import TodoHeader from "./TodoHeader";
import DeleteAllCompletedButton from './DeleteAllCompletedButton';
import TodoList from "./TodoList";
import TodoSubmit from "./TodoSubmit";
import LoadingPage from "./LoadingPage";

class TodoPage extends Component { 
    constructor(props) {
        super(props); 
        this.state = {
            filter: "all",
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

    onFilterChange = (filter) => {
        this.setState({
            filter: filter
        })
    }

    render() {

        let todoList;
        if (this.state.hasRecievedData) {
            todoList = (
                <div>
                    <TodoList todos={this.state.todos} socket={this.socket} filter={this.state.filter}/>
                    <DeleteAllCompletedButton todos={this.state.todos} socket={this.socket} />
                </div>
            );
        } else {
            todoList =(
                <div>
                    <LoadingPage />
                </div>
            )
        }

        return (
            <div className="TodoPage">
                <TodoHeader nTodos={this.state.todos.length} onFilterChange={this.onFilterChange}/>
                <TodoSubmit socket={this.socket}/>
                {todoList}
            </div>
        )
    }
}

export default TodoPage;
