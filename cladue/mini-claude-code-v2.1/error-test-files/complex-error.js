
function UserList({ users }) {
  // 这里可能 users 是 undefined
  return users.map(user => (
    <div key={user.id}>
      <h3>{user.name}</h3>
    </div>
  ));
}
