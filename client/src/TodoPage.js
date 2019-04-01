import React, { Component } from "react";
import "./TodoPage.css";
import socketIOClient from "socket.io-client";
import TodoHeader from "./TodoHeader";
import TodoSubmit from "./TodoSubmit";
import todoFilters from "./todoListFilters";
import TodoListContainer from "./TodoListContainer";


class TodoPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: todoFilters.all,
            todos: [],
            hasRecievedData: false
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
        
        return (
            <div className="TodoPage" style={{"overflow":"hidden"}}>
                <TodoHeader todos={this.state.todos} onFilterChange={this.onFilterChange.bind(this)}/>
                <TodoSubmit socket={this.socket}/>
                <TodoListContainer todos={this.state.todos} socket={this.socket} filter={this.state.filter.bind(this)}
                    hasRecievedData={this.state.hasRecievedData}/>
            </div>
        )
    }
}

export default TodoPage;
