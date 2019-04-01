import React from "react";
import TodoListItem from "./TodoListItem";
import PropTypes from "prop-types";
import { Divider } from "semantic-ui-react";


const TodoList = ({todos, socket, filter}) => {

    const filteredTodoList = filter(todos);
    const listItems = filteredTodoList.map((todo, index) => {
        return (
            <div key={todo.id}>
                <TodoListItem socket={socket} todo={todo}/>
                {index !== filteredTodoList.length -1 && <Divider />}
            </div>
        );
        });
    return (
        <ul id="todo-list">
            {listItems}
        </ul>
    )
}

TodoList.propTypes = {
    todos: PropTypes.array,
    socket: PropTypes.object,
    filter: PropTypes.func
}

export default TodoList;
