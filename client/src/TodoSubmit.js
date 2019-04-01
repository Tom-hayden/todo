import React, {Component} from "react";
import { createTodo } from "./buttonFunctions";
import PropTypes from "prop-types";
import {Button, Form} from "semantic-ui-react";

class TodoSubmit extends Component {
    constructor (props) {
        super(props);
        this.state = {
            value: ""
        };
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        });
    }

    handleSubmit(event) {
        createTodo(this.props.socket, this.state.value);
        this.setState({
            value: ""
        });
        event.preventDefault();
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit.bind(this)} >
                <Form.Field inline>
                    <label style={{"marginLeft":"30px"}}>
                        Todo:
                    </label>
                        <input id="todo-input-box" type="text" value={this.state.value}
                            onChange={this.handleChange.bind(this)} />

                    <Button attached="right" id="submit-todo" type="submit" value= "Submit" >Submit</Button>
                </Form.Field>
            </Form>
        )
    }
}

TodoSubmit.propTypes = {
    socket: PropTypes.object
}

export default TodoSubmit;
