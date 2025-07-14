
const unusedVariable = 'this will not be used';
let anotherUnused = 42

function test() {
  console.log("Debug statement")
  const localUnused = 'also unused'
  return true
}

// 缺少分号的语句
const result = test()
