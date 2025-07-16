
import React from 'react';

function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li>{todo.text}</li>
      ))}
    </ul>
  );
}

function UserList({ users }) {
  return (
    <div>
      {users.map((user, index) => (
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}

export default TodoList;
