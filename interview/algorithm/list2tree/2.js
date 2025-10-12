const flatList = [
  { id: 1, parentId: null, name: "A" },
  { id: 2, parentId: 1, name: "B" },
  { id: 3, parentId: 1, name: "C" },
  { id: 4, parentId: 2, name: "D" },
  { id: 5, parentId: null, name: "E" },
];

// 输入是没有树状结构的
// 是一个树状数组

// 借助HashMap id 查找 O(1)

// function listToTree(list) {
//   const map = new Map(); // id 查找 O(1) 哈希表
//   const tree = [];

//   list.forEach((item) => {
//     map.set(item.id, {
//       ...item,
//       children: [],
//     });
//   });
//   list.forEach((item) => {
//     if (item.parentId) {
//       const parent = map.get(item.parentId);
//       if (parent) {
//         parent.children.push(item);
//       }
//     }
//   });
//   return tree;
// }

function listToTree(list, rootId = null) {
  const tree = [];
  const map = new Map(); // hash 表  id 查找O(1)  parentId
  list.forEach((item) => {
    map.set(item.id, {
      ...item,
      children: [],
    });
  });

  console.log(map);

  list.forEach((item) => {
    const node = map.get(item.id);
    if (item.parentId === rootId) {
      tree.push(node);
    } else {
      const parentNode = map.get(item.parentId);
      if (parentNode) {
        parentNode.children.push(node);
      }
    }
  });

  return tree;
}

console.log(listToTree(flatList));
