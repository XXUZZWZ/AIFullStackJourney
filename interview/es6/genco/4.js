  // 快速检测：这个状态机对应什么？
  switch(n){
    case 0: return fetch('/user');
    case 1: return fetch('/posts');
    case 2: return [n[0], n[1]];
  }
  // 你的答案：______

  async function getFetch(){
    const user = await fetch('/user');
    const posts = await fetch('/posts');
    return [user,posts]
  }