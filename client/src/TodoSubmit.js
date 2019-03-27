import React, {Component} from "react";
import { createTodo } from "./buttonFunctions";

class TodoSubmit extends Component {
    constructor (props) {
        super(props);
        this.state= {
            value: ""
        };
    }

    handleChange = (event) => {
        this.setState({
            value: event.target.value
        });
    }

    handleSubmit = (event) => {
        createTodo(this.props.socket, this.state.value);
        this.setState({
            value: ""
        });
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Todo: 
                    <input id="todo-input-box" type= "text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input id="submit-todo" type="submit" value= "Submit"></input>
            </form>
        )
    }
}

export default TodoSubmit;