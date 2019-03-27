import React, { Component } from 'react';
import "./TodoPage.css";
import socketIOClient from "socket.io-client";
import TodoHeader from "./TodoHeader";
import DeleteAllCompletedButton from './DeleteAllCompletedButton';
import TodoList from "./TodoList";
import TodoSubmit from "./TodoSubmit";


const serverUrl = "http://localhost:8080";

class TodoPage extends Component { 
    constructor(props) {
        super(props); 
        this.state = {
            filter: "all",
            todos: []
        }
    }

    componentDidMount = () => {
        this.socket = socketIOClient(serverUrl);

        this.socket.on("todos", (todos) => {
            this.setState({
                todos: todos
            })
        })   
    }

    componentWillUnmount = () => {
        this.socket.disconnect(true);
    }

    onFilterChange = (filter) => {
        this.setState({
            filter: filter
        })
    }

    render = () => {
        return (
            <div className="TodoPage">
                <TodoHeader numberOfTodos={this.state.todos.length} onFilterChange={this.onFilterChange}/>
                <TodoSubmit socket={this.socket}/>
                <TodoList todos={this.state.todos} socket={this.socket} filter={this.state.filter}/>
                <DeleteAllCompletedButton todos={this.state.todos} socket={this.socket} />
            </div>
        )
    }
}

export default TodoPage;
