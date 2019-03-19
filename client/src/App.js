import React, { Component } from 'react';
import './App.css';
import TodoPage from "./TodoPage";


class App extends Component {

  render() {
    const todoTest = [
      {
        "id": "0",
        "isComplete": false,
        "title": "hello"
      },
      {
        "id": "1",
        "isComplete": false,
        "title": "I want to "
      },
      {
        "id": "2",
        "isComplete": true,
        "title": "Win the prize "
      }
    ];
    return (
      <TodoPage todos={todoTest} />
    );
  }
}

export default App;
