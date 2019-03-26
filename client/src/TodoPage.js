import React, { Component } from 'react';
import "./TodoPage.css";
import socketIOClient from "socket.io-client";
import TodoHeader from "./TodoHeader";
import DeleteAllCompletedButton from './DeleteAllCompletedButton';
import TodoList from "./TodoList";


const serverUrl = "http://localhost:8080";

class TodoPage extends Component { 
    constructor(props) {
        super(props); 
        this.state = {
            filter: "all",
            todos: []
        }
    }

    componentDidMount() {
        this.socket = socketIOClient(serverUrl);

        this.socket.on("todos", (todos) => {
            this.setState({
                todos: todos
            })
        })   
    }

    componentWillUnmount() {
        this.socket.disconnect(true);
    }

    render() {
        return (
            <div className="TodoPage">
                <TodoHeader nTodos={this.state.todos.length} />
                <TodoList todos={this.state.todos} socket={this.socket} filter={this.filter}/>
                <DeleteAllCompletedButton todos={this.state.todos} socket={this.socket} />
            </div>
        )
    }
}

export default TodoPage;
